import React from 'react'
import { useNavigate } from 'react-router-dom'   // Import for navigation
import { Grid, Header, Form, Icon, Image, Input, Item, Segment, Button } from 'semantic-ui-react'
import '../../styles/BookList.css'

function BookList({ isBooksLoading, bookTextSearch, books, handleInputChange, handleSearchBook }) {
  let bookList
  const navigate = useNavigate()

  
  const handleBookClick = (isbn) => {
    navigate(`/reader/${isbn}`)   // Navigate to EPUB viewer
  }

  if (books.length === 0) {
    bookList = <Item key='no-book'>No book found</Item>
  } else {
    bookList = books.map((book) => (
      <Item key={book.isbn || book.id} className="book-item">
        <Image
          src={book.isbn ? `http://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg` : '/images/placeholder.png'}
          onError={(e) => { e.target.src = '/images/placeholder.png' }}
          size='small'
          bordered
          rounded
          className="book-cover"
        />
        <Item.Content>
          <Item.Header>{book.title}</Item.Header>
          <Item.Meta>ISBN: {book.isbn || 'N/A'}</Item.Meta>
          <Item.Description>
            <p>{book.description || 'No description available'}</p>
          </Item.Description>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <Button 
              color='orange' 
              className="view-details-btn"
            >
              View Details
            </Button>

            <Button 
              color='blue' 
              onClick={() => handleBookClick(book.isbn)} 
              className="read-epub-btn"
            >

            <Icon name='book' /> Read EPUB
            </Button>
          </div>


        </Item.Content>
      </Item>
    ))
  }

  return (
    <Segment loading={isBooksLoading} color='blue' className="book-segment">
      <Grid stackable divided>
        <Grid.Row columns='2'>
          <Grid.Column width='3'>
            <Header as='h2' className="book-header">
              <Icon name='book' />
              <Header.Content>Books</Header.Content>
            </Header>
          </Grid.Column>
          <Grid.Column>
            <Form onSubmit={handleSearchBook} className="book-form">
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
        </Grid.Row>
      </Grid>
      <Item.Group divided unstackable relaxed link className="book-group">
        {bookList}
      </Item.Group>
    </Segment>
  )
}

export default BookList




// import React from 'react'
// import { Grid, Header, Form, Icon, Image, Input, Item, Segment } from 'semantic-ui-react'

// function BookList({ isBooksLoading, bookTextSearch, books, handleInputChange, handleSearchBook }) {
//   let bookList
//   if (books.length === 0) {
//     bookList = <Item key='no-book'>No book</Item>
//   } else {
//     bookList = books.map(book => {
//       return (
//         <Item key={book.isbn}>
//           <Image src={`http://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`} size='tiny' bordered rounded />
//           <Item.Content>
//             <Item.Header>{book.title}</Item.Header>
//             <Item.Meta>{book.isbn}</Item.Meta>
//             <Item.Description>
//               <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
//             </Item.Description>
//           </Item.Content>
//         </Item>
//       )
//     })
//   }

//   return (
//     <Segment loading={isBooksLoading} color='blue'>
//       <Grid stackable divided>
//         <Grid.Row columns='2'>
//           <Grid.Column width='3'>
//             <Header as='h2'>
//               <Icon name='book' />
//               <Header.Content>Books</Header.Content>
//             </Header>
//           </Grid.Column>
//           <Grid.Column>
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
//         </Grid.Row>
//       </Grid>
//       <Item.Group divided unstackable relaxed link>
//         {bookList}
//       </Item.Group>
//     </Segment>
//   )
// }

// export default BookList