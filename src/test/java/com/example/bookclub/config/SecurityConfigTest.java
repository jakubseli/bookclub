package com.example.bookclub.config;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class SecurityConfigTest {

    private final SecurityConfig config = new SecurityConfig();

    @Test
    void shortSecretIsRejected() {
        assertThrows(IllegalStateException.class, () -> config.jwtKey("too-short"));
    }

    @Test
    void longEnoughSecretIsAccepted() {
        assertEquals("HmacSHA256", config.jwtKey("a-secret-that-is-at-least-32-bytes").getAlgorithm());
    }
}
