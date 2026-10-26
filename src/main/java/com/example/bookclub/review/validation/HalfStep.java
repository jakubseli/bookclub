package com.example.bookclub.review.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = HalfStepValidator.class)
public @interface HalfStep {

    String message() default "must be in steps of 0.5";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
