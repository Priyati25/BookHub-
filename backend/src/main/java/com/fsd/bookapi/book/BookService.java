package com.fsd.bookapi.book;

import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.List;

public interface BookService {

    List<Book> getBooks();

    List<Book> getBooksContainingText(String text);

    Book validateAndGetBook(String isbn);

    Book saveBook(Book book);

    void deleteBook(Book book);

    // New methods for EPUB handling
    String saveEpubFile(String isbn, MultipartFile file);  // To upload EPUB
    byte[] getEpubFile(String isbn);// To read EPUB
    InputStream getEpubStream(String isbn);
}

//package com.fsd.bookapi.book;
//
//import java.util.List;
//
//public interface BookService {
//
//    List<Book> getBooks();
//
//    List<Book> getBooksContainingText(String text);
//
//    Book validateAndGetBook(String isbn);
//
//    Book saveBook(Book book);
//
//    void deleteBook(Book book);
//}
