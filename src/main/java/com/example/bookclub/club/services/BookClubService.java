package com.example.bookclub.club.services;

import com.example.bookclub.book.services.BookService;
import com.example.bookclub.club.dtos.BookClubResponse;
import com.example.bookclub.club.dtos.ClubImageData;
import com.example.bookclub.club.dtos.ClubTagResponse;
import com.example.bookclub.club.models.BookClub;
import com.example.bookclub.club.models.ClubImage;
import com.example.bookclub.club.models.ClubTag;
import com.example.bookclub.club.repositories.BookClubRepository;
import com.example.bookclub.club.repositories.ClubImageRepository;
import com.example.bookclub.common.ConflictException;
import com.example.bookclub.common.ImageType;
import com.example.bookclub.common.NotFoundException;
import com.example.bookclub.common.UnsupportedImageException;
import com.example.bookclub.user.models.User;
import com.example.bookclub.user.services.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Service
public class BookClubService {

    private final BookClubRepository bookClubRepository;
    private final ClubImageRepository clubImageRepository;
    private final UserService userService;
    private final BookService bookService;

    public BookClubService(BookClubRepository bookClubRepository, ClubImageRepository clubImageRepository,
                           UserService userService, BookService bookService) {
        this.bookClubRepository = bookClubRepository;
        this.clubImageRepository = clubImageRepository;
        this.userService = userService;
        this.bookService = bookService;
    }

    @Transactional(readOnly = true)
    public Page<BookClubResponse> findAll(Long memberId, Pageable pageable) {
        Page<BookClub> clubs = memberId == null
                ? bookClubRepository.findAll(pageable)
                : bookClubRepository.findByMembersId(memberId, pageable);
        return clubs.map(BookClubResponse::from);
    }

    @Transactional(readOnly = true)
    public BookClubResponse findById(Long id) {
        return BookClubResponse.from(findClub(id));
    }

    @Transactional
    public BookClubResponse create(BookClub club, Long ownerId) {
        User owner = userService.findUser(ownerId);
        club.setOwner(owner);
        club.addMember(owner);
        return BookClubResponse.from(bookClubRepository.save(club));
    }

    @Transactional
    public BookClubResponse update(Long id, BookClub updated, Long userId) {
        BookClub existing = findOwnedClub(id, userId);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setTags(updated.getTags());
        if (updated.getImagePreset() != null) {
            if (existing.hasUploadedImage()) {
                clubImageRepository.deleteById(id);
            }
            existing.choosePreset(updated.getImagePreset());
        }
        return BookClubResponse.from(existing);
    }

    @Transactional
    public BookClubResponse startReading(Long id, Long bookId, LocalDate from, LocalDate until, Long userId) {
        BookClub club = findOwnedClub(id, userId);
        club.startReading(bookService.findBook(bookId), from, until);
        return BookClubResponse.from(club);
    }

    @Transactional
    public void delete(Long id, Long userId) {
        bookClubRepository.delete(findOwnedClub(id, userId));
    }

    @Transactional
    public BookClubResponse addMember(Long clubId, Long userId) {
        BookClub club = findClub(clubId);
        club.addMember(userService.findUser(userId));
        return BookClubResponse.from(club);
    }

    @Transactional
    public void removeMember(Long clubId, Long userId) {
        BookClub club = findClub(clubId);
        if (club.isOwnedBy(userId)) {
            throw new ConflictException("The owner can't leave their own club");
        }
        club.removeMember(userService.findUser(userId));
    }

    public List<ClubTagResponse> findTags() {
        return Arrays.stream(ClubTag.values()).map(ClubTagResponse::from).toList();
    }

    @Transactional
    public BookClubResponse uploadImage(Long id, byte[] bytes, Long userId) {
        BookClub club = findOwnedClub(id, userId);
        ImageType type = ImageType.detect(bytes)
                .orElseThrow(() -> new UnsupportedImageException("The image must be a JPEG, PNG or WebP file"));
        ClubImage image = clubImageRepository.findById(id).orElseGet(() -> new ClubImage(club));
        image.replace(type.getContentType(), bytes);
        clubImageRepository.save(image);
        club.useUploadedImage();
        return BookClubResponse.from(club);
    }

    @Transactional(readOnly = true)
    public ClubImageData findImage(Long id) {
        return clubImageRepository.findById(id)
                .map(ClubImageData::from)
                .orElseThrow(() -> new NotFoundException("Book club " + id + " has no uploaded image"));
    }

    private BookClub findClub(Long id) {
        return bookClubRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Book club " + id + " not found"));
    }

    private BookClub findOwnedClub(Long id, Long userId) {
        BookClub club = findClub(id);
        if (!club.isOwnedBy(userId)) {
            throw new AccessDeniedException("Only the owner can change book club " + id);
        }
        return club;
    }
}
