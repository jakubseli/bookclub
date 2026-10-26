package com.example.bookclub.club.dtos;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record ReadingRequest(
        @NotNull Long bookId,
        @NotNull LocalDate from,
        @NotNull LocalDate until
) {

    @JsonIgnore
    @AssertTrue(message = "The end date must not be before the start date")
    public boolean isPeriodValid() {
        return from == null || until == null || !until.isBefore(from);
    }
}
