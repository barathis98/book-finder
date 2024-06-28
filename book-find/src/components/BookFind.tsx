import React,{ useEffect, useState } from 'react';
import { Col, Container, Form, FormCheck, FormControl, ListGroup, Row } from 'react-bootstrap';
import debounce from 'debounce';
import axios from 'axios';
import { Book } from '../types/Book';


const BookFind = (): React.ReactElement =>{
    const [query, setQuery] = React.useState('');
    const [books, setBooks] = useState<Book[]>([]);
    const [sortByYear,setSortByYear] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
          if (query.trim()) { 
            fetchBooks(query);
          }
        }, 1000); 
    
        return () => clearTimeout(delayDebounceFn);
      }, [query]);



    const fetchBooks = async (searchTerm: string) => {
        try {
            console.log(searchTerm);
            const formattedSearchTerm = searchTerm.replace(/\s/g, '+'); 
            console.log(formattedSearchTerm);

           const response = await axios.get(`https://openlibrary.org/search.json?q=${formattedSearchTerm}&fields=key,first_publish_year,author_name,title,number_of_pages_median,isbn`);
           const data = response.data;
        //    console.log(data);
          const booksData: Book[] = data.docs.map((doc: any) => ({
            title: doc.title || 'Unknown',
            authors: doc.author_name || 'Unknown',
            firstPublishYear: doc.first_publish_year || 'Unknown',
            isbn: doc.isbn || [],
            numberOfPages: doc.number_of_pages_median || 'Unknown',
          }));
           setBooks(booksData);
           console.log(booksData);
        } catch (error) {
          console.error('Error fetching books:', error);
        }
      };

    //   const debouncer = debounce(fetchBooks,500);


    const handleSortToggle = () => {
        setSortByYear((prevSortByYear) => !prevSortByYear);
      };

    const handleTyping = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = event.target.value;
        setQuery(searchTerm);
        // debouncer(searchTerm)
    }
        return(
            <>

            {/* @ts-ignore */}
            <Container>
                {/* @ts-ignore */}
                <Row className="justify-content-center mt-5">
                {/* @ts-ignore */}
                <Col md={8}>
                <h1 className="text-center mb-4">Book Finder</h1>

                {/* @ts-ignore */}
                <Form>
                    {/* @ts-ignore */}
                    <FormControl
                        type='text'
                        placeholder='search for books'
                        value={query}
                        onChange={handleTyping}>

                    </FormControl>
                                        {/* @ts-ignore */}

                    <FormCheck
                type="switch"
                id="sort-toggle"
                label="Sort by Year of First Published"
                checked={sortByYear}
                onChange={handleSortToggle}
                    />
                </Form>
                </Col>
                </Row>
                {books.length > 0 && (
                    <>

                        {/* @ts-ignore */}
        <Row className="mt-4">
                            {/* @ts-ignore */}

          <Col>
                          {/* @ts-ignore */}

            <ListGroup>
                                {/* @ts-ignore */}

              {books.map((book, index) => (
                <>
                                                {/* @ts-ignore */}

                <ListGroup.Item key={index}>
                  <h5>{book.title}</h5>
                  {/* <p><strong>Authors:</strong> {book.author_name.join(', ')|| 'Unknown'}</p> */}
                  <p><strong>First Published Year:</strong> {book.first_publish_year || 'Unknown'}</p>
                  {book.isbn.length > 0 ? (
                    <p><strong>ISBN:</strong> {book.isbn.join(', ')}</p>
                  ) : (
                    <p><strong>ISBN:</strong> Not available</p>
                  )}
                  <p><strong>Number of Pages:</strong> {book.number_of_pages_median || 'Unknown'}</p>

                </ListGroup.Item>
                </>))}
            </ListGroup>
          </Col>
        </Row>
        </>
      )}

            </Container>
            </>

        );
}
export default BookFind;