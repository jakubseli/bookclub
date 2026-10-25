package com.example.bookclub.club.controllers;

import com.example.bookclub.club.models.BookClub;
import com.example.bookclub.club.services.BookClubService;
import com.example.bookclub.common.NotFoundException;
import com.example.bookclub.config.SecurityConfig;
import com.example.bookclub.user.models.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(BookClubController.class)
@Import(SecurityConfig.class)
class BookClubControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private BookClubService bookClubService;

    @Test
    void unknownClubReturns404() throws Exception {
        when(bookClubService.findById(99L)).thenThrow(new NotFoundException("Book club 99 not found"));

        mockMvc.perform(get("/api/v1/clubs/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void blankNameReturns400() throws Exception {
        mockMvc.perform(post("/api/v1/clubs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\": \"\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.name").exists());
    }

    @Test
    void addingMemberReturnsClubWithMember() throws Exception {
        User user = new User();
        user.setId(7L);
        user.setUsername("john");
        BookClub club = new BookClub();
        club.setId(1L);
        club.setName("Sci-fi");
        club.addMember(user);
        when(bookClubService.addMember(1L, 7L)).thenReturn(club);

        mockMvc.perform(post("/api/v1/clubs/1/members/7"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.members[0].id").value(7))
                .andExpect(jsonPath("$.members[0].username").value("john"));
    }

    @Test
    void unknownMemberReturns404() throws Exception {
        when(bookClubService.addMember(1L, 99L)).thenThrow(new NotFoundException("User 99 not found"));

        mockMvc.perform(post("/api/v1/clubs/1/members/99"))
                .andExpect(status().isNotFound());
    }
}
