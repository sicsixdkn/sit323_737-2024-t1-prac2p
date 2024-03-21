// Require the Express module for creating an Express application
const express = require("express");

// Initialize a new Express application, and define the port number the server will listen on
const app  = express();
const port = 3000;

// Functions to performs maths operations
const add      = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide   = (a, b) => a / b;

const do_maths = (req, res, maths_function) => {
    // Parse the query parameters to floats
    const n1 = parseFloat(req.query.n1);
    const n2 = parseFloat(req.query.n2);

    // If they did not parse return an error
    if (isNaN(n1) || isNaN(n2))
        return res.status(400).json({error: "Invalid query parameters. Please ensure n1 and n2 are numbers."});

    // Call the provided maths function and store the results
    const result = maths_function(n1, n2);

    // Return success with the result
    return res.status(200).json({result});
};

// API endpoints
app.get("/add", (req, res) => do_maths(req, res, add));
app.get("/subtract", (req, res) => do_maths(req, res, subtract));
app.get("/multiply", (req, res) => do_maths(req, res, multiply));
app.get("/divide", (req, res) => do_maths(req, res, divide));

// Start the server and listen for connections on the specified port
app.listen(port, () => {
    // This callback function is executed once the server successfully starts which logs a message to the console
    // indicating that the server is running and listening for requests on the specified port
    console.log(`Server running on http://127.0.0.1:${port}/`);
});