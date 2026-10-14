package com.example.bookclub.user.repositories;

import com.example.bookclub.user.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}