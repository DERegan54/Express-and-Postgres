// Routes for companies

const express = require("express");
const ExpressError = require('../expressError')
const db = require("../db");
const slugify = require('slugify');

let router = new express.Router();


// Gets a list of all companies
router.get('/', async (req, res, next) => {
    try {
        const result = await db.query(`SELECT * FROM companies`);
        return res.json({'companies': result.rows});
    } catch(err) {
        return next(err);
    }
});


// Gets a single company via the company's code
router.get('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const compResult = await db.query('SELECT code, name, description FROM companies WHERE code = $1', [code])
        const invResult = await db.query(`SELECT id FROM invoices WHERE comp_code=$1`, [code]);
        const indResult = await db.query(`SELECT code FROM companies_industries WHERE comp_code=$1`, [code])
        if(cResult.rows.length === 0) {
            throw new ExpressError(`Can't find company with code of ${code}`, 404)
        }
        const company = compResult.rows[0];
        const invoices = invResult.rows;
        const industries = indResult.rows;
        company.invoices = invoices.map(inv => invResult.id);
        company.industries = industries.map(ind => indResult.code);
        return res.json({'company': company});
    } catch(err) {
            return next(err);
    }
});


// Creates a new company
router.post('/', async (req, res, next) => {
    try {
        const { name, description } = req.body;
        let code = slugify(name, {lower:true});

        const result = await db.query('INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description', [code, name, description]);
        return res.status(201).json({'company': result.rows[0]});
    } catch (err) {
        return next(err);
    }
}) 


// Updates an existing company
router.patch('/:code', async (req, res, next) => {
    try {
        const { name, description } = req.body;
        let { code } = req.params;
        const result = await db.query('UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description', [name, description, code]);
        if(result.rows.length === 0){
            throw new ExpressError(`Can't find company with code of ${code}`,404)
        }
        return res.send({'company': result.rows[0]})
    } catch(err) {
        return next(err);
    }
});


// Deletes a single company
router.delete('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const result = await db.query(`DELETE FROM companies WHERE code=$1 RETURNING code`, [code])
        if(result.rows.length === 0) {
            throw new ExpressError(`Can't find company with code of ${code}`, 404)
        }
        return res.send({message: 'DELETED!'})
    } catch (err) {
        return next(err)
    }
});

module.exports = router;