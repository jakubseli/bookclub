package com.example.bookclub.user.dtos;

import com.example.bookclub.user.models.Address;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AddressRequest(
        @NotBlank @Size(max = 255) String street,
        @NotBlank @Size(max = 255) String city,
        @Size(max = 255) String state,
        @Size(max = 255) String postalCode,
        @NotBlank @Size(max = 255) String country
) {

    public Address toEntity() {
        Address address = new Address();
        address.setStreet(street);
        address.setCity(city);
        address.setState(state);
        address.setPostalCode(postalCode);
        address.setCountry(country);
        return address;
    }
}
