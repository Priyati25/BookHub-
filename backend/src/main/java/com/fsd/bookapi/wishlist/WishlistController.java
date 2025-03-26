package com.fsd.bookapi.wishlist;

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
    public ResponseEntity<List<WishlistDTO>> getWishlist(@PathVariable Long userId) {
        List<WishlistDTO> wishlist = wishlistService.getWishlistByUserId(userId);
        return ResponseEntity.ok(wishlist);
    }

    @PostMapping("/{userId}/{bookIsbn}")
    public ResponseEntity<String> addToWishlist(@PathVariable Long userId, @PathVariable String bookIsbn) {
        wishlistService.addToWishlist(userId, bookIsbn);
        return ResponseEntity.ok("Book added to wishlist!");
    }

    @DeleteMapping("/{userId}/{bookIsbn}")
    public ResponseEntity<String> removeFromWishlist(@PathVariable Long userId, @PathVariable String bookIsbn) {
        wishlistService.removeFromWishlist(userId, bookIsbn);
        return ResponseEntity.ok("Book removed from wishlist!");
    }
}
