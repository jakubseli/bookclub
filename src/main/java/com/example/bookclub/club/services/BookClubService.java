package com.example.bookclub.club.services;

import com.example.bookclub.club.models.BookClub;
import com.example.bookclub.club.repositories.BookClubRepository;
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

    public BookClubService(BookClubRepository bookClubRepository, UserService userService) {
        this.bookClubRepository = bookClubRepository;
        this.userService = userService;
    }

    public Page<BookClub> findAll(Pageable pageable) {
        return bookClubRepository.findAll(pageable);
    }

    public BookClub findById(Long id) {
        return bookClubRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Book club " + id + " not found"));
    }

    @Transactional
    public BookClub create(BookClub club, Long ownerId) {
        User owner = userService.findById(ownerId);
        club.setOwner(owner);
        club.addMember(owner);
        return bookClubRepository.save(club);
    }

    @Transactional
    public BookClub update(Long id, BookClub updated, Long userId) {
        BookClub existing = findOwnedClub(id, userId);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        return existing;
    }

    @Transactional
    public void delete(Long id, Long userId) {
        bookClubRepository.delete(findOwnedClub(id, userId));
    }

    @Transactional
    public BookClub addMember(Long clubId, Long userId) {
        BookClub club = findById(clubId);
        club.addMember(userService.findById(userId));
        return club;
    }

    @Transactional
    public void removeMember(Long clubId, Long userId) {
        findById(clubId).removeMember(userService.findById(userId));
    }

    private BookClub findOwnedClub(Long id, Long userId) {
        BookClub club = findById(id);
        if (!club.isOwnedBy(userId)) {
            throw new AccessDeniedException("Only the owner can change book club " + id);
        }
        return club;
    }
}
