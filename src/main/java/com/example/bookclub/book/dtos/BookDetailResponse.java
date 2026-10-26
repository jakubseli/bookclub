package com.example.bookclub.book.dtos;

import com.example.bookclub.book.models.Book;

import java.util.List;

public record BookDetailResponse(
        Long id,
        String title,
        String author,
        Integer publishedYear,
        String description,
        List<Long> coverIds
) {

    public static BookDetailResponse from(Book book) {
        return new BookDetailResponse(
                book.getId(),
                book.getTitle(),
                book.getAuthor(),
                book.getPublishedYear(),
                book.getDescription(),
                List.copyOf(book.getCoverIds())
        );
    }
}
