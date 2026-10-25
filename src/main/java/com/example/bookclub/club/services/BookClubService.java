package com.example.bookclub.club.services;

import com.example.bookclub.club.models.BookClub;
import com.example.bookclub.club.repositories.BookClubRepository;
import com.example.bookclub.common.NotFoundException;
import com.example.bookclub.user.services.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    public BookClub create(BookClub club) {
        return bookClubRepository.save(club);
    }

    public BookClub update(Long id, BookClub updated) {
        BookClub existing = findById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        return bookClubRepository.save(existing);
    }

    public void delete(Long id) {
        bookClubRepository.delete(findById(id));
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
}
