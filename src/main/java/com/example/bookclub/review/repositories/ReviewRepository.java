package com.example.bookclub.review.repositories;

import com.example.bookclub.review.models.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    Page<Review> findByBookId(Long bookId, Pageable pageable);

    Optional<Review> findByBookIdAndUserId(Long bookId, Long userId);
}
