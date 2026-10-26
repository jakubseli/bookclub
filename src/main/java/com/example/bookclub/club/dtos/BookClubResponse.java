package com.example.bookclub.club.dtos;

import com.example.bookclub.book.dtos.BookResponse;
import com.example.bookclub.club.models.BookClub;
import com.example.bookclub.club.models.ClubTag;
import com.example.bookclub.user.dtos.UserSummaryResponse;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

public record BookClubResponse(
        Long id,
        String name,
        String description,
        List<ClubTag> tags,
        Integer imagePreset,
        String imageUrl,
        BookResponse currentBook,
        LocalDate readingFrom,
        LocalDate readingUntil,
        UserSummaryResponse owner,
        List<UserSummaryResponse> members
) {

    @SuppressWarnings("null")
    public static BookClubResponse from(BookClub club) {
        return new BookClubResponse(
                club.getId(),
                club.getName(),
                club.getDescription(),
                club.getTags().stream().sorted().toList(),
                club.getImagePreset(),
                club.hasUploadedImage()
                        ? "/api/v1/clubs/" + club.getId() + "/image?v=" + club.getImageUploadedAt().toEpochMilli()
                        : null,
                club.getCurrentBook() == null ? null : BookResponse.from(club.getCurrentBook()),
                club.getReadingFrom(),
                club.getReadingUntil(),
                UserSummaryResponse.from(club.getOwner()),
                club.getMembers().stream()
                        .map(UserSummaryResponse::from)
                        .sorted(Comparator.comparing(UserSummaryResponse::username))
                        .toList()
        );
    }
}
