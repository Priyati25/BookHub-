package com.fsd.bookapi.book;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, String> {

    Book findByIsbn(String isbn);

    List<Book> findAllByOrderByTitle();

    List<Book> findByIsbnContainingOrTitleContainingIgnoreCaseOrderByTitle(String isbn, String title);


    @Query("SELECT b.epubContent FROM Book b WHERE b.isbn = :isbn")
    byte[] findEpubContentByIsbn(@Param("isbn") String isbn);

}
