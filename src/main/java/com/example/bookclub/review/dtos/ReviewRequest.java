package com.example.bookclub.review.dtos;

import com.example.bookclub.review.models.Review;
import com.example.bookclub.review.validation.HalfStep;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ReviewRequest(
        @NotNull @DecimalMin("0.5") @DecimalMax("5.0") @HalfStep Double rating,
        @Size(max = 1000) String comment
) {

    public Review toEntity() {
        Review review = new Review();
        review.setRating(rating);
        review.setComment(comment);
        return review;
    }
}
