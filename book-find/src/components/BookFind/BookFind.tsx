import React,{ useEffect, useState } from 'react';
import { Col, Container, Form, FormCheck, FormControl, ListGroup, Row, Spinner, Table } from 'react-bootstrap';
import debounce from 'debounce';
import axios from 'axios';
import { Book } from '../../types/Book';
import BookTable from '../BookTable/BookTable';
import ScrollToTopButton from '../ScrollToTop/ScrollToTop';

const BookFind = (): React.ReactElement =>{
    const [query, setQuery] = React.useState('');
    const [books, setBooks] = useState<Book[]>([]);
    const [initialData, setInitialData] = useState<Book[]>([]);
    const [sortedBooks, setSortedBooks] = useState<Book[]>([]);
    const [sortByYear,setSortByYear] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
          if (query.trim()) { 
            fetchBooks(query);
          }
        }, 1000); 
    
        return () => clearTimeout(delayDebounceFn);
      }, [query]);

      useEffect(() => {
        if (sortByYear) {
          setBooks([...sortedBooks]);
        } else {
          setBooks([...initialData]);
        }
      }, [sortByYear, initialData, sortedBooks]);


    const fetchBooks = async (searchTerm: string) => {
        try {
            setIsLoading(true); // Start loading animation
            console.log(searchTerm);
            const formattedSearchTerm = searchTerm.replace(/\s/g, '+'); 
            console.log(formattedSearchTerm);

           const response = await axios.get(`https://openlibrary.org/search.json?q=${formattedSearchTerm}&fields=key,first_publish_year,author_name,title,number_of_pages_median,isbn`);
           const data = response.data;
        //    console.log(data);
          const booksData: Book[] = data.docs.map((doc: any) => ({
            title: doc.title || 'Unknown',
            author_name: doc.author_name || 'Unknown',
            first_publish_year: doc.first_publish_year || 'Unknown',
            isbn: doc.isbn || [],
            number_of_pages_median: doc.number_of_pages_median || 'Unknown',
          }));
           setInitialData(booksData);
           sortBooksByYearDescending(booksData);
           setIsLoading(false); // Stop loading animation

        //    console.log(initialData);
        } catch (error) {
          console.error('Error fetching books:', error);
          setIsLoading(false); // Stop loading animation on error

        }
      };

      const sortBooksByYearDescending = (booksData: Book[]) => {
        const sortedBooks = [...booksData].sort((a, b) => {
            return b.first_publish_year - a.first_publish_year;
        });
    
        setSortedBooks(sortedBooks); // Update sortedBooks state
        setBooks(sortedBooks); // Update books state with sortedBooks
    };
    


    const handleSortToggle = () => {
        setSortByYear((prevSortByYear) => !prevSortByYear);
      };

    const handleTyping = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = event.target.value;
        setQuery(searchTerm);
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault(); 
            const searchTerm = event.currentTarget.value;
            setQuery(searchTerm); 
        }
      };



        return(
            <div className="bg-light" style={{ minHeight: '100vh' }}>


            {/* @ts-ignore */}
            <Container d-flex flex-column justify-content-center align-items-center py-4>
                {/* @ts-ignore */}
                <Row className="justify-content-center mt-5">
                {/* @ts-ignore */}
                <Col md={8}>
                <h1 className="text-center mb-4">Book Finder</h1>

                {/* @ts-ignore */}
                <Form className='mb-2'>
                    {/* @ts-ignore */}
                    <FormControl 
                        type='text'
                        placeholder='Search for Books'
                        value={query}
                        onChange={handleTyping}
                        onKeyPress={handleKeyPress}
                        className="search-input mb-2">
                        

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
                {isLoading ? (
                    <>
                                            {/* @ts-ignore */}

        <Row className="justify-content-center mt-4">
                                    {/* @ts-ignore */}

          <Spinner  animation="border" role="status" variant='info' style={{ width: '5rem', height: '5rem' }} >
            <span className="visually-hidden">Loading...</span>
          </Spinner>

        </Row>
        </>
      ) :books.length > 0 && (
                    <>
                        {/* @ts-ignore */}
        <Row className="mt-4">
                            {/* @ts-ignore */}

          <Col>
                        <BookTable books={books} />
          </Col>
        </Row>
        </>
      )}
            <ScrollToTopButton/>
            </Container>
            </ div>

        );
}
export default BookFind;

