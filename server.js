const express = require('express');
const mysql = require('mysql2');
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

// // return all data in the candidates table
// db.query(`SELECT * FROM candidates`, (err, rows) => {
//     console.log(rows);
//     // execute the callbakc with all the resulting rows that match the query
// });

// // GET a single candidate
// db.query(`SELECT * FROM candidates WHERE id = 11`, (err, row) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(row);
// });

// // DELETE a candidate
// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result);
// });

// // CREATE a candidate
// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
//             VALUES (?, ?, ?, ?)`;
// const params = [1, 'Ronald', 'Firbank', 1];

// db.query(sql, params, (err, result) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result);
// });

// Default response for any reuqests that are Not Found
app.use((req, res) => {
    res.status(404).end();
});

//listen for port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});