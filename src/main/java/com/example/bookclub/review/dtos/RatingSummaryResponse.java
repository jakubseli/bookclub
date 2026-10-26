package com.example.bookclub.review.dtos;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public record RatingSummaryResponse(Double average, long count, List<RatingCount> distribution) {

    private static final int HALF_STEPS = 10;

    public static RatingSummaryResponse from(List<RatingCount> counts) {
        Map<Double, Long> countByRating = counts.stream()
                .collect(Collectors.toMap(RatingCount::rating, RatingCount::count));
        List<RatingCount> distribution = IntStream.rangeClosed(1, HALF_STEPS)
                .mapToObj(step -> step / 2.0)
                .map(rating -> new RatingCount(rating, countByRating.getOrDefault(rating, 0L)))
                .toList();
        long total = distribution.stream().mapToLong(RatingCount::count).sum();
        Double average = total == 0
                ? null
                : distribution.stream().mapToDouble(entry -> entry.rating() * entry.count()).sum() / total;
        return new RatingSummaryResponse(average, total, distribution);
    }
}
