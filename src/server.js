// src/server.js
const http = require("http");
const app = require("./app"); // Import the app from app.js
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Set the port from environment variables, fallback to 5000 if not set
const PORT = process.env.PORT || 5000;

// Create an HTTP server and listen on the specified port
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
