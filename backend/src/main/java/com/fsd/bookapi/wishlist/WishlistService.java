package com.fsd.bookapi.wishlist;

import com.fsd.bookapi.book.Book;
import com.fsd.bookapi.book.BookRepository;
import com.fsd.bookapi.user.User;
import com.fsd.bookapi.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    // Add to wishlist
    public WishlistDTO addToWishlist(Long userId, String bookIsbn) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Book book = bookRepository.findById(bookIsbn)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with ISBN: " + bookIsbn));

        // ✅ Use Book object in the repository call
        if (wishlistRepository.existsByUserAndBook(user, book)) {
            throw new IllegalStateException("Book is already in wishlist");
        }

        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setBook(book);

        Wishlist savedWishlist = wishlistRepository.save(wishlist);

        return new WishlistDTO(savedWishlist.getId(), userId, book.getIsbn(), book.getTitle());
    }

    // Get user's wishlist
    public List<WishlistDTO> getWishlist(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Wishlist> wishlists = wishlistRepository.findByUser(user);

        return wishlists.stream()
                .map(w -> new WishlistDTO(
                        w.getId(),
                        userId,
                        w.getBook().getIsbn(),
                        w.getBook().getTitle()
                ))
                .collect(Collectors.toList());
    }

    // Remove from wishlist
    public void removeFromWishlist(Long userId, String bookIsbn) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Book book = bookRepository.findById(bookIsbn)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));

        wishlistRepository.deleteByUserAndBook(user, book);
    }
}
