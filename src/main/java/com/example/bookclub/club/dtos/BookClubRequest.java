package com.example.bookclub.club.dtos;

import com.example.bookclub.club.models.BookClub;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record BookClubRequest(
        @NotBlank @Size(max = 255) String name,
        @Size(max = 255) String description
) {

    public BookClub toEntity() {
        BookClub club = new BookClub();
        club.setName(name);
        club.setDescription(description);
        return club;
    }
}
