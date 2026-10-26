package com.example.bookclub.club.controllers;

import com.example.bookclub.club.dtos.BookClubResponse;
import com.example.bookclub.club.dtos.ClubImageData;
import com.example.bookclub.club.dtos.ClubTagResponse;
import com.example.bookclub.club.models.BookClub;
import com.example.bookclub.club.models.ClubTag;
import com.example.bookclub.club.services.BookClubService;
import com.example.bookclub.common.ConflictException;
import com.example.bookclub.common.NotFoundException;
import com.example.bookclub.common.UnsupportedImageException;
import com.example.bookclub.config.SecurityConfig;
import com.example.bookclub.user.dtos.UserSummaryResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(BookClubController.class)
@Import(SecurityConfig.class)
@TestPropertySource(properties = "jwt.secret=test-secret-that-is-at-least-32-bytes-long")
class BookClubControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private BookClubService bookClubService;

    @Test
    void unknownClubReturns404() throws Exception {
        when(bookClubService.findById(99L)).thenThrow(new NotFoundException("Book club 99 not found"));

        mockMvc.perform(get("/api/v1/clubs/99").with(jwt()))
                .andExpect(status().isNotFound());
    }

    @Test
    void blankNameReturns400() throws Exception {
        mockMvc.perform(post("/api/v1/clubs").with(jwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\": \"\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.name").exists());
    }

    @Test
    void addingMemberReturnsClubWithMember() throws Exception {
        UserSummaryResponse john = new UserSummaryResponse(7L, "john");
        BookClubResponse club = new BookClubResponse(1L, "Sci-fi", null, List.of(), null, null, null, null, null, john, List.of(john));
        when(bookClubService.addMember(1L, 7L)).thenReturn(club);

        mockMvc.perform(post("/api/v1/clubs/1/members/7").with(jwt().jwt(token -> token.subject("7"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.members[0].id").value(7))
                .andExpect(jsonPath("$.members[0].username").value("john"));
    }

    @Test
    void creatorBecomesOwner() throws Exception {
        UserSummaryResponse john = new UserSummaryResponse(7L, "john");
        BookClubResponse club = new BookClubResponse(1L, "Sci-fi", null, List.of(), null, null, null, null, null, john, List.of(john));
        when(bookClubService.create(any(BookClub.class), eq(7L))).thenReturn(club);

        mockMvc.perform(post("/api/v1/clubs").with(jwt().jwt(token -> token.subject("7")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\": \"Sci-fi\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.owner.id").value(7))
                .andExpect(jsonPath("$.members[0].id").value(7));
    }

    @Test
    void updatingSomeoneElsesClubReturns403() throws Exception {
        when(bookClubService.update(eq(1L), any(BookClub.class), eq(8L)))
                .thenThrow(new AccessDeniedException("Only the owner can change book club 1"));

        mockMvc.perform(put("/api/v1/clubs/1").with(jwt().jwt(token -> token.subject("8")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\": \"Renamed\"}"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.detail").value("Only the owner can change book club 1"));
    }

    @Test
    void addingSomeoneElseReturns403() throws Exception {
        mockMvc.perform(post("/api/v1/clubs/1/members/7").with(jwt().jwt(token -> token.subject("8"))))
                .andExpect(status().isForbidden());
    }

    @Test
    void ownerLeavingOwnClubReturns409() throws Exception {
        doThrow(new ConflictException("The owner can't leave their own club")).when(bookClubService).removeMember(1L, 7L);

        mockMvc.perform(delete("/api/v1/clubs/1/members/7").with(jwt().jwt(token -> token.subject("7"))))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.detail").value("The owner can't leave their own club"));
    }

    @Test
    void clubsCanBeFilteredByMember() throws Exception {
        UserSummaryResponse john = new UserSummaryResponse(7L, "john");
        BookClubResponse club = new BookClubResponse(1L, "Sci-fi", null, List.of(), null, null, null, null, null, john, List.of(john));
        when(bookClubService.findAll(eq(7L), any(Pageable.class))).thenReturn(new PageImpl<>(List.of(club)));

        mockMvc.perform(get("/api/v1/clubs").param("memberId", "7").with(jwt()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].name").value("Sci-fi"));
    }

    @Test
    void ownerSetsBookAndReadingPeriod() throws Exception {
        UserSummaryResponse john = new UserSummaryResponse(7L, "john");
        BookClubResponse club = new BookClubResponse(1L, "Sci-fi", null, List.of(), null, null, null,
                LocalDate.of(2026, 11, 1), LocalDate.of(2026, 11, 30), john, List.of(john));
        when(bookClubService.startReading(1L, 3L, LocalDate.of(2026, 11, 1), LocalDate.of(2026, 11, 30), 7L)).thenReturn(club);

        mockMvc.perform(put("/api/v1/clubs/1/reading").with(jwt().jwt(token -> token.subject("7")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"bookId\": 3, \"from\": \"2026-11-01\", \"until\": \"2026-11-30\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.readingFrom").value("2026-11-01"))
                .andExpect(jsonPath("$.readingUntil").value("2026-11-30"));
    }

    @Test
    void readingPeriodEndingBeforeItStartsReturns400() throws Exception {
        mockMvc.perform(put("/api/v1/clubs/1/reading").with(jwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"bookId\": 3, \"from\": \"2026-11-30\", \"until\": \"2026-11-01\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.periodValid").value("The end date must not be before the start date"));
    }

    @Test
    void readingWithoutBookOrDatesReturns400() throws Exception {
        mockMvc.perform(put("/api/v1/clubs/1/reading").with(jwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.bookId").exists())
                .andExpect(jsonPath("$.errors.from").exists())
                .andExpect(jsonPath("$.errors.until").exists());
    }

    @Test
    void tagsAreListedWithLabels() throws Exception {
        when(bookClubService.findTags()).thenReturn(List.of(ClubTagResponse.from(ClubTag.SCI_FI)));

        mockMvc.perform(get("/api/v1/clubs/tags").with(jwt()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].value").value("SCI_FI"))
                .andExpect(jsonPath("$[0].label").value("Sci-fi"));
    }

    @Test
    void moreThanFiveTagsReturns400() throws Exception {
        mockMvc.perform(post("/api/v1/clubs").with(jwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\": \"Sci-fi\", \"tags\": [\"SCI_FI\", \"FANTASY\", \"HORROR\", \"ONLINE\", \"WEEKLY\", \"CLASSICS\"]}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.tags").exists());
    }

    @Test
    void unknownTagReturns400() throws Exception {
        mockMvc.perform(post("/api/v1/clubs").with(jwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\": \"Sci-fi\", \"tags\": [\"KNITTING\"]}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void presetOutOfRangeReturns400() throws Exception {
        mockMvc.perform(post("/api/v1/clubs").with(jwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\": \"Sci-fi\", \"imagePreset\": 9}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.imagePreset").exists());
    }

    @Test
    void uploadingImageReturnsClubWithImageUrl() throws Exception {
        UserSummaryResponse john = new UserSummaryResponse(7L, "john");
        BookClubResponse club = new BookClubResponse(1L, "Sci-fi", null, List.of(), null,
                "/api/v1/clubs/1/image?v=1", null, null, null, john, List.of(john));
        when(bookClubService.uploadImage(eq(1L), any(byte[].class), eq(7L))).thenReturn(club);

        mockMvc.perform(multipart(HttpMethod.PUT, "/api/v1/clubs/1/image")
                        .file(new MockMultipartFile("file", "cover.png", "image/png", new byte[]{1, 2, 3}))
                        .with(jwt().jwt(token -> token.subject("7"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.imageUrl").value("/api/v1/clubs/1/image?v=1"));
    }

    @Test
    void unsupportedImageReturns415() throws Exception {
        when(bookClubService.uploadImage(eq(1L), any(byte[].class), eq(7L)))
                .thenThrow(new UnsupportedImageException("The image must be a JPEG, PNG or WebP file"));

        mockMvc.perform(multipart(HttpMethod.PUT, "/api/v1/clubs/1/image")
                        .file(new MockMultipartFile("file", "notes.txt", "text/plain", "hello".getBytes()))
                        .with(jwt().jwt(token -> token.subject("7"))))
                .andExpect(status().isUnsupportedMediaType())
                .andExpect(jsonPath("$.detail").value("The image must be a JPEG, PNG or WebP file"));
    }

    @Test
    void clubImageIsPublicAndCached() throws Exception {
        byte[] png = {(byte) 0x89, 'P', 'N', 'G'};
        when(bookClubService.findImage(1L)).thenReturn(new ClubImageData("image/png", png));

        mockMvc.perform(get("/api/v1/clubs/1/image"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Type", "image/png"))
                .andExpect(header().string("Cache-Control", "max-age=31536000, public"))
                .andExpect(content().bytes(png));
    }

    @Test
    void unknownMemberReturns404() throws Exception {
        when(bookClubService.addMember(1L, 99L)).thenThrow(new NotFoundException("User 99 not found"));

        mockMvc.perform(post("/api/v1/clubs/1/members/99").with(jwt().jwt(token -> token.subject("99"))))
                .andExpect(status().isNotFound());
    }
}
