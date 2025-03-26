import React from 'react'
import { Button, Form, Icon } from 'semantic-ui-react'
import '../../styles/BookForm.css'

function BookForm({ bookIsbn, bookTitle, handleInputChange, handleAddBook }) {
  const createBtnDisabled = bookIsbn.trim() === '' || bookTitle.trim() === ''
  
  return (
    <Form onSubmit={handleAddBook} className="book-form">
      <Form.Group>
        <Form.Input
          name='bookIsbn'
          placeholder='ISBN *'
          value={bookIsbn}
          onChange={handleInputChange}
          className="book-input"
        />
        <Form.Input
          name='bookTitle'
          placeholder='Title *'
          value={bookTitle}
          onChange={handleInputChange}
          className="book-input"
        />
        <Button 
          icon 
          labelPosition='right' 
          disabled={createBtnDisabled}
          className="add-book-btn"
        >
          Create<Icon name='add' />
        </Button>
      </Form.Group>
    </Form>
  )
}

export default BookForm


// import React from 'react'
// import { Button, Form, Icon } from 'semantic-ui-react'

// function BookForm({ bookIsbn, bookTitle, handleInputChange, handleAddBook }) {
//   const createBtnDisabled = bookIsbn.trim() === '' || bookTitle.trim() === ''
//   return (
//     <Form onSubmit={handleAddBook}>
//       <Form.Group>
//         <Form.Input
//           name='bookIsbn'
//           placeholder='ISBN *'
//           value={bookIsbn}
//           onChange={handleInputChange}
//         />
//         <Form.Input
//           name='bookTitle'
//           placeholder='Title *'
//           value={bookTitle}
//           onChange={handleInputChange}
//         />
//         <Button icon labelPosition='right' disabled={createBtnDisabled}>
//           Create<Icon name='add' />
//         </Button>
//       </Form.Group>
//     </Form>
//   )
// }

// export default BookForm