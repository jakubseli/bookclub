package com.example.bookclub.club.dtos;

import com.example.bookclub.club.models.BookClub;
import com.example.bookclub.club.models.ClubTag;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Set;

public record BookClubRequest(
        @NotBlank @Size(max = 255) String name,
        @Size(max = 255) String description,
        @Size(max = 5) Set<ClubTag> tags,
        @Min(1) @Max(BookClub.PRESET_IMAGE_COUNT) Integer imagePreset
) {

    public BookClub toEntity() {
        BookClub club = new BookClub();
        club.setName(name);
        club.setDescription(description);
        club.setTags(tags == null ? Set.of() : tags);
        club.choosePreset(imagePreset);
        return club;
    }
}
