package com.example.bookclub.user.controllers;

import com.example.bookclub.common.NotFoundException;
import com.example.bookclub.config.SecurityConfig;
import com.example.bookclub.user.models.User;
import com.example.bookclub.user.services.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
@Import(SecurityConfig.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    @Test
    void listIsPaginated() throws Exception {
        User user = new User();
        user.setUsername("john");
        when(userService.findAll(PageRequest.of(1, 5))).thenReturn(new PageImpl<>(List.of(user), PageRequest.of(1, 5), 6));

        mockMvc.perform(get("/api/v1/users").param("page", "1").param("size", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].username").value("john"))
                .andExpect(jsonPath("$.page.number").value(1))
                .andExpect(jsonPath("$.page.totalElements").value(6))
                .andExpect(jsonPath("$.page.totalPages").value(2));
    }

    @Test
    void unknownUserReturns404() throws Exception {
        when(userService.findById(99L)).thenThrow(new NotFoundException("User 99 not found"));

        mockMvc.perform(get("/api/v1/users/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void invalidPayloadReturns400WithFieldErrors() throws Exception {
        mockMvc.perform(post("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\": \"\", \"email\": \"not-an-email\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.username").exists())
                .andExpect(jsonPath("$.errors.email").exists())
                .andExpect(jsonPath("$.errors.age").exists());
    }

    @Test
    void invalidNestedAddressReturns400() throws Exception {
        mockMvc.perform(post("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"age\": 30, \"username\": \"john\", \"email\": \"john@example.com\","
                                + " \"addresses\": [{\"street\": \"\", \"city\": \"Ostrava\", \"country\": \"CZ\"}]}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors['addresses[0].street']").exists());
    }

    @Test
    void unsupportedMethodReturns405() throws Exception {
        mockMvc.perform(patch("/api/v1/users/1"))
                .andExpect(status().isMethodNotAllowed());
    }
}
