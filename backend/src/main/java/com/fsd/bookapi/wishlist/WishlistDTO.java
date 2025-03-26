package com.fsd.bookapi.wishlist;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WishlistDTO {
    private Long id;          // Wishlist ID
    private Long userId;      // User ID
    private String isbn;      // Book ISBN (renamed for consistency)
    private String title;     // Book Title (added for readability)
}
