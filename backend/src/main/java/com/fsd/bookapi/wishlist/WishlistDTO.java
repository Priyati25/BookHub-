package com.fsd.bookapi.wishlist;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WishlistDTO {
    private Long id;
    private Long userId;
    private String bookIsbn;
    private String bookTitle;
    private String bookEpubPath;
}
