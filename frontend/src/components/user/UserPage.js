import React, { useEffect, useState, useRef} from 'react'
import { Navigate,  useNavigate } from 'react-router-dom'
import { Container, Input, Button, Loader, Icon, Message, Card, Image } from 'semantic-ui-react'
import { useAuth } from '../context/AuthContext'
import { bookApi } from '../misc/BookApi'
import { handleLogError } from '../misc/Helpers'
import Toast from './Toast';
import axios from 'axios'
import '../../styles/UserPage.css'

function UserPage() {
  const Auth = useAuth()
  const user = Auth.getUser()
  const isUser = user.role === 'USER'

  const [books, setBooks] = useState([])
  const [bookTextSearch, setBookTextSearch] = useState('')
  const [isBooksLoading, setIsBooksLoading] = useState(false)
  const [wishlistMsg, setWishlistMsg] = useState('')
  const [wishlistError, setWishlistError] = useState('')

  
  const navigate = useNavigate() 
  const toastRef = useRef(null)

  useEffect(() => {
    handleGetBooks()
  }, [])

  const handleInputChange = (e) => {
    const { value } = e.target
    setBookTextSearch(value)

    if (value.trim() === '') {
      handleGetBooks()
    }
  }

  const handleGetBooks = async () => {
    try {
      setIsBooksLoading(true)
      const response = await bookApi.getBooks(user)
      setBooks(response.data)
    } catch (error) {
      handleLogError(error)
    } finally {
      setIsBooksLoading(false)
    }
  }

  const handleSearchBook = async () => {
    try {
      const response = await bookApi.getBooks(user, bookTextSearch)
      setBooks(response.data)
    } catch (error) {
      handleLogError(error)
      setBooks([])
    }
  }

  //Add book to wishlist
  const handleAddToWishlist = async (book) => {
    try {
      const userId = user.id
      await bookApi.addToWishlist(user, userId, book.isbn)

      // Display floating toast message with book title
      setWishlistMsg(`"${book.title}" added to wishlist!`)
      if (toastRef.current) {
        toastRef.current.showToast(`"${book.title}" added to wishlist!`)
      }

      setWishlistError('')
    } catch (error) {
      console.error('Failed to add book to wishlist', error)
      setWishlistError('Failed to add book to wishlist.')
      setWishlistMsg('')
    }
  }

  const handleBookClick = (isbn) => {
    navigate(`/reader/${isbn}`)   // Navigate to EPUB viewer
  }

  const getCoverImage = (isbn) => {
    return isbn
      ? `https://books.google.com/books/content?vid=ISBN${isbn}&printsec=frontcover&img=1&zoom=1&source=gbs_api`
      : '/images/placeholder.png';
  };

  if (!isUser) {
    return <Navigate to='/' />
  }

  return (
    <Container className="user-page">
    <Toast ref={toastRef} />
    
      <div className="search-section">
        <Input
          icon="search"
          placeholder="Search books..."
          value={bookTextSearch}
          onChange={handleInputChange}
          className="search-input"
        />
        <Button color="orange" onClick={handleSearchBook}>
          Search
        </Button>

        <Button color="blue" onClick={() => navigate('/wishlist')}>
                    View Wishlist
        </Button>

      </div>

      {isBooksLoading ? (
        <Loader active inline="centered" />
      ) : (
        <div className="book-list">
          {books.length > 0 ? (
            <Card.Group itemsPerRow={4}>
              {books.map((book) => (
                <Card 
                  key={book.id} 
                  className="book-item" 
                  onClick={() => handleBookClick(book.isbn)}  
                  style={{ cursor: 'pointer' }} 
                >
                  
                  <Image
                    src={getCoverImage(book.isbn)}
                    onError={(e) => { e.target.src = '/images/placeholder.png' }}
                    alt={book.title}
                    wrapped
                    ui={false}
                  />

                  {/* <Image
                    src={book.isbn ? `http://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg` : '/images/placeholder.png'}
                    onError={(e) => { e.target.src = '/images/placeholder.png' }}
                    alt={book.title}
                    wrapped
                    ui={false}
                  /> */}
                  <Card.Content>
                    <Card.Header>{book.title}</Card.Header>
                    <Card.Meta>Author: {book.author}</Card.Meta>
                    <Card.Description>
                      {book.description || 'No description available'}
                    </Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <Button
                      color="orange"
                      onClick={(e) => {
                        e.stopPropagation();  // Prevent navigating to reader when clicking wishlist button
                        handleAddToWishlist(book);
                      }}
                      fluid
                    >
                      <Icon name='heart' /> Add to Wishlist
                    </Button>
                  </Card.Content>
                </Card>
              ))}
            </Card.Group>
          ) : (
            <p>No books found.</p>
          )}
        </div>
      )}
    </Container>
  )
}

export default UserPage






// import React, { useEffect, useState } from 'react'
// import { Navigate } from 'react-router-dom'
// import { Container } from 'semantic-ui-react'
// import BookList from './BookList'
// import { useAuth } from '../context/AuthContext'
// import { bookApi } from '../misc/BookApi'
// import { handleLogError } from '../misc/Helpers'

// function UserPage() {
//   const Auth = useAuth()
//   const user = Auth.getUser()
//   const isUser = user.role === 'USER'

//   const [books, setBooks] = useState([])
//   const [bookTextSearch, setBookTextSearch] = useState('')
//   const [isBooksLoading, setIsBooksLoading] = useState(false)

//   useEffect(() => {
//     handleGetBooks()
//   }, [])

//   const handleInputChange = (e, { name, value }) => {
//     if (name === 'bookTextSearch') {
//       setBookTextSearch(value);
      
//       // If search input is cleared, reload all books
//       if (value.trim() === '') {
//         handleGetBooks();
//       }
//     }
//   };
  
//   const handleGetBooks = async () => {
//     try {
//       setIsBooksLoading(true)
//       const response = await bookApi.getBooks(user)
//       setBooks(response.data)
//     } catch (error) {
//       handleLogError(error)
//     } finally {
//       setIsBooksLoading(false)
//     }
//   }

//   const handleSearchBook = async () => {
//     try {
//       const response = await bookApi.getBooks(user, bookTextSearch)
//       const books = response.data
//       setBooks(books)
//     } catch (error) {
//       handleLogError(error)
//       setBooks([])
//     }
//   }

//   if (!isUser) {
//     return <Navigate to='/' />
//   }

//   return (
//     <Container>
//       <BookList
//         isBooksLoading={isBooksLoading}
//         bookTextSearch={bookTextSearch}
//         books={books}
//         handleInputChange={handleInputChange}
//         handleSearchBook={handleSearchBook}
//       />
//     </Container>
//   )
// }

// export default UserPage