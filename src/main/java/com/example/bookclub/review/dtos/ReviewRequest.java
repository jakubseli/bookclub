package com.example.bookclub.review.dtos;

import com.example.bookclub.review.models.Review;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ReviewRequest(
        @NotNull @Min(1) @Max(5) Integer rating,
        @Size(max = 1000) String comment
) {

    public Review toEntity() {
        Review review = new Review();
        review.setRating(rating);
        review.setComment(comment);
        return review;
    }
}
