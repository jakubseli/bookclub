package com.example.bookclub.club.dtos;

import com.example.bookclub.club.models.ClubTag;

public record ClubTagResponse(ClubTag value, String label) {

    public static ClubTagResponse from(ClubTag tag) {
        return new ClubTagResponse(tag, tag.getLabel());
    }
}
