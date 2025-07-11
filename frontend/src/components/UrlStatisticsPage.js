import React, { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  IconButton
} from '@mui/material';
import axios from 'axios';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function Row({ shortcode, originalUrl, createdAt, expiry }) {
  const [open, setOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/shorturls/${shortcode}`);
      setStats(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Error fetching stats');
    }
  };

  const handleToggle = () => {
    if (!open) {
      fetchStats();
    }
    setOpen(!open);
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={handleToggle}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <a href={stats?.originalUrl || originalUrl} target="_blank" rel="noopener noreferrer">
            {shortcode}
          </a>
        </TableCell>
        <TableCell>{new Date(createdAt).toLocaleString()}</TableCell>
        <TableCell>{new Date(expiry).toLocaleString()}</TableCell>
        <TableCell>{stats ? stats.totalClicks : '-'}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={5} style={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              {error && <Typography color="error">{error}</Typography>}
              {stats && stats.clicks.length === 0 && (
                <Typography>No clicks recorded yet.</Typography>
              )}
              {stats && stats.clicks.length > 0 && (
                <Table size="small" aria-label="clicks">
                  <TableHead>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Referrer</TableCell>
                      <TableCell>Location</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.clicks.map((click, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{new Date(click.timestamp).toLocaleString()}</TableCell>
                        <TableCell>{click.referrer || '-'}</TableCell>
                        <TableCell>{click.location || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function UrlStatisticsPage() {
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    // Load URLs from sessionStorage
    const stored = sessionStorage.getItem('shortenedUrls');
    if (stored) {
      setUrls(JSON.parse(stored));
    }
  }, []);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        URL Shortener Statistics
      </Typography>
      {urls.length === 0 ? (
        <Typography>No shortened URLs found in this session.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Shortcode</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Expiry</TableCell>
                <TableCell>Total Clicks</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {urls.map((url, idx) => (
                <Row
                  key={idx}
                  shortcode={url.shortLink.split('/').pop()}
                  originalUrl={url.originalUrl}
                  createdAt={url.createdAt}
                  expiry={url.expiry}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
