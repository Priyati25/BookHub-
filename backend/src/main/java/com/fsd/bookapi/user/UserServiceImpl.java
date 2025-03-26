package com.fsd.bookapi.user;

import com.fsd.bookapi.security.SecurityConfig;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public boolean hasUserWithUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public boolean hasUserWithEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public User validateAndGetUserByUsername(String username) {
        return getUserByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(String.format("User with username %s not found", username)));
    }

    @Override
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public void deleteUser(User user) {
        userRepository.delete(user);
    }

    @Override
    public Optional<User> validUsernameAndPassword(String username, String password) {
        return getUserByUsername(username)
                .filter(user -> passwordEncoder.matches(password, user.getPassword()));
    }

    @Override
    public void createAdminUser() {
        if (!userRepository.existsByUsername("admin")) {
            User adminUser = new User(
                    "admin", // username
                    passwordEncoder.encode("admin"), // encoded password
                    "Admin", // full name
                    "admin@mycompany.com", // email
                    SecurityConfig.ADMIN // role
            );
            userRepository.save(adminUser);
            System.out.println("✅ Admin user created!");
        } else {
            System.out.println("⚠️ Admin user already exists!");
        }
    }

    // ✅ Run at startup
    @PostConstruct
    public void init() {
        createAdminUser();
    }
}
