package com.example.bookclub.club.services;

import com.example.bookclub.book.models.Book;
import com.example.bookclub.book.services.BookService;
import com.example.bookclub.club.dtos.BookClubResponse;
import com.example.bookclub.club.models.BookClub;
import com.example.bookclub.club.repositories.BookClubRepository;
import com.example.bookclub.common.ConflictException;
import com.example.bookclub.common.NotFoundException;
import com.example.bookclub.user.models.User;
import com.example.bookclub.user.services.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookClubService {

    private final BookClubRepository bookClubRepository;
    private final UserService userService;
    private final BookService bookService;

    public BookClubService(BookClubRepository bookClubRepository, UserService userService, BookService bookService) {
        this.bookClubRepository = bookClubRepository;
        this.userService = userService;
        this.bookService = bookService;
    }

    @Transactional(readOnly = true)
    public Page<BookClubResponse> findAll(Pageable pageable) {
        return bookClubRepository.findAll(pageable).map(BookClubResponse::from);
    }

    @Transactional(readOnly = true)
    public BookClubResponse findById(Long id) {
        return BookClubResponse.from(findClub(id));
    }

    @Transactional
    public BookClubResponse create(BookClub club, Long currentBookId, Long ownerId) {
        User owner = userService.findUser(ownerId);
        club.setCurrentBook(findCurrentBook(currentBookId));
        club.setOwner(owner);
        club.addMember(owner);
        return BookClubResponse.from(bookClubRepository.save(club));
    }

    @Transactional
    public BookClubResponse update(Long id, BookClub updated, Long currentBookId, Long userId) {
        BookClub existing = findOwnedClub(id, userId);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setCurrentBook(findCurrentBook(currentBookId));
        return BookClubResponse.from(existing);
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

    private BookClub findClub(Long id) {
        return bookClubRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Book club " + id + " not found"));
    }

    private Book findCurrentBook(Long bookId) {
        return bookId == null ? null : bookService.findBook(bookId);
    }

    private BookClub findOwnedClub(Long id, Long userId) {
        BookClub club = findClub(id);
        if (!club.isOwnedBy(userId)) {
            throw new AccessDeniedException("Only the owner can change book club " + id);
        }
        return club;
    }
}
