package com.example.bookclub.book.repositories;

import com.example.bookclub.book.models.Book;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Long> {
}
