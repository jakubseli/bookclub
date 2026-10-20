package com.example.bookclub.user.dtos;

import com.example.bookclub.user.models.Address;

public record AddressResponse(
        Long id,
        String street,
        String city,
        String state,
        String postalCode,
        String country
) {

    public static AddressResponse from(Address address) {
        return new AddressResponse(
                address.getId(),
                address.getStreet(),
                address.getCity(),
                address.getState(),
                address.getPostalCode(),
                address.getCountry()
        );
    }
}
