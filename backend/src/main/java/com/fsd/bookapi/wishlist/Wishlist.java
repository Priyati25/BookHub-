package com.fsd.bookapi.wishlist;

import com.fsd.bookapi.book.Book;
import com.fsd.bookapi.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "wishlist")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Wishlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "book_isbn", referencedColumnName = "isbn", nullable = false)
    private Book book;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // ✅ Add getter and setter for book ISBN
    public String getBookIsbn() {
        return book != null ? book.getIsbn() : null;
    }

    public void setBookIsbn(String isbn) {
        if (book == null) {
            book = new Book();
        }
        book.setIsbn(isbn);
    }
}
