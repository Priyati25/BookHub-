package com.fsd.bookapi.wishlist;

import com.fsd.bookapi.user.User;
import com.fsd.bookapi.book.Book;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    List<Wishlist> findByUser(User user);

    @Modifying
    @Transactional
    @Query("DELETE FROM Wishlist w WHERE w.user.id = :userId AND w.book.isbn = :bookIsbn")
    void deleteByUserIdAndBookIsbn(@Param("userId") Long userId, @Param("bookIsbn") String bookIsbn);
}

