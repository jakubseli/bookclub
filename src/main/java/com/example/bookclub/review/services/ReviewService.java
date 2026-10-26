package com.example.bookclub.review.services;

import com.example.bookclub.book.services.BookService;
import com.example.bookclub.common.NotFoundException;
import com.example.bookclub.review.dtos.ReviewResponse;
import com.example.bookclub.review.models.Review;
import com.example.bookclub.review.repositories.ReviewRepository;
import com.example.bookclub.user.services.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookService bookService;
    private final UserService userService;

    public ReviewService(ReviewRepository reviewRepository, BookService bookService, UserService userService) {
        this.reviewRepository = reviewRepository;
        this.bookService = bookService;
        this.userService = userService;
    }

    @Transactional(readOnly = true)
    public Page<ReviewResponse> findByBook(Long bookId, Pageable pageable) {
        bookService.findBook(bookId);
        return reviewRepository.findByBookId(bookId, pageable).map(ReviewResponse::from);
    }

    @Transactional
    public ReviewResponse create(Long bookId, Review review, Long userId) {
        review.setBook(bookService.findBook(bookId));
        review.setUser(userService.findUser(userId));
        return ReviewResponse.from(reviewRepository.save(review));
    }

    @Transactional
    public ReviewResponse update(Long id, Review updated, Long userId) {
        Review existing = findOwnReview(id, userId);
        existing.setRating(updated.getRating());
        existing.setComment(updated.getComment());
        return ReviewResponse.from(existing);
    }

    @Transactional
    public void delete(Long id, Long userId) {
        reviewRepository.delete(findOwnReview(id, userId));
    }

    private Review findOwnReview(Long id, Long userId) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Review " + id + " not found"));
        if (!review.isWrittenBy(userId)) {
            throw new AccessDeniedException("Only the author can change review " + id);
        }
        return review;
    }
}
