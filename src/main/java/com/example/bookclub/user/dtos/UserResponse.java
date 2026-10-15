package com.example.bookclub.user.dtos;

import com.example.bookclub.user.models.User;

public record UserResponse(
        Long id,
        String firstName,
        String lastName,
        int age,
        String username,
        String email,
        String phoneNumber
) {

    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getAge(),
                user.getUsername(),
                user.getEmail(),
                user.getPhoneNumber()
        );
    }
}
