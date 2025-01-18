require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,        // Replace with your MySQL host
    user: process.env.DB_USER,        // Replace with your MySQL username
    password: process.env.DB_PASSWORD,        // Replace with your MySQL password
    database: process.env.DB_NAME   // Replace with your database name
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Routes

// Get all users
app.get('/users', (req, res) => {
    const query = 'SELECT * FROM users';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Database error');
        } else {
            res.json(results);
        }
    });
});

// Get a single user by ID
app.get('/users/:id', (req, res) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Database error');
        } else if (results.length === 0) {
            res.status(404).send('User not found');
        } else {
            res.json(results[0]);
        }
    });
});

// Add a new user
app.post('/users', (req, res) => {
    const query = 'INSERT INTO users (id, name) VALUES (?, ?)';
    const { id, name } = req.body;
    db.query(query, [id, name], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Database error');
        } else {
            res.status(201).json({ id: results.insertId, name, email, age });
        }
    });
});

// Update a user
app.put('/users/:id', (req, res) => {
    const query = 'UPDATE users SET name = ? WHERE id = ?';
    const { name } = req.body;
    db.query(query, [name, req.params.id], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Database error');
        } else if (results.affectedRows === 0) {
            res.status(404).send('User not found');
        } else {
            res.json({ id: req.params.id, name, email, age });
        }
    });
});

// Delete a user
app.delete('/users/:id', (req, res) => {
    const query = 'DELETE FROM users WHERE id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Database error');
        } else if (results.affectedRows === 0) {
            res.status(404).send('User not found');
        } else {
            res.status(204).send(); // No content
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
