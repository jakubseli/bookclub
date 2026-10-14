package com.example.bookclub.user.services;

import com.example.bookclub.user.models.User;
import com.example.bookclub.user.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public User create(User user) {
        user.setId(null);   // make sure the DB assigns the id
        return userRepository.save(user);
    }

    public Optional<User> update(Long id, User updated) {
        return userRepository.findById(id).map(existing -> {
            existing.setFirstName(updated.getFirstName());
            existing.setLastName(updated.getLastName());
            existing.setAge(updated.getAge());
            existing.setUsername(updated.getUsername());
            existing.setEmail(updated.getEmail());
            existing.setPhoneNumber(updated.getPhoneNumber());
            return userRepository.save(existing);
        });
    }

    public boolean delete(Long id) {
        if (!userRepository.existsById(id)) {
            return false;
        }
        userRepository.deleteById(id);
        return true;
    }
}