package com.example.bookclub.user.controllers;

import com.example.bookclub.user.models.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/user")
public class UserController {

    @GetMapping("/hello")
    public User getUser() {
        User user = new User();
        user.setId(1L);
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setAge(30);
        user.setUsername("johndoe");
        user.setEmail("john.doe@example.com");
        user.setPhoneNumber("+420123456789");
        return user;
    }

    @PostMapping
    public User getPostUser() {
        User user = new User();
        user.setId(1L);
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setAge(30);
        user.setUsername("johndoe");
        user.setEmail("john.doe@example.com");
        user.setPhoneNumber("+420123456789");
        return user;
    }
}
