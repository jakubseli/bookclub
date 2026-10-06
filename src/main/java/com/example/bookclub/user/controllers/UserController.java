package com.example.bookclub.user.controllers;

import com.example.bookclub.user.models.User;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    @GetMapping
    public User getUser() {
        return new User(1L, "Alice Smith", "alice@example.com");
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public User createUser(@RequestBody User user) {
        user.setId(2L);   // fake id for now, the DB will assign real ones later
        return user;
    }
}
