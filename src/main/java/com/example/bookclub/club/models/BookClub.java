package com.example.bookclub.club.models;

import com.example.bookclub.book.models.Book;
import com.example.bookclub.user.models.User;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.Instant;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "book_club")
public class BookClub {

    public static final int PRESET_IMAGE_COUNT = 8;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    private String description;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_book_id")
    private Book currentBook;

    private LocalDate readingFrom;

    private LocalDate readingUntil;

    @ManyToMany
    @JoinTable(
            name = "club_members",
            joinColumns = @JoinColumn(name = "club_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> members = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "club_tag", joinColumns = @JoinColumn(name = "club_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "tag", nullable = false)
    private Set<ClubTag> tags = new HashSet<>();

    private Integer imagePreset;

    private Instant imageUploadedAt;

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public Book getCurrentBook() {
        return currentBook;
    }

    public LocalDate getReadingFrom() {
        return readingFrom;
    }

    public LocalDate getReadingUntil() {
        return readingUntil;
    }

    public void startReading(Book book, LocalDate from, LocalDate until) {
        currentBook = book;
        readingFrom = from;
        readingUntil = until;
    }

    public boolean isOwnedBy(Long userId) {
        return owner.getId().equals(userId);
    }

    public Set<User> getMembers() {
        return members;
    }

    public void addMember(User user) {
        members.add(user);
        user.getClubs().add(this);
    }

    public void removeMember(User user) {
        members.remove(user);
        user.getClubs().remove(this);
    }

    public Set<ClubTag> getTags() {
        return tags;
    }

    public void setTags(Set<ClubTag> tags) {
        this.tags.clear();
        this.tags.addAll(tags);
    }

    public Integer getImagePreset() {
        return imagePreset;
    }

    public Instant getImageUploadedAt() {
        return imageUploadedAt;
    }

    public boolean hasUploadedImage() {
        return imageUploadedAt != null;
    }

    public void choosePreset(Integer preset) {
        imagePreset = preset;
        imageUploadedAt = null;
    }

    public void useUploadedImage() {
        imagePreset = null;
        imageUploadedAt = Instant.now();
    }
}
