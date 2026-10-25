package com.example.bookclub.club.dtos;

import com.example.bookclub.club.models.BookClub;

import java.util.Comparator;
import java.util.List;

public record BookClubResponse(
        Long id,
        String name,
        String description,
        List<MemberResponse> members
) {

    public static BookClubResponse from(BookClub club) {
        return new BookClubResponse(
                club.getId(),
                club.getName(),
                club.getDescription(),
                club.getMembers().stream()
                        .map(MemberResponse::from)
                        .sorted(Comparator.comparing(MemberResponse::username))
                        .toList()
        );
    }
}
