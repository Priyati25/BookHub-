import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Loader, Message, Icon } from 'semantic-ui-react';
import { useAuth } from '../context/AuthContext';
import { bookApi } from '../misc/BookApi';
import { useNavigate } from 'react-router-dom';

const WishlistPage = () => {
    const { getUser } = useAuth();
    const user = getUser();
    const userId = user?.id;

    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const response = await bookApi.getWishlist(user, userId);
            setWishlist(response.data);
        } catch (error) {
            setError('Failed to fetch wishlist');
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (bookIsbn) => {
        try {
            await bookApi.removeFromWishlist(user, userId, bookIsbn);
            setWishlist(wishlist.filter((item) => item.bookIsbn !== bookIsbn));
        } catch (error) {
            setError('Failed to remove book');
        }
    };

    const getCoverImage = (isbn) => {
        return isbn
          ? `https://books.google.com/books/content?vid=ISBN${isbn}&printsec=frontcover&img=1&zoom=1&source=gbs_api`
          : '/images/placeholder.png';
      };

    if (loading) return <Loader active inline="centered" />;

    return (
        <Container>
            <h2>My Wishlist</h2>

            {error && <Message negative>{error}</Message>}

            <Card.Group itemsPerRow={3}>
                {wishlist.map((item) => (
                    <Card key={item.id}>
                        <Card.Content>
                            <Card.Header>{item.bookTitle}</Card.Header>
                            <Card.Meta>Author: John Doe</Card.Meta>
                            <Card.Description>
                                {item.bookDescription || 'No description available.'}
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <Button color="red" onClick={() => removeFromWishlist(item.bookIsbn)}>
                                <Icon name="trash" /> Remove
                            </Button>
                        </Card.Content>
                    </Card>
                ))}
            </Card.Group>

            <Button color="blue" onClick={() => navigate('/user')}>
                Back to Books
            </Button>
        </Container>
    );
};

export default WishlistPage;
