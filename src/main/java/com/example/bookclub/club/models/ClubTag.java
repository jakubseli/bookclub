package com.example.bookclub.club.models;

public enum ClubTag {
    SCI_FI("Sci-fi"),
    FANTASY("Fantasy"),
    MYSTERY("Mystery & thriller"),
    CLASSICS("Classics"),
    ROMANCE("Romance"),
    HORROR("Horror"),
    YOUNG_ADULT("Young adult"),
    NON_FICTION("Non-fiction"),
    WEEKLY("Weekly"),
    MONTHLY("Monthly"),
    ONLINE("Online"),
    IN_PERSON("In person"),
    BEGINNERS("Beginner friendly");

    private final String label;

    ClubTag(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
