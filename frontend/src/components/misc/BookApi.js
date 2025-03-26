import axios from 'axios'
import { config } from '../../Constants'

export const bookApi = {
  authenticate,
  signup,
  numberOfUsers,
  numberOfBooks,
  getUsers,
  deleteUser,
  getBooks,
  deleteBook,
  addBook,
  uploadEpub, 
  uploadEpubToBook,
  addToWishlist,        //Added
  removeFromWishlist,   //Added
  getWishlist           //Added
}

function uploadEpubToBook(user, isbn, formData) {
  return instance.post(`/api/books/${isbn}/upload-epub`, formData, {
    headers: {
      'Authorization': basicAuth(user),
      'Content-Type': 'multipart/form-data'
    }
  })
}

function uploadEpub(user, formData) {
  return instance.post('/api/books/upload-epub', formData, {
    headers: {
      'Authorization': basicAuth(user),
      'Content-Type': 'multipart/form-data'
    }
  })
}

// Wishlist functions
function addToWishlist(user, userId, bookIsbn) {
  return instance.post(`/api/wishlist/${userId}/${bookIsbn}`, {}, {
    headers: { 'Authorization': basicAuth(user) }
  })
}

function removeFromWishlist(user, userId, bookIsbn) {
  return instance.delete(`/api/wishlist/${userId}/${bookIsbn}`, {
    headers: { 'Authorization': basicAuth(user) }
  })
}

function getWishlist(user, userId) {
  return instance.get(`/api/wishlist/${userId}`, {
    headers: { 'Authorization': basicAuth(user) }
  })
}

// -- Existing functions

function authenticate(username, password) {
  return instance.post('/auth/authenticate', { username, password }, {
    headers: { 'Content-type': 'application/json' }
  })
}

function signup(user) {
  return instance.post('/auth/signup', user, {
    headers: { 'Content-type': 'application/json' }
  })
}

function numberOfUsers() {
  return instance.get('/public/numberOfUsers')
}

function numberOfBooks() {
  return instance.get('/public/numberOfBooks')
}

function getUsers(user, username) {
  const url = username ? `/api/users/${username}` : '/api/users'
  return instance.get(url, {
    headers: { 'Authorization': basicAuth(user) }
  })
}

function deleteUser(user, username) {
  return instance.delete(`/api/users/${username}`, {
    headers: { 'Authorization': basicAuth(user) }
  })
}

function getBooks(user, text) {
  const url = text ? `/api/books?text=${text}` : '/api/books'
  return instance.get(url, {
    headers: { 'Authorization': basicAuth(user) }
  })
}

function deleteBook(user, isbn) {
  return instance.delete(`/api/books/${isbn}`, {
    headers: { 'Authorization': basicAuth(user) }
  })
}

function addBook(user, book) {
  return instance.post('/api/books', book, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': basicAuth(user)
    }
  })
}

// -- Axios
const instance = axios.create({
  baseURL: config.url.API_BASE_URL
})

// -- Helper functions
function basicAuth(user) {
  return `Basic ${user.authdata}`
}
