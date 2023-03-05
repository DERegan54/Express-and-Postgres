// Routes for industries

const express = require('express');
const ExpressError = require('../expressError')
const db = require("../db");
let router = new express.Router();

// Gets a list of all industries
router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(
            `SELECT code, industry FROM industries`);
        return res.json(results.rows);
    } catch (err) {
        return next(err);
    }
});

// Adds a new industry
router.post('/', async (req, res, next) => {
    try {
        let { code, industry } = req.body;
        const result = await db.query('INSERT INTO industries (code, comp_code) VALUES ($1, $2) RETURNING code, industry', [code, industry])
        return res.status(201).send({"industry": result.rows[0]});
    } catch (err) {
        return next (err);
    }
});

module.exports = router;