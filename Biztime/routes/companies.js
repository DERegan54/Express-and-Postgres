// Routes for companies

const express = require("express");
const ExpressError = require('../expressError')
const db = require("../db");
let router = new express.Router();


// Gets a list of all companies
router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM companies`);
        return res.json({companies: results.rows});
    } catch(err) {
        return next(err);
    }
});


// Gets a single company via the company's code
router.get('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const results = await db.query('SELECT * FROM companies WHERE code = $1', [code])
        if(results.rows.length === 0) {
            throw new ExpressError(`Can't find company with code of ${code}`, 404)
        }
        return res.send({company: results.rows[0]})
    } catch(err) {
            return next(err);
    }
});


// Creates a new company
router.post('/', async (req, res, next) => {
    try {
        const { code, name, description } = req.body;
        const results = await db.query('INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING *', [code, name, description]);
        return res.status(201).json({company: results.rows[0]});
    } catch (err) {
        return next(err);
    }
}) 


// Updates an existing company
router.put('/:code', async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const { code } = req.params;
        const results = await db.query('UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description', [name, description, code])
        if(results.rows.length === 0){
            throw new ExpressError(`Can't find company with code of ${code}`,404)
        }
        return res.send({company: results.rows[0]})
    } catch(err) {
        return next(err);
    }
});


// Deletes a single company
router.delete('/:code', async (req, res, next) => {
    try {
        const results = db.query("DELETE FROM companies WHERE code=$1", [req.params.code])
        if(req.params.id === 'invalid') {
            throw new ExpressError(`Can't find company with code of ${code}`, 404)
        }
        return res.send({message: 'DELETED!'})
    } catch (err) {
        return next(err)
    }
});

module.exports = router;