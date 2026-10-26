package com.example.bookclub.book.models;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "book")
public class Book {

    @Id
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;

    private Integer publishedYear;

    @Column(length = 2000)
    private String description;

    @ElementCollection
    @CollectionTable(name = "book_cover", joinColumns = @JoinColumn(name = "book_id"))
    @OrderColumn(name = "cover_order")
    @Column(name = "cover_id", nullable = false)
    private List<Long> coverIds = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getAuthor() {
        return author;
    }

    public Integer getPublishedYear() {
        return publishedYear;
    }

    public String getDescription() {
        return description;
    }

    public List<Long> getCoverIds() {
        return coverIds;
    }
}
