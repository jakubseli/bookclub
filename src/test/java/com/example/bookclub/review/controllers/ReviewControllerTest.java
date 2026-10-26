package com.example.bookclub.review.controllers;

import com.example.bookclub.book.dtos.BookResponse;
import com.example.bookclub.common.NotFoundException;
import com.example.bookclub.config.SecurityConfig;
import com.example.bookclub.review.dtos.RatingCount;
import com.example.bookclub.review.dtos.RatingSummaryResponse;
import com.example.bookclub.review.dtos.ReviewResponse;
import com.example.bookclub.review.models.Review;
import com.example.bookclub.review.services.ReviewService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ReviewController.class)
@Import(SecurityConfig.class)
@TestPropertySource(properties = "jwt.secret=test-secret-that-is-at-least-32-bytes-long")
class ReviewControllerTest {

    private static final Instant CREATED_AT = Instant.parse("2026-10-26T10:00:00Z");
    private static final BookResponse DUNE = new BookResponse(1L, "Dune", "Frank Herbert", 1965, 11481354L);

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ReviewService reviewService;

    @Test
    void createReturns201WithAuthor() throws Exception {
        when(reviewService.create(eq(1L), any(Review.class), eq(7L)))
                .thenReturn(new ReviewResponse(3L, DUNE, 7L, "john", 4.5, "Great", CREATED_AT));

        mockMvc.perform(post("/api/v1/books/1/reviews").with(jwt().jwt(token -> token.subject("7")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"rating\": 4.5, \"comment\": \"Great\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.userId").value(7))
                .andExpect(jsonPath("$.rating").value(4.5))
                .andExpect(jsonPath("$.createdAt").value("2026-10-26T10:00:00Z"));
    }

    @Test
    void ratingOutOfRangeReturns400() throws Exception {
        mockMvc.perform(post("/api/v1/books/1/reviews").with(jwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"rating\": 6}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.rating").exists());
    }

    @Test
    void ratingBetweenHalfStepsReturns400() throws Exception {
        mockMvc.perform(post("/api/v1/books/1/reviews").with(jwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"rating\": 4.3}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.rating").value("must be in steps of 0.5"));
    }

    @Test
    void ratingSummaryIsReturned() throws Exception {
        when(reviewService.findRatings(1L))
                .thenReturn(RatingSummaryResponse.from(List.of(new RatingCount(4.5, 2), new RatingCount(3.0, 1))));

        mockMvc.perform(get("/api/v1/books/1/ratings").with(jwt()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.average").value(4.0))
                .andExpect(jsonPath("$.count").value(3))
                .andExpect(jsonPath("$.distribution.length()").value(10));
    }

    @Test
    void reviewsOfAUserIncludeTheirBooks() throws Exception {
        ReviewResponse review = new ReviewResponse(3L, DUNE, 7L, "john", 4.5, "Great", CREATED_AT);
        when(reviewService.findByUser(eq(7L), any(Pageable.class))).thenReturn(new PageImpl<>(List.of(review)));

        mockMvc.perform(get("/api/v1/users/7/reviews").with(jwt().jwt(token -> token.subject("8"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].book.title").value("Dune"))
                .andExpect(jsonPath("$.content[0].book.coverId").value(11481354L));
    }

    @Test
    void reviewsOfUnknownBookReturn404() throws Exception {
        when(reviewService.findByBook(eq(99L), any(Pageable.class))).thenThrow(new NotFoundException("Book 99 not found"));

        mockMvc.perform(get("/api/v1/books/99/reviews").with(jwt()))
                .andExpect(status().isNotFound());
    }

    @Test
    void ownReviewIsFoundByToken() throws Exception {
        when(reviewService.findOwn(1L, 7L)).thenReturn(new ReviewResponse(3L, DUNE, 7L, "john", 4.0, null, CREATED_AT));

        mockMvc.perform(get("/api/v1/books/1/reviews/mine").with(jwt().jwt(token -> token.subject("7"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(3));
    }

    @Test
    void noOwnReviewReturns404() throws Exception {
        when(reviewService.findOwn(1L, 7L)).thenThrow(new NotFoundException("You have not reviewed book 1"));

        mockMvc.perform(get("/api/v1/books/1/reviews/mine").with(jwt().jwt(token -> token.subject("7"))))
                .andExpect(status().isNotFound());
    }

    @Test
    void updatingSomeoneElsesReviewReturns403() throws Exception {
        when(reviewService.update(eq(3L), any(Review.class), eq(8L)))
                .thenThrow(new AccessDeniedException("Only the author can change review 3"));

        mockMvc.perform(put("/api/v1/reviews/3").with(jwt().jwt(token -> token.subject("8")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"rating\": 1}"))
                .andExpect(status().isForbidden());
    }
}
