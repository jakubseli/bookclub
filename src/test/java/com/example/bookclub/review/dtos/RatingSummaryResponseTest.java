package com.example.bookclub.review.dtos;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class RatingSummaryResponseTest {

    @Test
    void noReviewsGiveNoAverageAndTenEmptyBuckets() {
        RatingSummaryResponse summary = RatingSummaryResponse.from(List.of());

        assertNull(summary.average());
        assertEquals(0, summary.count());
        assertEquals(10, summary.distribution().size());
        assertEquals(0, summary.distribution().stream().mapToLong(RatingCount::count).sum());
    }

    @Test
    void averageAndBucketsComeFromTheCounts() {
        RatingSummaryResponse summary = RatingSummaryResponse.from(List.of(new RatingCount(4.5, 2), new RatingCount(3.0, 1)));

        assertEquals(4.0, summary.average());
        assertEquals(3, summary.count());
        assertEquals(new RatingCount(0.5, 0), summary.distribution().getFirst());
        assertEquals(new RatingCount(4.5, 2), summary.distribution().get(8));
        assertEquals(new RatingCount(5.0, 0), summary.distribution().getLast());
    }
}
