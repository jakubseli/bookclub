package com.example.bookclub.club.controllers;

import com.example.bookclub.club.dtos.BookClubRequest;
import com.example.bookclub.club.dtos.BookClubResponse;
import com.example.bookclub.club.services.BookClubService;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/clubs")
public class BookClubController {

    private final BookClubService bookClubService;

    public BookClubController(BookClubService bookClubService) {
        this.bookClubService = bookClubService;
    }

    @GetMapping
    public PagedModel<BookClubResponse> findAll(@ParameterObject Pageable pageable) {
        return new PagedModel<>(bookClubService.findAll(pageable).map(BookClubResponse::from));
    }

    @GetMapping("/{id}")
    public BookClubResponse findById(@PathVariable Long id) {
        return BookClubResponse.from(bookClubService.findById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookClubResponse create(@Valid @RequestBody BookClubRequest request) {
        return BookClubResponse.from(bookClubService.create(request.toEntity()));
    }

    @PutMapping("/{id}")
    public BookClubResponse update(@PathVariable Long id, @Valid @RequestBody BookClubRequest request) {
        return BookClubResponse.from(bookClubService.update(id, request.toEntity()));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        bookClubService.delete(id);
    }

    @PostMapping("/{id}/members/{userId}")
    public BookClubResponse addMember(@PathVariable Long id, @PathVariable Long userId) {
        return BookClubResponse.from(bookClubService.addMember(id, userId));
    }

    @DeleteMapping("/{id}/members/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeMember(@PathVariable Long id, @PathVariable Long userId) {
        bookClubService.removeMember(id, userId);
    }
}
