import { Table } from "react-bootstrap";
import { Book } from "../../types/Book";
import React from "react";
import "./BookTable.css";

interface Props {
  books: Book[];
}

const BookTable: React.FC<Props> = ({ books }) => {
  return (
    <>
      <Table
        striped
        bordered
        hover
        responsive
        variant="light"
        className="mt-4 custom-table"
      >
        <thead>
          <tr>
            <th className="title-col">Title</th>
            <th className="authors-col">Authors</th>
            <th className="year-col">First Published Year</th>
            <th className="isbn-col">ISBN</th>
            <th className="pages-col">Number of Pages</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, index) => (
            <tr key={index}>
              <td className="title-col">{book.title}</td>
              <td className="authors-col">
                {Array.isArray(book.author_name)
                  ? book.author_name.join(", ")
                  : "Unknown Author"}
              </td>
              <td className="year-col">{book.first_publish_year}</td>
              <td className="isbn-col">
                {book.isbn ? book.isbn.join(", ") : "No ISBN"}
              </td>
              <td className="pages-col">{book.number_of_pages_median}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default BookTable;
