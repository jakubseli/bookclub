package com.example.bookclub.club.dtos;

import com.example.bookclub.club.models.ClubImage;

public record ClubImageData(String contentType, byte[] data) {

    public static ClubImageData from(ClubImage image) {
        return new ClubImageData(image.getContentType(), image.getData());
    }
}
