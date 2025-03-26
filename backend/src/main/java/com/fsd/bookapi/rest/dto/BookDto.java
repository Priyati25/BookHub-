package com.fsd.bookapi.rest.dto;

import com.fsd.bookapi.book.Book;

public record BookDto(String isbn, String title) {

    public static BookDto from(Book book) {
        return new BookDto(book.getIsbn(), book.getTitle());
    }
}