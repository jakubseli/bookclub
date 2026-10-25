package com.example.bookclub.club.dtos;

import com.example.bookclub.user.models.User;

public record MemberResponse(Long id, String username) {

    public static MemberResponse from(User user) {
        return new MemberResponse(user.getId(), user.getUsername());
    }
}
