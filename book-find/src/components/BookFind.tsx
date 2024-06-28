import React,{ useEffect, useState } from 'react';
import { Col, Container, Form, FormCheck, FormControl, ListGroup, Row, Table } from 'react-bootstrap';
import debounce from 'debounce';
import axios from 'axios';
import { Book } from '../types/Book';


const BookFind = (): React.ReactElement =>{
    const [query, setQuery] = React.useState('');
    const [books, setBooks] = useState<Book[]>([]);
    const [initialData, setInitialData] = useState<Book[]>([]);
    const [sortedBooks, setSortedBooks] = useState<Book[]>([]);
    const [sortByYear,setSortByYear] = useState(false);

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
        //    console.log(initialData);
        } catch (error) {
          console.error('Error fetching books:', error);
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


            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Authors</th>
                  <th>First Published Year</th>
                  <th>ISBN</th>
                  <th>Number of Pages</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book, index) => (
                    // console.log(book),
                  <tr key={index}>
                    <td>{book.title}</td>
                    <td>{book.author_name ? book.author_name.join(', ') : 'Unknown Author'}</td>
                    <td>{book.first_publish_year}</td>
                    <td>{book.isbn ? book.isbn.join(', ') : 'No ISBN'}</td>
                    <td>{book.number_of_pages_median}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        </>
      )}

            </Container>
            </>

        );
}
export default BookFind;

