// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Button, Table, Message, Icon } from 'semantic-ui-react';

// function Wishlist({ userId }) {
//     const [wishlist, setWishlist] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     useEffect(() => {
//         fetchWishlist();
//     }, []);

//     const fetchWishlist = async () => {
//         try {
//             const res = await axios.get(`/api/wishlist/${userId}`);
//             setWishlist(res.data);
//             setLoading(false);
//         } catch (err) {
//             setError("Failed to fetch wishlist");
//             setLoading(false);
//         }
//     };

//     const removeFromWishlist = async (bookIsbn) => {
//         try {
//             await axios.delete(`/api/wishlist/${userId}/${bookIsbn}`);
//             setWishlist(wishlist.filter(book => book.bookIsbn !== bookIsbn));
//         } catch (err) {
//             setError("Failed to remove book from wishlist");
//         }
//     };

//     if (loading) return <Message>Loading...</Message>;

//     return (
//         <div>
//             <h2>Wishlist</h2>
//             {error && <Message negative>{error}</Message>}
//             <Table celled>
//                 <Table.Header>
//                     <Table.Row>
//                         <Table.HeaderCell>ISBN</Table.HeaderCell>
//                         <Table.HeaderCell>Actions</Table.HeaderCell>
//                     </Table.Row>
//                 </Table.Header>
//                 <Table.Body>
//                     {wishlist.map((item) => (
//                         <Table.Row key={item.id}>
//                             <Table.Cell>{item.bookIsbn}</Table.Cell>
//                             <Table.Cell>
//                                 <Button
//                                     color='red'
//                                     onClick={() => removeFromWishlist(item.bookIsbn)}
//                                 >
//                                     <Icon name='trash' /> Remove
//                                 </Button>
//                             </Table.Cell>
//                         </Table.Row>
//                     ))}
//                 </Table.Body>
//             </Table>
//         </div>
//     );
// }

// export default Wishlist;
