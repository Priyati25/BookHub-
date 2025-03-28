import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Container, Form, Button, Message, Dropdown } from 'semantic-ui-react'
import { useAuth } from '../context/AuthContext'
import { bookApi } from '../misc/BookApi'
import AdminTab from './AdminTab'
import { handleLogError } from '../misc/Helpers'
import '../../styles/AdminPage.css'

function AdminPage() {
  const Auth = useAuth()
  const user = Auth.getUser()
  const isAdmin = user.role === 'ADMIN'

  const [users, setUsers] = useState([])
  const [userUsernameSearch, setUserUsernameSearch] = useState('')
  const [isUsersLoading, setIsUsersLoading] = useState(false)

  const [books, setBooks] = useState([])
  const [bookIsbn, setBookIsbn] = useState('')
  const [bookTitle, setBookTitle] = useState('')
  const [selectedBookIsbn, setSelectedBookIsbn] = useState('')  
  const [bookTextSearch, setBookTextSearch] = useState('')
  const [isBooksLoading, setIsBooksLoading] = useState(false)

  const [epubFile, setEpubFile] = useState(null)
  const [uploadError, setUploadError] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false) 

  useEffect(() => {
    handleGetUsers()
    handleGetBooks()
  }, [])

  const handleInputChange = (e, { name, value }) => {
    if (name === 'userUsernameSearch') setUserUsernameSearch(value)
    else if (name === 'bookIsbn') setBookIsbn(value)
    else if (name === 'bookTitle') setBookTitle(value)
    else if (name === 'bookTextSearch') setBookTextSearch(value)
  }

  const handleGetUsers = async () => {
    try {
      setIsUsersLoading(true)
      const response = await bookApi.getUsers(user)
      setUsers(response.data)
    } catch (error) {
      handleLogError(error)
    } finally {
      setIsUsersLoading(false)
    }
  }

  const handleDeleteUser = async (username) => {
    try {
      await bookApi.deleteUser(user, username)
      await handleGetUsers()
    } catch (error) {
      handleLogError(error)
    }
  }

  const handleSearchUser = async () => {
    try {
      const response = await bookApi.getUsers(user, userUsernameSearch)
      const data = response.data
      setUsers(Array.isArray(data) ? data : [data])
    } catch (error) {
      handleLogError(error)
      setUsers([])
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

  const handleFileChange = (event) => {
    setEpubFile(event.target.files[0])
  }

  const handleBookChange = (e, { value }) => {
    setSelectedBookIsbn(value)
  }

  const handleUploadEpub = async () => {
    if (!epubFile || !selectedBookIsbn) return

  const formData = new FormData()
  formData.append('file', epubFile)

  try {
    await bookApi.uploadEpubToBook(user, selectedBookIsbn, formData)  //Upload API call
    setUploadSuccess(true)
    setUploadError(false)
    setEpubFile(null)
    setSelectedBookIsbn('')
    handleGetBooks()  // Refresh the book list after upload
  } catch (error) {
    setUploadError(true)
    setUploadSuccess(false)
    handleLogError(error)
  }
}

  const handleDeleteBook = async (isbn) => {
    try {
      await bookApi.deleteBook(user, isbn)
      await handleGetBooks()
    } catch (error) {
      handleLogError(error)
    }
  }

  const handleAddBook = async () => {
    try {
      const book = { isbn: bookIsbn.trim(), title: bookTitle.trim() }
      if (!(book.isbn && book.title)) return
      await bookApi.addBook(user, book)
      clearBookForm()
      await handleGetBooks()
    } catch (error) {
      handleLogError(error)
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

  const clearBookForm = () => {
    setBookIsbn('')
    setBookTitle('')
  }

  if (!isAdmin) {
    return <Navigate to='/' />
  }

  return (
    <Container className="admin-container">
       <h2>Admin Panel - Upload EPUB to Specific Book</h2>

      <Form onSubmit={handleUploadEpub}>
        <Form.Field>
        <label>Select Book</label>
        <Dropdown
            placeholder='Select Book'
            fluid
            selection
            options={books.map(book => ({
              key: book.isbn,
              text: `${book.title} (${book.isbn})`,
              value: book.isbn
            }))}
            onChange={handleBookChange}
            value={selectedBookIsbn}
          />
        </Form.Field>

        <Form.Field>
          <label>Upload EPUB File</label>
          <input
            type="file"
            accept=".epub"
            onChange={handleFileChange}
          />
        </Form.Field>

        <Button type="submit" color="blue" disabled={!epubFile || !selectedBookIsbn}>
          Upload
        </Button>
      </Form>

      {uploadSuccess && (
        <Message positive>
          <p>EPUB uploaded successfully!</p>
        </Message>
      )}
      {uploadError && (
        <Message negative>
          <p>Failed to upload EPUB.</p>
        </Message>
      )}

      <AdminTab
        isUsersLoading={isUsersLoading}
        users={users}
        userUsernameSearch={userUsernameSearch}
        handleDeleteUser={handleDeleteUser}
        handleSearchUser={handleSearchUser}
        isBooksLoading={isBooksLoading}
        books={books}
        bookIsbn={bookIsbn}
        bookTitle={bookTitle}
        bookTextSearch={bookTextSearch}
        handleAddBook={handleAddBook}
        handleDeleteBook={handleDeleteBook}
        handleSearchBook={handleSearchBook}
        handleInputChange={handleInputChange}
      />
    </Container>
  )
}

export default AdminPage




// import React, { useEffect, useState } from 'react'
// import { Navigate } from 'react-router-dom'
// import { Container } from 'semantic-ui-react'
// import { useAuth } from '../context/AuthContext'
// import { bookApi } from '../misc/BookApi'
// import AdminTab from './AdminTab'
// import { handleLogError } from '../misc/Helpers'

// function AdminPage() {
//   const Auth = useAuth()
//   const user = Auth.getUser()
//   const isAdmin = user.role === 'ADMIN'

//   const [users, setUsers] = useState([])
//   const [userUsernameSearch, setUserUsernameSearch] = useState('')
//   const [isUsersLoading, setIsUsersLoading] = useState(false)

//   const [books, setBooks] = useState([])
//   const [bookIsbn, setBookIsbn] = useState('')
//   const [bookTitle, setBookTitle] = useState('')
//   const [bookTextSearch, setBookTextSearch] = useState('')
//   const [isBooksLoading, setIsBooksLoading] = useState(false)

//   useEffect(() => {
//     handleGetUsers()
//     handleGetBooks()
//   }, [])

//   const handleInputChange = (e, { name, value }) => {
//     if (name === 'userUsernameSearch') {
//       setUserUsernameSearch(value)
//     } else if (name === 'bookIsbn') {
//       setBookIsbn(value)
//     } else if (name === 'bookTitle') {
//       setBookTitle(value)
//     } else if (name === 'bookTextSearch') {
//       setBookTextSearch(value)
//     }
//   }

//   const handleGetUsers = async () => {
//     try {
//       setIsUsersLoading(true)
//       const response = await bookApi.getUsers(user)
//       const users = response.data
//       setUsers(users)
//     } catch (error) {
//       handleLogError(error)
//     } finally {
//       setIsUsersLoading(false)
//     }
//   }

//   const handleDeleteUser = async (username) => {
//     try {
//       await bookApi.deleteUser(user, username)
//       await handleGetUsers()
//     } catch (error) {
//       handleLogError(error)
//     }
//   }

//   const handleSearchUser = async () => {
//     try {
//       const response = await bookApi.getUsers(user, userUsernameSearch)
//       const data = response.data
//       const users = data instanceof Array ? data : [data]
//       setUsers(users)
//     } catch (error) {
//       handleLogError(error)
//       setUsers([])
//     }
//   }

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

//   const handleDeleteBook = async (isbn) => {
//     try {
//       await bookApi.deleteBook(user, isbn)
//       await handleGetBooks()
//     } catch (error) {
//       handleLogError(error)
//     }
//   }

//   const handleAddBook = async () => {
//     try {
//       const book = { isbn: bookIsbn.trim(), title: bookTitle.trim() }
//       if (!(book.isbn && book.title)) {
//         return
//       }
//       await bookApi.addBook(user, book)
//       clearBookForm()
//       await handleGetBooks()
//     } catch (error) {
//       handleLogError(error)
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

//   const clearBookForm = () => {
//     setBookIsbn('')
//     setBookTitle('')
//   }

//   if (!isAdmin) {
//     return <Navigate to='/' />
//   }

//   return (
//     <Container>
//       <AdminTab
//         isUsersLoading={isUsersLoading}
//         users={users}
//         userUsernameSearch={userUsernameSearch}
//         handleDeleteUser={handleDeleteUser}
//         handleSearchUser={handleSearchUser}
//         isBooksLoading={isBooksLoading}
//         books={books}
//         bookIsbn={bookIsbn}
//         bookTitle={bookTitle}
//         bookTextSearch={bookTextSearch}
//         handleAddBook={handleAddBook}
//         handleDeleteBook={handleDeleteBook}
//         handleSearchBook={handleSearchBook}
//         handleInputChange={handleInputChange}
//       />
//     </Container>
//   )
// }

// export default AdminPage