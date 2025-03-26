import React, { useState, useEffect } from 'react';
import { bookApi } from '../misc/BookApi';
import { handleLogError } from '../misc/Helpers';
import { FaUser, FaBook } from 'react-icons/fa';
import '../../styles/Home.css';

function Home() {
  const [numberOfUsers, setNumberOfUsers] = useState(0);
  const [numberOfBooks, setNumberOfBooks] = useState(0);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [randomBooks, setRandomBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const responseUsers = await bookApi.numberOfUsers();
        setNumberOfUsers(responseUsers.data);

        const responseBooks = await bookApi.numberOfBooks();
        setNumberOfBooks(responseBooks.data);

        const responseFeatured = await bookApi.getFeaturedBooks();
        setFeaturedBooks(responseFeatured.data);

        const responseRandomBooks = await bookApi.getRandomBooks();
        setRandomBooks(responseRandomBooks.data);
      } catch (error) {
        handleLogError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home-container">
      <header className="welcome-section">
        <h1>Welcome to BookHub!</h1>
        <p>Discover amazing books and connect with fellow readers.</p>
      </header>

      <section className="stats-section">
        <div className="stat-box"><FaUser /> {numberOfUsers} Users</div>
        <div className="stat-box"><FaBook /> {numberOfBooks} Books</div>
      </section>

      <section className="featured-books">
        <h2>Featured Books</h2>
        <div className="book-grid">
          {featuredBooks.map(book => (
            <div key={book.id} className="book-card">
              <img src={book.coverImage} alt={book.title} />
              <h3>{book.title}</h3>
              <p>{book.author}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="random-books">
        <h2>Recommended for You</h2>
        <div className="book-grid">
          {randomBooks.map(book => (
            <div key={book.id} className="book-card">
              <img src={book.coverImage} alt={book.title} />
              <h3>{book.title}</h3>
              <p>{book.author}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;


// import React, { useState, useEffect } from 'react';
// import { Statistic, Icon, Grid, Container, Image, Segment, Dimmer, Loader } from 'semantic-ui-react';
// import { bookApi } from '../misc/BookApi';
// import { handleLogError } from '../misc/Helpers';
// import '../../styles/Home.css'; // Importing the CSS file

// function Home() {
//   const [numberOfUsers, setNumberOfUsers] = useState(0);
//   const [numberOfBooks, setNumberOfBooks] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         const responseUsers = await bookApi.numberOfUsers();
//         setNumberOfUsers(responseUsers.data);

//         const responseBooks = await bookApi.numberOfBooks();
//         setNumberOfBooks(responseBooks.data);
//       } catch (error) {
//         handleLogError(error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (isLoading) {
//     return (
//       <Segment basic className="loading-segment">
//         <Dimmer active inverted>
//           <Loader inverted size="huge">Loading</Loader>
//         </Dimmer>
//       </Segment>
//     );
//   }

//   return (
//     <Container text className="home-container">
//       <Grid stackable columns={2} className="stats-grid">
//         <Grid.Row>
//           <Grid.Column textAlign="center">
//             <Segment className="statistic-segment">
//               <Statistic>
//                 <Statistic.Value>
//                   <Icon name="user" className="user-icon" /> {numberOfUsers}
//                 </Statistic.Value>
//                 <Statistic.Label>Users</Statistic.Label>
//               </Statistic>
//             </Segment>
//           </Grid.Column>
//           <Grid.Column textAlign="center">
//             <Segment className="statistic-segment">
//               <Statistic>
//                 <Statistic.Value>
//                   <Icon name="book" className="book-icon" /> {numberOfBooks}
//                 </Statistic.Value>
//                 <Statistic.Label>Books</Statistic.Label>
//               </Statistic>
//             </Segment>
//           </Grid.Column>
//         </Grid.Row>
//       </Grid>

//       <div className="image-container">
//         <Image src="https://react.semantic-ui.com/images/wireframe/media-paragraph.png" className="home-image" />
//         <Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" className="home-image" />
//       </div>
//     </Container>
//   );
// }

// export default Home;
