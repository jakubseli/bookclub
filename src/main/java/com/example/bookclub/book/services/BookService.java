package com.example.bookclub.book.services;

import com.example.bookclub.book.dtos.BookDetailResponse;
import com.example.bookclub.book.dtos.BookResponse;
import com.example.bookclub.book.models.Book;
import com.example.bookclub.book.repositories.BookRepository;
import com.example.bookclub.common.NotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Transactional(readOnly = true)
    public Page<BookResponse> findAll(Pageable pageable) {
        return bookRepository.findAll(pageable).map(BookResponse::from);
    }

    @Transactional(readOnly = true)
    public BookDetailResponse findById(Long id) {
        return BookDetailResponse.from(findBook(id));
    }

    public Book findBook(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Book " + id + " not found"));
    }
}
