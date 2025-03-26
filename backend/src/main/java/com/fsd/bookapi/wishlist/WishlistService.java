package com.fsd.bookapi.wishlist;

import com.fsd.bookapi.book.Book;
import com.fsd.bookapi.book.BookRepository;
import com.fsd.bookapi.user.User;
import com.fsd.bookapi.user.UserRepository;
import jakarta.transaction.Transactional;
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

    public List<WishlistDTO> getWishlistByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Wishlist> wishlist = wishlistRepository.findByUser(user);

        return wishlist.stream().map(w -> {
            WishlistDTO dto = new WishlistDTO();
            dto.setId(w.getId());
            dto.setUserId(w.getUser().getId());
            dto.setBookIsbn(w.getBook().getIsbn());
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public void addToWishlist(Long userId, String bookIsbn) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Book book = bookRepository.findById(bookIsbn)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setBook(book);

        wishlistRepository.save(wishlist);
    }

    @Transactional
    public void removeFromWishlist(Long userId, String bookIsbn) {
        wishlistRepository.deleteByUserIdAndBookIsbn(userId, bookIsbn);
    }
}
