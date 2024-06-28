import { Table } from "react-bootstrap";
import { Book } from "../../types/Book";
import React from "react";

interface Props {
    books: Book[];
  }

const BookTable : React.FC<Props> = ({ books }) => {
    return(
        <>
            <Table striped bordered hover responsive variant="light" className="mt-4 custom-table">
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
                    <td>{Array.isArray(book.author_name) ? book.author_name.join(', ') : 'Unknown Author'}</td>
                    <td>{book.first_publish_year}</td>
                    <td>{book.isbn ? book.isbn.join(', ') : 'No ISBN'}</td>
                    <td>{book.number_of_pages_median}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
        </>
    )
};

export default BookTable;