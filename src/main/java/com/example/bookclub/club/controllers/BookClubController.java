package com.example.bookclub.club.controllers;

import com.example.bookclub.club.dtos.BookClubRequest;
import com.example.bookclub.club.dtos.BookClubResponse;
import com.example.bookclub.club.dtos.ClubImageData;
import com.example.bookclub.club.dtos.ClubTagResponse;
import com.example.bookclub.club.services.BookClubService;
import com.example.bookclub.common.CurrentUserId;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Duration;
import java.util.List;

@RestController
@RequestMapping("/api/v1/clubs")
public class BookClubController {

    private final BookClubService bookClubService;

    public BookClubController(BookClubService bookClubService) {
        this.bookClubService = bookClubService;
    }

    @GetMapping
    public PagedModel<BookClubResponse> findAll(@ParameterObject Pageable pageable) {
        return new PagedModel<>(bookClubService.findAll(pageable));
    }

    @GetMapping("/tags")
    public List<ClubTagResponse> findTags() {
        return bookClubService.findTags();
    }

    @GetMapping("/{id}")
    public BookClubResponse findById(@PathVariable Long id) {
        return bookClubService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookClubResponse create(@Valid @RequestBody BookClubRequest request, @CurrentUserId Long userId) {
        return bookClubService.create(request.toEntity(), request.currentBookId(), userId);
    }

    @PutMapping("/{id}")
    public BookClubResponse update(@PathVariable Long id, @Valid @RequestBody BookClubRequest request,
                                   @CurrentUserId Long userId) {
        return bookClubService.update(id, request.toEntity(), request.currentBookId(), userId);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, @CurrentUserId Long userId) {
        bookClubService.delete(id, userId);
    }

    @PutMapping(path = "/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public BookClubResponse uploadImage(@PathVariable Long id, @RequestParam MultipartFile file,
                                        @CurrentUserId Long userId) throws IOException {
        return bookClubService.uploadImage(id, file.getBytes(), userId);
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> findImage(@PathVariable Long id) {
        ClubImageData image = bookClubService.findImage(id);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(image.contentType()))
                .cacheControl(CacheControl.maxAge(Duration.ofDays(365)).cachePublic())
                .body(image.data());
    }

    @PreAuthorize("#userId.toString() == authentication.name")
    @PostMapping("/{id}/members/{userId}")
    public BookClubResponse addMember(@PathVariable Long id, @PathVariable Long userId) {
        return bookClubService.addMember(id, userId);
    }

    @PreAuthorize("#userId.toString() == authentication.name")
    @DeleteMapping("/{id}/members/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeMember(@PathVariable Long id, @PathVariable Long userId) {
        bookClubService.removeMember(id, userId);
    }
}
