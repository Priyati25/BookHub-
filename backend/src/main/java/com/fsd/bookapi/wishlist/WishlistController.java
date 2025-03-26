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

    // ✅ Add to wishlist
    @PostMapping("/{userId}/{isbn}")
    public ResponseEntity<WishlistDTO> addToWishlist(
            @PathVariable Long userId,
            @PathVariable String isbn) {

        WishlistDTO wishlistDTO = wishlistService.addToWishlist(userId, isbn);
        return ResponseEntity.ok(wishlistDTO);
    }

    // ✅ Get wishlist by user ID
    @GetMapping("/{userId}")
    public ResponseEntity<List<WishlistDTO>> getWishlist(
            @PathVariable Long userId) {

        List<WishlistDTO> wishlist = wishlistService.getWishlist(userId);
        return ResponseEntity.ok(wishlist);
    }

    // ✅ Remove from wishlist
    @DeleteMapping("/{userId}/{isbn}")
    public ResponseEntity<String> removeFromWishlist(
            @PathVariable Long userId,
            @PathVariable String isbn) {

        wishlistService.removeFromWishlist(userId, isbn);
        return ResponseEntity.ok("Book removed from wishlist");
    }
}
