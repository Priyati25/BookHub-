import React, {useState, useEffect} from 'react'
import { Button, Form, Grid, Image, Input, Table, Icon } from 'semantic-ui-react'
import BookForm from './BookForm'
import '../../styles/BookTable.css'
import { config } from '../../Constants';

function BookTable({ books, bookIsbn, bookTitle, bookTextSearch, handleInputChange, handleAddBook, handleDeleteBook, handleSearchBook }) {
  let bookList

  const [fetchedBooks, setFetchedBooks] = useState([]);  //  Renamed state variable

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${config.url.API_BASE_URL}/api/books`);
        const data = await response.json();

        console.log("Fetched books:", data);  //Debugging log

        // Ensure hasEpub is properly mapped
        const mappedBooks = data.map(book => ({
          ...book,
          hasEpub: Boolean(book.hasEpub)   //Correct mapping
        }));

        setFetchedBooks(mappedBooks);
      } catch (error) {
        console.error('Failed to fetch books', error);
      }
    };

    fetchBooks();
  }, []);
  if (books.length === 0) {
    bookList = (
      <Table.Row key='no-book'>
        <Table.Cell collapsing textAlign='center' colSpan='4'>No book</Table.Cell>
      </Table.Row>
    )
  } else {
    bookList = books.map(book => (
      <Table.Row key={book.isbn}>
        <Table.Cell collapsing>
          <Button
            circular
            color='red'
            size='small'
            icon='trash'
            onClick={() => handleDeleteBook(book.isbn)}
          />
        </Table.Cell>
        <Table.Cell>
          <Image src={`http://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`} size='tiny' bordered rounded />
        </Table.Cell>
        <Table.Cell>{book.isbn}</Table.Cell>
        <Table.Cell>{book.title}</Table.Cell>
      </Table.Row>
    ))
  }

  const getEpubUrl = (isbn) => {
    return `${config.url.API_BASE_URL}/api/books/${isbn}/epub`;
  };

  return (
    <>
      <Grid stackable>
        <Grid.Row columns='2'>
          {/* Search Form */}
          <Grid.Column width='6' style={{ paddingTop: '20px' }}>  
            <Form onSubmit={handleSearchBook}>
              <Input
                action={{ icon: 'search' }}
                name='bookTextSearch'
                placeholder='Search by ISBN or Title'
                value={bookTextSearch}
                onChange={handleInputChange}
                className="book-search-input"
              />
            </Form>
          </Grid.Column>

          {/* Book Form */}
          <Grid.Column>
            <BookForm
              bookIsbn={bookIsbn}
              bookTitle={bookTitle}
              handleInputChange={handleInputChange}
              handleAddBook={handleAddBook}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>

      {/* Book Table */}
      <Table compact striped selectable className="book-table">
        <Table.Header>
          <Table.Row>
          <Table.HeaderCell width={1}>#</Table.HeaderCell>
            <Table.HeaderCell width={2}>Cover</Table.HeaderCell>
            <Table.HeaderCell width={3}>ISBN</Table.HeaderCell>
            <Table.HeaderCell width={4}>Title</Table.HeaderCell>
            <Table.HeaderCell width={2}>Action</Table.HeaderCell>  
            <Table.HeaderCell width={2}>EPUB</Table.HeaderCell> 
          </Table.Row>
        </Table.Header>
        
        <Table.Body>
        {books.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan='6' textAlign='center'>No books available</Table.Cell>
            </Table.Row>
          ) : (
            books.map((book, index) => (
              <Table.Row key={book.isbn}>
                <Table.Cell>{index + 1}</Table.Cell>   {/* Row number */}
                
                <Table.Cell>
                  <Image
                    src={`http://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`}
                    size='tiny'
                    bordered
                    rounded
                    onError={(e) => { e.target.src = '/images/placeholder.png' }}  // Fallback image
                  />
                </Table.Cell>
                
                <Table.Cell>{book.isbn}</Table.Cell>
                <Table.Cell>{book.title}</Table.Cell>

                {/* Delete Button */}
                <Table.Cell>
                  <Button 
                    circular 
                    color='red' 
                    size='small' 
                    icon='trash' 
                    onClick={() => handleDeleteBook(book.isbn)}
                  />
                </Table.Cell>

                {/* EPUB Read Button */}
                <Table.Cell>
                  {Boolean(book.hasEpub) ? (    //Check EPUB availability properly
                    <Button
                      color='green'
                      onClick={() => window.open(getEpubUrl(book.isbn), '_blank')}
                    >
                      <Icon name='book' /> Read
                    </Button>
                  ) : (
                    <span>No EPUB</span>
                  )}
                </Table.Cell>
              </Table.Row>
            ))
          )}
      </Table.Body>
      </Table>
    </>
  )
}

export default BookTable



// import React from 'react'
// import { Button, Form, Grid, Image, Input, Table } from 'semantic-ui-react'
// import BookForm from './BookForm'

// function BookTable({ books, bookIsbn, bookTitle, bookTextSearch, handleInputChange, handleAddBook, handleDeleteBook, handleSearchBook }) {
//   let bookList
//   if (books.length === 0) {
//     bookList = (
//       <Table.Row key='no-book'>
//         <Table.Cell collapsing textAlign='center' colSpan='4'>No book</Table.Cell>
//       </Table.Row>
//     )
//   } else {
//     bookList = books.map(book => {
//       return (
//         <Table.Row key={book.isbn}>
//           <Table.Cell collapsing>
//             <Button
//               circular
//               color='red'
//               size='small'
//               icon='trash'
//               onClick={() => handleDeleteBook(book.isbn)}
//             />
//           </Table.Cell>
//           <Table.Cell>
//             <Image src={`http://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`} size='tiny' bordered rounded />
//           </Table.Cell>
//           <Table.Cell>{book.isbn}</Table.Cell>
//           <Table.Cell>{book.title}</Table.Cell>
//         </Table.Row>
//       )
//     })
//   }

//   return (
//     <>
//       <Grid stackable divided>
//         <Grid.Row columns='2'>
//           <Grid.Column width='5'>
//             <Form onSubmit={handleSearchBook}>
//               <Input
//                 action={{ icon: 'search' }}
//                 name='bookTextSearch'
//                 placeholder='Search by ISBN or Title'
//                 value={bookTextSearch}
//                 onChange={handleInputChange}
//               />
//             </Form>
//           </Grid.Column>
//           <Grid.Column>
//             <BookForm
//               bookIsbn={bookIsbn}
//               bookTitle={bookTitle}
//               handleInputChange={handleInputChange}
//               handleAddBook={handleAddBook}
//             />
//           </Grid.Column>
//         </Grid.Row>
//       </Grid>
//       <Table compact striped selectable>
//         <Table.Header>
//           <Table.Row>
//             <Table.HeaderCell width={1}/>
//             <Table.HeaderCell width={3}>Cover</Table.HeaderCell>
//             <Table.HeaderCell width={4}>ISBN</Table.HeaderCell>
//             <Table.HeaderCell width={8}>Title</Table.HeaderCell>
//           </Table.Row>
//         </Table.Header>
//         <Table.Body>
//           {bookList}
//         </Table.Body>
//       </Table>
//     </>
//   )
// }

// export default BookTable