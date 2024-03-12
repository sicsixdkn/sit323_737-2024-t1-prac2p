// Require the Express and path modules for creating an Express application and working files respectively
const express = require('express');
const path = require('path');

// Initialize a new Express application
const app = express();
// Define the port number on which the server will listen
const port = 3000;

// Serve static files files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Start the server and listen for connections on the specified port
app.listen(port, () => {
    // This callback function is executed once the server successfully starts which logs a message to the console
    // indicating that the server is running and listening for requests on the specified port
    console.log(`Server running on http://127.0.0.1:${port}/`);
});
