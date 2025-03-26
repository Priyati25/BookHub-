package com.fsd.bookapi.wishlist;

import com.fsd.bookapi.book.Book;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<Book>> getWishlist(@PathVariable Long userId) {
        List<Book> wishlist = wishlistService.getWishlistByUser(userId);
        return ResponseEntity.ok(wishlist);
    }

    @PostMapping("/add")
    public ResponseEntity<String> addToWishlist(
            @RequestParam Long userId,
            @RequestParam String isbn) {

        wishlistService.addToWishlist(userId, isbn);
        return ResponseEntity.ok("Book added to wishlist");
    }

    @DeleteMapping("/remove")
    public ResponseEntity<String> removeFromWishlist(
            @RequestParam Long userId,
            @RequestParam String isbn) {

        wishlistService.removeFromWishlist(userId, isbn);
        return ResponseEntity.ok("Book removed from wishlist");
    }
}
