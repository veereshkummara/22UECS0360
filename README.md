# URL Shortener Microservice and React Frontend

## Overview

This project implements a full stack URL Shortener microservice with a React frontend. It allows users to shorten long URLs, specify optional validity periods and custom shortcodes, and view statistics for shortened URLs.

---

## Backend

- Node.js Express microservice running on port 5000
- API Endpoints:
  - `POST /shorturls` - Create a short URL
  - `GET /shorturls/:shortcode` - Retrieve statistics for a short URL
  - `GET /:shortcode` - Redirect to original URL
- Custom logging middleware logs requests to `logs.txt`
- URL storage and click tracking in-memory

---

## Frontend

- React app using Material UI running on `http://localhost:3000`
- Pages:
  - URL Shortener page: Shorten up to 5 URLs concurrently with validation
  - Statistics page: View all shortened URLs created in session with click details
- Saves shortened URLs to `sessionStorage` for persistence during session

---

## How to Run

### Backend

1. Navigate to backend directory:
   ```
   cd url-shortner/backend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the backend server:
   ```
   node app.js
   ```
4. Backend runs on `http://localhost:5000`

### Frontend

1. Navigate to frontend directory:
   ```
   cd url-shortner/frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the frontend development server:
   ```
   npm start
   ```
4. Open browser at `http://localhost:3000`

---

## Sample Output Screenshots

### URL Shortener Page

![URL Shortener Page](./screenshots/url_shortener_page.png)


### URL Statistics Page

![URL Statistics Page](./screenshots/url_statistics_page.png)

---

## How to Push to GitHub

1. Initialize git repository (if not already):
   ```
   git init
   ```
2. Add all files:
   ```
   git add .
   ```
3. Commit changes:
   ```
   git commit -m "Initial commit - URL Shortener microservice and frontend"
   ```
4. Create a new repository on GitHub (via website).

5. Add remote origin (replace `<your-repo-url>` with your GitHub repo URL):
   ```
   git remote add origin <your-repo-url>
   ```
6. Push to GitHub:
   ```
   git push -u origin master
   ```

---

## Notes

- Ensure backend is running before using frontend.
- Use unique custom shortcodes to avoid conflicts.
- Clear browser cache or use incognito if frontend shows stale content.

---

## License

This project is for evaluation purposes only.
