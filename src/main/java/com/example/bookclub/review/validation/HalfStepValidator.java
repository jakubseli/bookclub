package com.example.bookclub.review.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class HalfStepValidator implements ConstraintValidator<HalfStep, Double> {

    @Override
    public boolean isValid(Double value, ConstraintValidatorContext context) {
        return value == null || value * 2 == Math.rint(value * 2);
    }
}
