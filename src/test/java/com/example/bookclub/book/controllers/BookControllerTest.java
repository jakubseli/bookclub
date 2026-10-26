package com.example.bookclub.book.controllers;

import com.example.bookclub.book.dtos.BookResponse;
import com.example.bookclub.book.services.BookService;
import com.example.bookclub.common.NotFoundException;
import com.example.bookclub.config.SecurityConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(BookController.class)
@Import(SecurityConfig.class)
@TestPropertySource(properties = "jwt.secret=test-secret-that-is-at-least-32-bytes-long")
class BookControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private BookService bookService;

    @Test
    void listIsPaginated() throws Exception {
        BookResponse dune = new BookResponse(1L, "Dune", "Frank Herbert", 1965, 11481354L);
        when(bookService.findAll(PageRequest.of(0, 1))).thenReturn(new PageImpl<>(List.of(dune), PageRequest.of(0, 1), 12));

        mockMvc.perform(get("/api/v1/books").param("page", "0").param("size", "1").with(jwt()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].title").value("Dune"))
                .andExpect(jsonPath("$.content[0].coverId").value(11481354L))
                .andExpect(jsonPath("$.page.totalPages").value(12));
    }

    @Test
    void unknownBookReturns404() throws Exception {
        when(bookService.findById(99L)).thenThrow(new NotFoundException("Book 99 not found"));

        mockMvc.perform(get("/api/v1/books/99").with(jwt()))
                .andExpect(status().isNotFound());
    }

    @Test
    void creatingBookReturns405() throws Exception {
        mockMvc.perform(post("/api/v1/books").with(jwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\": \"Dune\", \"author\": \"Frank Herbert\"}"))
                .andExpect(status().isMethodNotAllowed());
    }

    @Test
    void requestWithoutTokenReturns401() throws Exception {
        mockMvc.perform(get("/api/v1/books"))
                .andExpect(status().isUnauthorized());
    }
}
