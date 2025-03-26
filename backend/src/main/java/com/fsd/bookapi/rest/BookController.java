package com.fsd.bookapi.rest;

import com.fsd.bookapi.book.Book;
import com.fsd.bookapi.rest.dto.BookDto;
import com.fsd.bookapi.rest.dto.CreateBookRequest;
import com.fsd.bookapi.book.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;

import static com.fsd.bookapi.config.SwaggerConfig.BASIC_AUTH_SECURITY_SCHEME;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
    @GetMapping
    public List<BookDto> getBooks(@RequestParam(value = "text", required = false) String text) {
        List<Book> books = (text == null) ? bookService.getBooks() : bookService.getBooksContainingText(text);
        return books.stream()
                .map(BookDto::from)
                .collect(Collectors.toList());
    }

    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public BookDto createBook(@Valid @RequestBody CreateBookRequest createBookRequest) {
        Book book = Book.from(createBookRequest);
        return BookDto.from(bookService.saveBook(book));
    }

    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
    @DeleteMapping("/{isbn}")
    public BookDto deleteBook(@PathVariable String isbn) {
        Book book = bookService.validateAndGetBook(isbn);
        bookService.deleteBook(book);
        return BookDto.from(book);
    }

    // New: Upload EPUB file
    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
    @PostMapping("/{isbn}/upload-epub")
    public ResponseEntity<String> uploadEpub(@PathVariable String isbn, @RequestParam("file") MultipartFile file) {
            bookService.saveEpubFile(isbn, file);
            return ResponseEntity.ok("EPUB uploaded successfully for book with ISBN: " + isbn);
    }

    // New: Serve EPUB file for reading
    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
    @GetMapping("/{isbn}/epub")
    public ResponseEntity<StreamingResponseBody> getEpub(@PathVariable String isbn) {
        Book book = bookService.validateAndGetBook(isbn);

        // Check if content is available
        if (book.getEpubContent() != null && book.getEpubContent().length > 0) {
            StreamingResponseBody responseBody = outputStream -> {
                outputStream.write(book.getEpubContent());
                outputStream.flush();
            };

            return ResponseEntity.ok()
                    .header("Content-Type", "application/epub+zip")
                    .body(responseBody);
        }

        // Fallback to serve from file path if content is not available
        InputStream epubStream = bookService.getEpubStream(isbn);
        if (epubStream != null) {
            StreamingResponseBody responseBody = outputStream -> {
                byte[] buffer = new byte[1024];
                int bytesRead;
                while ((bytesRead = epubStream.read(buffer)) != -1) {
                    outputStream.write(buffer, 0, bytesRead);
                }
                epubStream.close();
            };

            return ResponseEntity.ok()
                    .header("Content-Type", "application/epub+zip")
                    .body(responseBody);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

//package com.fsd.bookapi.rest;
//
//import com.fsd.bookapi.book.Book;
//import com.fsd.bookapi.rest.dto.BookDto;
//import com.fsd.bookapi.rest.dto.CreateBookRequest;
//import com.fsd.bookapi.book.BookService;
//import io.swagger.v3.oas.annotations.Operation;
//import io.swagger.v3.oas.annotations.security.SecurityRequirement;
//import jakarta.validation.Valid;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.HttpStatus;
//import org.springframework.web.bind.annotation.DeleteMapping;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.ResponseStatus;
//import org.springframework.web.bind.annotation.RestController;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//import static com.fsd.bookapi.config.SwaggerConfig.BASIC_AUTH_SECURITY_SCHEME;
//
//@RequiredArgsConstructor
//@RestController
//@RequestMapping("/api/books")
//public class BookController {
//
//    private final BookService bookService;
//
//    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
//    @GetMapping
//    public List<BookDto> getBooks(@RequestParam(value = "text", required = false) String text) {
//        List<Book> books = (text == null) ? bookService.getBooks() : bookService.getBooksContainingText(text);
//        return books.stream()
//                .map(BookDto::from)
//                .collect(Collectors.toList());
//    }
//
//    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
//    @ResponseStatus(HttpStatus.CREATED)
//    @PostMapping
//    public BookDto createBook(@Valid @RequestBody CreateBookRequest createBookRequest) {
//        Book book = Book.from(createBookRequest);
//        return BookDto.from(bookService.saveBook(book));
//    }
//
//    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
//    @DeleteMapping("/{isbn}")
//    public BookDto deleteBook(@PathVariable String isbn) {
//        Book book = bookService.validateAndGetBook(isbn);
//        bookService.deleteBook(book);
//        return BookDto.from(book);
//    }
//}
