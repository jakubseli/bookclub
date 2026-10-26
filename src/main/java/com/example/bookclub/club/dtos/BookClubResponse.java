package com.example.bookclub.club.dtos;

import com.example.bookclub.book.dtos.BookResponse;
import com.example.bookclub.club.models.BookClub;
import com.example.bookclub.user.dtos.UserSummaryResponse;

import java.util.Comparator;
import java.util.List;

public record BookClubResponse(
        Long id,
        String name,
        String description,
        BookResponse currentBook,
        UserSummaryResponse owner,
        List<UserSummaryResponse> members
) {

    @SuppressWarnings("null")
    public static BookClubResponse from(BookClub club) {
        return new BookClubResponse(
                club.getId(),
                club.getName(),
                club.getDescription(),
                club.getCurrentBook() == null ? null : BookResponse.from(club.getCurrentBook()),
                UserSummaryResponse.from(club.getOwner()),
                club.getMembers().stream()
                        .map(UserSummaryResponse::from)
                        .sorted(Comparator.comparing(UserSummaryResponse::username))
                        .toList()
        );
    }
}
