import React, { useEffect, useState } from "react";
import {
  Col,
  Container,
  Form,
  FormCheck,
  FormControl,
  ListGroup,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import debounce from "debounce";
import axios from "axios";
import { Book } from "../../types/Book";
import BookTable from "../BookTable/BookTable";
import ScrollToTopButton from "../ScrollToTop/ScrollToTop";
import "./BookFind.css";

const BookFind = (): React.ReactElement => {
  const [query, setQuery] = React.useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [initialData, setInitialData] = useState<Book[]>([]);
  const [sortedBooks, setSortedBooks] = useState<Book[]>([]);
  const [sortByYear, setSortByYear] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);

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
      setIsLoading(true); 
      console.log(searchTerm);
      const formattedSearchTerm = searchTerm.replace(/\s/g, "+");
      console.log(formattedSearchTerm);

      const response = await axios.get(
        `https://openlibrary.org/search.json?q=${formattedSearchTerm}&fields=key,first_publish_year,author_name,title,number_of_pages_median,isbn`
      );
      const data = response.data;
      const booksData: Book[] = data.docs.map((doc: any) => ({
        title: doc.title || "Unknown",
        author_name: doc.author_name || "Unknown",
        first_publish_year: doc.first_publish_year || "Unknown",
        isbn: doc.isbn || [],
        number_of_pages_median: doc.number_of_pages_median || "Unknown",
      }));
      if (booksData.length === 0) {
        setNoResults(true);
        setIsLoading(false); 
      } else {
        setInitialData(booksData);
        sortBooksByYearDescending(booksData);
        setIsLoading(false);
      }

    } catch (error) {
      console.error("Error fetching books:", error);
      setIsLoading(false); 
    }
  };

  const sortBooksByYearDescending = (booksData: Book[]) => {
    const sortedBooks = [...booksData].sort((a, b) => {
      return b.first_publish_year - a.first_publish_year;
    });

    setSortedBooks(sortedBooks); 
    setBooks(sortedBooks); 
  };

  const handleSortToggle = () => {
    setSortByYear((prevSortByYear) => !prevSortByYear);
  };

  const handleTyping = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
     if (event.currentTarget.value === "") {
      console.log("empty");
      setBooks([]);
      setInitialData([]);
      setSortedBooks([]);
      setNoResults(false);
    }
    setQuery(searchTerm);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
   
    if (event.key === "Enter") {
      event.preventDefault();
      const searchTerm = event.currentTarget.value;
      setQuery(searchTerm);
    }
  };

  return (
    <div className="bg-light-purple" style={{ minHeight: "100vh" }}>
      <Row className="justify-content-center custom-heading-container mt-5">
        <Col md={8}>
          <h1 className="custom-heading text-center mb-4 mt-4">Book Finder</h1>

          <Form className="mb-2">
            <FormControl
              type="text"
              placeholder="Search for Books"
              value={query}
              onChange={handleTyping}
              onKeyPress={handleKeyPress}
              className="search-input mb-2"
            ></FormControl>
          </Form>
          <div className="d-flex justify-content-end align-items-center mb-2">
            <div className="fw-bold me-3">Sort by Year of First Published</div>

            <FormCheck
              type="switch"
              id="sort-toggle"
              checked={sortByYear}
              onChange={handleSortToggle}
              className="form-switch-lg"
            />
          </div>
        </Col>
      </Row>
      {isLoading ? (
        <>
          <Row className="justify-content-center mt-4">
            <Spinner
              animation="border"
              role="status"
              variant="dark"
              style={{ width: "5rem", height: "5rem" }}
              className="thick-spinner"
            >
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Row>
        </>
      ) : noResults ? (
        <>
          <Row className="justify-content-center mt-4">
            <Col md={8} className="text-center">
              <h3>No books found. Please try a different search term.</h3>
            </Col>
          </Row>
        </>
      ) : 
        books.length > 0 ? (
          <>
            <Container fluid>
              <Row className="mt-4">
                <Col>
                  <BookTable books={books} />
                </Col>
              </Row>
            </Container>
          </>
        )
       : (
        <div className="text-center mt-4 background-text"
        >
          Discover Your Next Great Read
        </div>
      )}
      <ScrollToTopButton />
    </div>
  );
};
export default BookFind;
