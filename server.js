const express = require('express');
const path = require('path');

const app = express();
const port = 3000; // You can use a different port if needed

// Serve static files (e.g., your HTML, CSS, JS files)
app.use(express.static(path.join(__dirname, 'pop')));  // Adjust if necessary

// Route for the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pop', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});