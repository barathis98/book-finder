import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import BookFind from './components/BookFind/BookFind';

function App() {
  return (
    <div className="App">
        <BookFind />
    </div>
  );
}

export default App;
