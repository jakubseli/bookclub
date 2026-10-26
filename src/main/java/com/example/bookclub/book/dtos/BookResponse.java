package com.example.bookclub.book.dtos;

import com.example.bookclub.book.models.Book;

public record BookResponse(Long id, String title, String author, Integer publishedYear, Long coverId) {

    public static BookResponse from(Book book) {
        return new BookResponse(
                book.getId(),
                book.getTitle(),
                book.getAuthor(),
                book.getPublishedYear(),
                book.getCoverIds().isEmpty() ? null : book.getCoverIds().getFirst()
        );
    }
}
