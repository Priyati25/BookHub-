package com.fsd.bookapi.wishlist;

import com.fsd.bookapi.user.User;
import com.fsd.bookapi.book.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    List<Wishlist> findByUser(User user);

    // Change to reference Book object instead of bookIsbn string
    Optional<Wishlist> findByUserAndBook(User user, Book book);

    boolean existsByUserAndBook(User user, Book book);

    void deleteByUserAndBook(User user, Book book);
}
