const express = require("express");
const app  = express();
const port = 3000;

// Functions to performs maths operations
const add      = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide   = (a, b) => a / b;
const exponent = (a, b) => a ** b;
const modulus  = (a, b) => a % b;
const sqrt     = (a) => Math.sqrt(a);
const abs      = (a) => Math.abs(a);
const log      = (a) => Math.log(a);
const log10    = (a) => Math.log10(a);
const sin      = (a) => Math.sin(a);
const cos      = (a) => Math.cos(a);
const tan      = (a) => Math.tan(a);

const do_maths = (req, res, maths_function) => {
    let result;
    // Parse the parameters as in 4.1P but differently depending on if there are 1, 2, or neither
    if (maths_function.length === 1) {
        const n1 = parseFloat(req.query.n1);
        if (isNaN(n1))
            return res.status(400).json({error: "Invalid query parameters. Please ensure n1 is a valid number."});
        result = maths_function(n1);
    } else if (maths_function.length === 2) {
        const n1 = parseFloat(req.query.n1);
        const n2 = parseFloat(req.query.n2);
        if (isNaN(n1) || isNaN(n2))
            return res.status(400).json({error: "Invalid query parameters. Please ensure n1 and n2 are numbers."});
        result = maths_function(n1, n2);
    } else
        return res.status(400).json({error: "Invalid operation."});
    // Return success with the result
    return res.status(200).json({result});
};

// API endpoints
app.get("/add", (req, res) => do_maths(req, res, add));
app.get("/subtract", (req, res) => do_maths(req, res, subtract));
app.get("/multiply", (req, res) => do_maths(req, res, multiply));
app.get("/divide", (req, res) => do_maths(req, res, divide));
app.get("/exponent", (req, res) => do_maths(req, res, exponent));
app.get("/modulus", (req, res) => do_maths(req, res, modulus));
app.get("/sqrt", (req, res) => do_maths(req, res, sqrt));
app.get("/abs", (req, res) => do_maths(req, res, abs));
app.get("/log", (req, res) => do_maths(req, res, log));
app.get("/log10", (req, res) => do_maths(req, res, log10));
app.get("/sin", (req, res) => do_maths(req, res, sin));
app.get("/cos", (req, res) => do_maths(req, res, cos));
app.get("/tan", (req, res) => do_maths(req, res, tan));

app.listen(port, () => {
    console.log(`Server running on http://127.0.0.1:${port}/`);
});