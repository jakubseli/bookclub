package com.example.bookclub.club.repositories;

import com.example.bookclub.club.models.BookClub;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookClubRepository extends JpaRepository<BookClub, Long> {
}
