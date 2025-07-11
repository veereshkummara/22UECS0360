import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Box,
  Alert
} from '@mui/material';
import axios from 'axios';

const MAX_URLS = 5;

const initialUrlState = { url: '', validity: '', shortcode: '', error: '' };

function isValidUrl(value) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function isValidShortcode(value) {
  return /^[a-zA-Z0-9_-]{4,10}$/.test(value);
}

export default function UrlShortenerPage() {
  const [urls, setUrls] = useState(Array(MAX_URLS).fill(initialUrlState));
  const [results, setResults] = useState([]);
  const [globalError, setGlobalError] = useState('');

  const handleChange = (index, field, value) => {
    const newUrls = [...urls];
    // Update only the specific field of the specific URL entry
    newUrls[index] = { ...newUrls[index], [field]: value, error: '' };
    setUrls(newUrls);
  };

  const validateInputs = () => {
    let valid = true;
    const newUrls = urls.map((entry) => {
      let error = '';
      if (!entry.url) {
        error = 'URL is required';
        valid = false;
      } else if (!isValidUrl(entry.url)) {
        error = 'Invalid URL format';
        valid = false;
      }
      if (entry.validity) {
        const val = Number(entry.validity);
        if (!Number.isInteger(val) || val <= 0) {
          error = 'Validity must be a positive integer';
          valid = false;
        }
      }
      if (entry.shortcode) {
        if (!isValidShortcode(entry.shortcode)) {
          error = 'Shortcode must be 4-10 alphanumeric characters, _ or -';
          valid = false;
        }
      }
      return { ...entry, error };
    });
    setUrls(newUrls);
    return valid;
  };

  const handleSubmit = async () => {
    setGlobalError('');
    setResults([]);
    if (!validateInputs()) {
      setGlobalError('Please fix errors before submitting.');
      return;
    }
    const promises = urls
      .filter((entry) => entry.url)
      .map((entry) =>
        axios.post('http://localhost:5000/shorturls', {
          url: entry.url,
          validity: entry.validity ? Number(entry.validity) : undefined,
          shortcode: entry.shortcode || undefined
        })
          .then((res) => ({
            originalUrl: entry.url,
            shortLink: res.data.shortLink,
            expiry: res.data.expiry,
            error: null
          }))
          .catch((err) => ({
            originalUrl: entry.url,
            shortLink: null,
            expiry: null,
            error: err.response?.data?.error || 'Error creating short URL'
          }))
      );
    const resResults = await Promise.all(promises);
    setResults(resResults);

    // Save successful shortened URLs to sessionStorage for statistics page
    const successfulUrls = resResults
      .filter(r => !r.error)
      .map(r => ({
        originalUrl: r.originalUrl,
        shortLink: r.shortLink,
        createdAt: new Date().toISOString(),
        expiry: r.expiry
      }));
    const stored = sessionStorage.getItem('shortenedUrls');
    const existing = stored ? JSON.parse(stored) : [];
    sessionStorage.setItem('shortenedUrls', JSON.stringify([...existing, ...successfulUrls]));
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        URL Shortener
      </Typography>
      {globalError && <Alert severity="error" sx={{ mb: 2 }}>{globalError}</Alert>}
      <Grid container spacing={2}>
        {urls.map((entry, index) => (
          <Grid item xs={12} key={index}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1">URL #{index + 1}</Typography>
              <TextField
                label="Original URL"
                fullWidth
                margin="normal"
                value={entry.url}
                onChange={(e) => handleChange(index, 'url', e.target.value)}
                error={!!entry.error && entry.error.includes('URL')}
                helperText={entry.error && entry.error.includes('URL') ? entry.error : ''}
              />
              <TextField
                label="Validity (minutes, optional)"
                fullWidth
                margin="normal"
                value={entry.validity}
                onChange={(e) => handleChange(index, 'validity', e.target.value)}
                error={!!entry.error && entry.error.includes('Validity')}
                helperText={entry.error && entry.error.includes('Validity') ? entry.error : ''}
              />
              <TextField
                label="Custom Shortcode (optional)"
                fullWidth
                margin="normal"
                value={entry.shortcode}
                onChange={(e) => handleChange(index, 'shortcode', e.target.value)}
                error={!!entry.error && entry.error.includes('Shortcode')}
                helperText={entry.error && entry.error.includes('Shortcode') ? entry.error : ''}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" onClick={handleSubmit}>
          Shorten URLs
        </Button>
      </Box>
      <Box sx={{ mt: 4 }}>
        {results.map((result, idx) => (
          <Paper key={idx} sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1">Original URL: {result.originalUrl}</Typography>
            {result.error ? (
              <Typography color="error">Error: {result.error}</Typography>
            ) : (
              <>
                <Typography>Short Link: <a href={result.shortLink} target="_blank" rel="noopener noreferrer">{result.shortLink}</a></Typography>
                <Typography>Expiry: {new Date(result.expiry).toLocaleString()}</Typography>
              </>
            )}
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
