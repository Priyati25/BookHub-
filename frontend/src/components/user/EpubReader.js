import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { config } from '../../Constants';
import { useAuth } from '../context/AuthContext';   
import '../../styles/EpubReader.css';
import { ReactReader } from 'react-reader';

function EpubReader() {
  const { isbn } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [epubUrl, setEpubUrl] = useState('');

  const { getUser } = useAuth();
  const user = getUser();

  useEffect(() => {
    const fetchEpub = async () => {
      try {
        console.log(`Fetching EPUB for ISBN: ${isbn}`);
        
        const response = await fetch(`${config.url.API_BASE_URL}/api/books/${isbn}/epub`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch EPUB file');
        }

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        console.log('EPUB Blob URL:', blobUrl);
        setEpubUrl(blobUrl);  
        setLoading(false);
      } catch (error) {
        console.error('Error loading EPUB:', error);
        setError('Failed to load EPUB.');
        setLoading(false);
      }
    };

    fetchEpub();

    return () => {
      if (epubUrl) {
        URL.revokeObjectURL(epubUrl);
      }
    };
  }, [isbn]);

  if (loading) return <div>Loading EPUB...</div>;
  if (error) {
    return (
      <div className="epub-error-container">
        <div className="epub-error-message">
          <h2>No EPUB file available</h2>
          <p>Please check again later or try a different book.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="epub-reader-container">
      {epubUrl ? (
        <div className="react-reader-wrapper">
          <ReactReader
            url={epubUrl}
            title={`EPUB Viewer - ISBN: ${isbn}`}
            showToc={true}
            epubInitOptions={{ openAs: 'epub' }}
          />
        </div>
      ) : (
        <div>No EPUB file found</div>
      )}
    </div>
  );
}

export default EpubReader;





// import React, { useEffect, useRef } from 'react'
// import { useParams } from 'react-router-dom'
// import axios from 'axios'
// import ePub from 'epubjs'
// import { useAuth } from '../context/AuthContext'
// import '../../styles/EpubReader.css'

// function EpubReader() {
//   const { isbn } = useParams()
//   const viewerRef = useRef(null)
//   const bookRef = useRef(null)

//   const { getUser } = useAuth()                  
//   const user = getUser()

//   useEffect(() => {
//     const loadBook = async () => {
//       try {
//         console.log('Fetching EPUB for ISBN:', isbn)

//         const response = await axios.get(`http://localhost:8080/api/books/${isbn}/epub`, {
//           responseType: 'blob',
//           headers: {
//             'Authorization': `Basic ${user.authdata}`    // ✅ Add Authorization Header
//           }
//         })

//         const bookBlob = new Blob([response.data], { type: 'application/epub+zip' })
//         const bookUrl = URL.createObjectURL(bookBlob)

//         console.log('EPUB Blob URL:', bookUrl)

//         if (bookRef.current) {
//             bookRef.current.destroy()
//         }
        
//         bookRef.current = ePub(bookUrl)
//         const rendition = bookRef.current.renderTo(viewerRef.current, {
//             width: '100%',
//             height: '100%'
//         })

//         rendition.display().then(() => {
//             console.log('EPUB successfully displayed')
//         })

        

//         // const book = ePub(bookUrl)
//         // const rendition = book.renderTo(viewerRef.current, {
//         //   width: '100%',
//         //   height: '100%'
//         // })
//         // rendition.display()
//     //   } catch (error) {
//     //     console.error('Failed to load EPUB', error)
//     //   }
//     // }

//     return () => {
//         URL.revokeObjectURL(bookUrl)
//         if (bookRef.current) {
//           bookRef.current.destroy()
//         }
//       }

//     } catch (error) {
//       console.error('Failed to load EPUB', error)
//     }
//   }

//     loadBook()
//   }, [isbn,user])

//   return (
//     <div className="epub-reader-container">
//       <div ref={viewerRef} className="epub-viewer" />
//     </div>
//   )
// }

// export default EpubReader
