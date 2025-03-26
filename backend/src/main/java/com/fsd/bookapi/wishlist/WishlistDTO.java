package com.fsd.bookapi.wishlist;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor  // Added this to avoid constructor error
public class WishlistDTO {
    private Long id;
    private Long userId;
    private String bookIsbn;
    private String bookTitle;  // Added field to include the book title
}
