const express = require('express');
const bodyParser = require('body-parser');
const validUrl = require('valid-url');
const cors = require('cors');
const loggingMiddleware = require('./logger');
const urlStore = require('./urlStore');

const app = express();
const PORT = 5000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json());
app.use(loggingMiddleware);

// POST /shorturls - create short URL
app.post('/shorturls', (req, res) => {
  const { url, validity, shortcode } = req.body;

  if (!url || !validUrl.isUri(url)) {
    return res.status(400).json({ error: 'Invalid or missing URL' });
  }

  let validityMinutes = 30;
  if (validity !== undefined) {
    if (!Number.isInteger(validity) || validity <= 0) {
      return res.status(400).json({ error: 'Validity must be a positive integer' });
    }
    validityMinutes = validity;
  }

  try {
    const { shortcode: code, expiry } = urlStore.addUrl(url, validityMinutes, shortcode);
    const shortLink = `http://localhost:${PORT}/${code}`;
    return res.status(201).json({ shortLink, expiry: expiry.toISOString() });
  } catch (err) {
    return res.status(409).json({ error: err.message });
  }
});

// GET /shorturls/:shortcode - get stats
app.get('/shorturls/:shortcode', (req, res) => {
  const { shortcode } = req.params;
  const stats = urlStore.getStats(shortcode);
  if (!stats) {
    return res.status(404).json({ error: 'Shortcode not found' });
  }
  return res.json({
    originalUrl: stats.originalUrl,
    createdAt: stats.createdAt.toISOString(),
    expiry: stats.expiry.toISOString(),
    totalClicks: stats.totalClicks,
    clicks: stats.clicks
  });
});

// GET /:shortcode - redirect
app.get('/:shortcode', (req, res) => {
  const { shortcode } = req.params;
  const urlEntry = urlStore.getUrl(shortcode);
  if (!urlEntry) {
    return res.status(404).send('Shortcode not found');
  }
  if (new Date() > urlEntry.expiry) {
    return res.status(410).send('Short link expired');
  }
  // Log click
  const referrer = req.get('referer') || '';
  const ip = req.ip;
  urlStore.addClick(shortcode, referrer, ip);
  return res.redirect(urlEntry.originalUrl);
});

app.listen(PORT, () => {
  console.log(`URL Shortener backend running on port ${PORT}`);
});
