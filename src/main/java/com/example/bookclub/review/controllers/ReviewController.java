package com.example.bookclub.review.controllers;

import com.example.bookclub.review.dtos.ReviewRequest;
import com.example.bookclub.review.dtos.ReviewResponse;
import com.example.bookclub.review.services.ReviewService;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
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
@RequestMapping("/api/v1")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/books/{bookId}/reviews")
    public PagedModel<ReviewResponse> findByBook(@PathVariable Long bookId, @ParameterObject Pageable pageable) {
        return new PagedModel<>(reviewService.findByBook(bookId, pageable));
    }

    @PostMapping("/books/{bookId}/reviews")
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewResponse create(@PathVariable Long bookId, @Valid @RequestBody ReviewRequest request,
                                 @AuthenticationPrincipal Jwt jwt) {
        return reviewService.create(bookId, request.toEntity(), userId(jwt));
    }

    @PutMapping("/reviews/{id}")
    public ReviewResponse update(@PathVariable Long id, @Valid @RequestBody ReviewRequest request,
                                 @AuthenticationPrincipal Jwt jwt) {
        return reviewService.update(id, request.toEntity(), userId(jwt));
    }

    @DeleteMapping("/reviews/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        reviewService.delete(id, userId(jwt));
    }

    private static Long userId(Jwt jwt) {
        return Long.valueOf(jwt.getSubject());
    }
}
