import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import UrlShortenerPage from './components/UrlShortenerPage';
import UrlStatisticsPage from './components/UrlStatisticsPage';

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            URL Shortener
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Shorten URLs
          </Button>
          <Button color="inherit" component={Link} to="/statistics">
            Statistics
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ marginTop: 4 }}>
        <Routes>
          <Route path="/" element={<UrlShortenerPage />} />
          <Route path="/statistics" element={<UrlStatisticsPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
