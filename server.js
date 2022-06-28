const express = require('express');
const mysql = require('mysql2');
const inputCheck = require('./utils/inputCheck');
const PORT = process.env.PORT || 3001;

const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// connect to the MySQL database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // Your MySQL username,
        user: 'root',
        // Your MySQL password
        password: '',
        database: 'election'
    },
    console.log('Connected to the election database.')
);

// API ROUTES (endpoints)

// TEST CONNECTION
// app.get('/', (req, res) => {
//     res.json({
//         message: 'Hello World'
//     });
// });

// return all data in the candidates table
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT * FROM candidates`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        // execute the callbakc with all the resulting rows that match the query
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// GET a single candidate
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT * FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'sucess',
            data: row
        })
    })
})

// DELETE a candidate
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.statusMessage(400).json({ error: res.message });
        } else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found.'
            });
        } else {
            res.json({
                message: 'Deleted.',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

// CREATE/POST a candidate
// object req.body will be used to populate the canddiate's data
app.post('/api/candidate', ({ body }, res) => {
    // check for errors with required module inputCheck
    const errors = inputCheck(body, 'first_name' , 'last_name' , 'industry_connected');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    // make the database call if no errors
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
        VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
        }
        res.json({
            message: 'success',
            data: body
        });
    });
    //MySQL autogenerates the id
});

// Default response for any reuqests that are Not Found
app.use((req, res) => {
    res.status(404).end();
});

//listen for port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});