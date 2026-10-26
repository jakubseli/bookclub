package com.example.bookclub.review.dtos;

import com.example.bookclub.review.models.Review;

public record ReviewResponse(Long id, Long bookId, Long userId, String username, int rating, String comment) {

    public static ReviewResponse from(Review review) {
        return new ReviewResponse(
                review.getId(),
                review.getBook().getId(),
                review.getUser().getId(),
                review.getUser().getUsername(),
                review.getRating(),
                review.getComment()
        );
    }
}
