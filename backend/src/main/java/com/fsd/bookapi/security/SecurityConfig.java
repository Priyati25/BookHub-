package com.fsd.bookapi.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    public static final String ADMIN = "ADMIN";
    public static final String USER = "USER";

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(Customizer.withDefaults())  // ✅ CORS enabled
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/").denyAll()
                        .requestMatchers(HttpMethod.POST, "/api/wishlist/**").hasAuthority(USER)    // ✅ Correct usage
                        .requestMatchers(HttpMethod.GET, "/api/wishlist/**").hasAuthority(USER)
                        .requestMatchers(HttpMethod.GET, "/api/books", "/api/books/**").hasAnyAuthority(ADMIN, USER)
                        .requestMatchers(HttpMethod.GET, "/api/users/me").hasAnyAuthority(ADMIN, USER)

                        .requestMatchers(HttpMethod.GET, "/api/books/{id}/epub").permitAll()

                        .requestMatchers("/api/books", "/api/books/**").hasAuthority(ADMIN)
                        .requestMatchers("/api/users", "/api/users/**").hasAuthority(ADMIN)
                        .requestMatchers("/public/**", "/auth/**").permitAll()
                        .requestMatchers("/error", "/csrf", "/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs", "/v3/api-docs/**").permitAll()
                        .requestMatchers("/error").permitAll()  //Allow Spring Boot error handling

                        .anyRequest().authenticated())
                .httpBasic(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .csrf(AbstractHttpConfigurer::disable)
                .build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }
}
