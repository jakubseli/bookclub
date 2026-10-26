package com.example.bookclub.review.dtos;

import com.example.bookclub.book.dtos.BookResponse;
import com.example.bookclub.review.models.Review;

import java.time.Instant;

public record ReviewResponse(
        Long id,
        BookResponse book,
        Long userId,
        String username,
        double rating,
        String comment,
        Instant createdAt
) {

    public static ReviewResponse from(Review review) {
        return new ReviewResponse(
                review.getId(),
                BookResponse.from(review.getBook()),
                review.getUser().getId(),
                review.getUser().getUsername(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt()
        );
    }
}
