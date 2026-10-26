package com.example.bookclub.review.repositories;

import com.example.bookclub.review.dtos.RatingCount;
import com.example.bookclub.review.models.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    Page<Review> findByBookId(Long bookId, Pageable pageable);

    Page<Review> findByUserId(Long userId, Pageable pageable);

    Optional<Review> findByBookIdAndUserId(Long bookId, Long userId);

    @Query("select new com.example.bookclub.review.dtos.RatingCount(r.rating, count(r)) "
            + "from Review r where r.book.id = :bookId group by r.rating")
    List<RatingCount> countRatingsByBookId(Long bookId);
}
