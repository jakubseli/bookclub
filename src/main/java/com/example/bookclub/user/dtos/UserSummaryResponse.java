package com.example.bookclub.user.dtos;

import com.example.bookclub.user.models.User;

public record UserSummaryResponse(Long id, String username) {

    public static UserSummaryResponse from(User user) {
        return new UserSummaryResponse(user.getId(), user.getUsername());
    }
}
