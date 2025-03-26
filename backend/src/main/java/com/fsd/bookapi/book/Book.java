package com.fsd.bookapi.book;

import com.fsd.bookapi.rest.dto.CreateBookRequest;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "books")
public class Book {

    @Id
    private String isbn;

    private String title;

    // New field to store EPUB file path
    private String epubPath;

    @Lob
    @Column(name = "epub_content", columnDefinition = "LONGBLOB")
    private byte[] epubContent;

    public Book(String isbn, String title) {
        this.isbn = isbn;
        this.title = title;
    }

    public static Book from(CreateBookRequest createBookRequest) {
        return new Book(createBookRequest.isbn(), createBookRequest.title());
    }
}

//package com.fsd.bookapi.book;
//
//import com.fsd.bookapi.rest.dto.CreateBookRequest;
//import jakarta.persistence.Entity;
//import jakarta.persistence.Id;
//import jakarta.persistence.Table;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//@Data
//@NoArgsConstructor
//@Entity
//@Table(name = "books")
//public class Book {
//
//    @Id
//    private String isbn;
//
//    private String title;
//
//    public Book(String isbn, String title) {
//        this.isbn = isbn;
//        this.title = title;
//    }
//
//    public static Book from(CreateBookRequest createBookRequest) {
//        return new Book(createBookRequest.isbn(), createBookRequest.title());
//    }
//}
