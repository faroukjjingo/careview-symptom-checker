import React from 'react';
import { Container } from '@material-ui/core';
import Checker from './components/Checker';
import './App.css';

function App() {
  return (
    <Container className="app-container">
      <Checker />
    </Container>
  );
}

export default App;