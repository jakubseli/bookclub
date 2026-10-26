package com.example.bookclub.user.services;

import com.example.bookclub.common.NotFoundException;
import com.example.bookclub.user.dtos.UserResponse;
import com.example.bookclub.user.dtos.UserSummaryResponse;
import com.example.bookclub.user.models.User;
import com.example.bookclub.user.repositories.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public Page<UserSummaryResponse> findAll(Pageable pageable) {
        return userRepository.findAll(pageable).map(UserSummaryResponse::from);
    }

    @Transactional(readOnly = true)
    public UserSummaryResponse findProfile(Long id) {
        return UserSummaryResponse.from(findUser(id));
    }

    @Transactional(readOnly = true)
    public UserResponse findById(Long id) {
        return UserResponse.from(findUser(id));
    }

    @Transactional
    public UserResponse create(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return UserResponse.from(userRepository.save(user));
    }

    @Transactional
    public UserResponse update(Long id, User updated) {
        User existing = findUser(id);
        existing.setFirstName(updated.getFirstName());
        existing.setLastName(updated.getLastName());
        existing.setAge(updated.getAge());
        existing.setUsername(updated.getUsername());
        existing.setEmail(updated.getEmail());
        existing.setPhoneNumber(updated.getPhoneNumber());
        existing.setPassword(passwordEncoder.encode(updated.getPassword()));
        existing.getAddresses().clear();
        updated.getAddresses().forEach(existing::addAddress);
        return UserResponse.from(userRepository.save(existing));
    }

    @Transactional
    public void delete(Long id) {
        userRepository.delete(findUser(id));
    }

    public User findUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User " + id + " not found"));
    }
}
