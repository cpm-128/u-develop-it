const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// return all data in the candidates table + party_name
router.get('/candidates', (req, res) => {
    const sql = `SELECT candidates.*, parties.name
                AS party_name
                FROM candidates
                LEFT JOIN parties
                ON candidates.party_id = parties.id`;

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
router.get('/candidate/:id', (req, res) => {
    const sql = `SELECT candidates.*, parties.name
                AS party_name
                FROM candidates
                LEFT JOIN parties
                ON candidates.party_id = parties.id
                WHERE candidates.id = ?`;
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
router.delete('/candidate/:id', (req, res) => {
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
router.post('/candidate', ({ body }, res) => {
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

// UPDATE a candidate's party
// the affected row's id should always be part of the route
router.put('/candidate/:id', (req, res) => {
    const errors = inputCheck(req.body, 'party_id');
        if (errors) {
            res.status(400).json({ error: errors });
            return;
        }
    const sql = `UPDATE candidates SET party_id =?
                WHERE id = ?`;
    const params = [req.body.party_id, req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            // check if a record was found
        } else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found.'
            });
        } else {
            res.json({
                message: 'success',
                data: req.body,
                changes: result.affectedRows
            });
        }
    });
});

// export router object
module.exports = router;