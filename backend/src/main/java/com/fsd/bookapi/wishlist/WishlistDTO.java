package com.fsd.bookapi.wishlist;

import lombok.Data;

@Data
public class WishlistDTO {
    private Long id;
    private Long userId;
    private String bookIsbn;
}
