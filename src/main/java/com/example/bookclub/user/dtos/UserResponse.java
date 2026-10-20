package com.example.bookclub.user.dtos;

import com.example.bookclub.user.models.User;

import java.util.List;

public record UserResponse(
        Long id,
        String firstName,
        String lastName,
        int age,
        String username,
        String email,
        String phoneNumber,
        List<AddressResponse> addresses
) {

    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getAge(),
                user.getUsername(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getAddresses().stream().map(AddressResponse::from).toList()
        );
    }
}
