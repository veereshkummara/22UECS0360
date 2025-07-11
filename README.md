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
<img width="1897" height="894" alt="image" src="https://github.com/user-attachments/assets/0ecf812e-5590-45d3-bc2a-86d227c8dc15" />



### URL Statistics Page
<img width="487" height="804" alt="image" src="https://github.com/user-attachments/assets/9fbb43c5-23a8-46dd-a73d-d2a5bc7ba795" />


---

## License

This project is for evaluation purposes only.
