package com.fsd.bookapi.book;

import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
@Component
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;

    @Value("${file.upload-dir}")
    private String epubStorageDir;

    @PostConstruct
    public void init() {
        Path uploadDir = Paths.get(epubStorageDir).toAbsolutePath();
        if (!Files.exists(uploadDir)) {
            try {
                Files.createDirectories(uploadDir);
                System.out.println("EPUB upload directory created: " + uploadDir);
            } catch (IOException e) {
                throw new RuntimeException("Failed to create EPUB directory", e);
            }
        }
    }


    @Override
    public List<Book> getBooks() {
        return bookRepository.findAllByOrderByTitle();
    }

    @Override
    public List<Book> getBooksContainingText(String text) {
        return bookRepository.findByIsbnContainingOrTitleContainingIgnoreCaseOrderByTitle(text, text);
    }

    @Override
    public Book validateAndGetBook(String isbn) {
        return bookRepository.findById(isbn)
                .orElseThrow(() -> new BookNotFoundException(String.format("Book with isbn %s not found", isbn)));
    }

    @Override
    public Book saveBook(Book book) {
        return bookRepository.save(book);
    }

    @Override
    public void deleteBook(Book book) {
        bookRepository.delete(book);
    }

    // Method to upload and store EPUB file
    @Override
    @Transactional
    public String saveEpubFile(String isbn, MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Failed to upload empty file.");
            }

            Path uploadDir = Paths.get(epubStorageDir).toAbsolutePath();
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            String filename = isbn + ".epub";
            Path filePath = uploadDir.resolve(filename);

            // Store the file on disk
            Files.write(filePath, file.getBytes());

            // Read and store EPUB content in the database
            byte[] epubBytes = file.getBytes();

            Book book = validateAndGetBook(isbn);
            book.setEpubPath(filename);
            book.setEpubContent(epubBytes);   // Store EPUB content in the database
            bookRepository.save(book);

            return "EPUB uploaded successfully!";
        } catch (IOException e) {
            throw new RuntimeException("Failed to store EPUB file.", e);
        }
    }


    // Method to read EPUB file
    @Override
    public byte[] getEpubFile(String isbn) {
        Book book = validateAndGetBook(isbn);

        if (book.getEpubPath() == null || book.getEpubPath().isEmpty()) {
            throw new RuntimeException("No EPUB file found for this book.");
        }

        try {
            Path filePath = Paths.get(epubStorageDir).resolve(book.getEpubPath()).toAbsolutePath();
            // Check if the file exists
            if (!Files.exists(filePath)) {
                throw new RuntimeException("EPUB file not found on the server.");
            }
            return Files.readAllBytes(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to read EPUB file.", e);
        }
    }

    @Override
    public InputStream getEpubStream(String isbn) {
        Book book = validateAndGetBook(isbn);

        if (book.getEpubPath() == null || book.getEpubPath().isEmpty()) {
            throw new RuntimeException("No EPUB file found for this book.");
        }

        try {
            Path filePath = Paths.get(epubStorageDir).resolve(book.getEpubPath()).toAbsolutePath();
            if (!Files.exists(filePath)) {
                throw new RuntimeException("EPUB file not found on the server.");
            }

            // Return InputStream for streaming
            return Files.newInputStream(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to open EPUB file stream.", e);
        }
    }
}

//package com.fsd.bookapi.book;
//
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//public class BookServiceImpl implements BookService {
//
//    private final BookRepository bookRepository;
//
//    public BookServiceImpl(BookRepository bookRepository) {
//        this.bookRepository = bookRepository;
//    }
//
//
//    @Override
//    public List<Book> getBooks() {
//        return bookRepository.findAllByOrderByTitle();
//    }
//
//    @Override
//    public List<Book> getBooksContainingText(String text) {
//        return bookRepository.findByIsbnContainingOrTitleContainingIgnoreCaseOrderByTitle(text, text);
//    }
//
//    @Override
//    public Book validateAndGetBook(String isbn) {
//        return bookRepository.findById(isbn)
//                .orElseThrow(() -> new BookNotFoundException(String.format("Book with isbn %s not found", isbn)));
//    }
//
//    @Override
//    public Book saveBook(Book book) {
//        return bookRepository.save(book);
//    }
//
//    @Override
//    public void deleteBook(Book book) {
//        bookRepository.delete(book);
//    }
//}
