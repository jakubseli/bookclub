package com.example.bookclub.user.dtos;

import com.example.bookclub.user.models.User;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.util.List;

public record UserRequest(
        @Size(max = 255) String firstName,
        @Size(max = 255) String lastName,
        @NotNull @PositiveOrZero Integer age,
        @NotBlank @Size(max = 255) String username,
        @NotBlank @Email @Size(max = 255) String email,
        @Size(max = 255) String phoneNumber,
        List<@Valid AddressRequest> addresses
) {

    public User toEntity() {
        User user = new User();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setAge(age);
        user.setUsername(username);
        user.setEmail(email);
        user.setPhoneNumber(phoneNumber);
        if (addresses != null) {
            addresses.forEach(address -> user.addAddress(address.toEntity()));
        }
        return user;
    }
}
