package com.fsd.bookapi.wishlist;

import com.fsd.bookapi.book.Book;
import com.fsd.bookapi.book.BookRepository;
import com.fsd.bookapi.user.User;
import com.fsd.bookapi.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    // Add book to wishlist
    @Transactional
    public WishlistDTO addToWishlist(Long userId, String bookIsbn) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Book book = bookRepository.findById(bookIsbn)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if (wishlistRepository.existsByUserAndBook(user, book)) {
            throw new IllegalStateException("Book already in wishlist");
        }

        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setBook(book);
        wishlistRepository.save(wishlist);

        return new WishlistDTO(wishlist.getId(), userId, book.getIsbn(), book.getTitle(), book.getEpubPath());
    }

    // Get user wishlist
    public List<WishlistDTO> getWishlist(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Wishlist> wishlist = wishlistRepository.findByUser(user);

        return wishlist.stream()
                .map(w -> new WishlistDTO(
                        w.getId(),
                        w.getUser().getId(),
                        w.getBook().getIsbn(),
                        w.getBook().getTitle(),
                        w.getBook().getEpubPath()
                ))
                .collect(Collectors.toList());
    }

    // Remove book from wishlist
    @Transactional
    public void removeFromWishlist(Long userId, String bookIsbn) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Book book = bookRepository.findById(bookIsbn)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        wishlistRepository.deleteByUserAndBook(user, book);
    }
}
