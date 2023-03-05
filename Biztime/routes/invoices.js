// Routes for invoices

const express = require('express');
const ExpressError = require('../expressError')
const db = require("../db");
let router = new express.Router();


// Gets a list of all invoices
router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM invoices`);
        return res.json({'invoices': results.rows});
    } catch(err) {
        return next(err);
    }
});


// Gets a single invoice via id
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await db.query(`SELECT  i.id, i.comp_code, i.amt, i.add_date, i.paid_date, c.name, c.description
                                        FROM invoices AS i
                                            INNER JOIN companies AS c ON (i.comp_code = c.code)
                                        WHERE id=$1`, [id]);
    
        if(result.rows.length === 0) {
            throw new ExpressError(`Can't find invoice with id of ${id}`, 404);
        }
        const resData = result.rows[0];
        const invoice = {
            id: resData.id, 
            company: {
                code: resData.comp_code,
                name: resData.name,
                description: resData.description,
            },
            amt: resData.amt,
            paid: resData.paid, 
            add_date: resData.add_date,
            paid_date: resData.paid_date,
        };
        return res.send({"invoice": invoice}); 
    } catch(err) {
        return next(err);
    }
});


// Creates a new invoice
router.post('/', async (req, res, next) => {
    try {
        let {comp_code, amt} = req.body;
        const result = await db.query('INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING id, comp_code, amt, paid, add_date, paid_date',[comp_code, amt])
        return res.status(201).send({"invoice": result.rows[0]});
    } catch(err){
        return next(err);
    }
})


// Updates an existing invoice 
router.patch('/:id', async (req, res, next) => {
    try {
        let { amt, paid } = req.body;
        let { id } = req.params;
        let paidDate = null;
        let newResult = await db.query('SELECT paid FROM invoices WHERE id=$1', [id])
        if(newResult.rows.length === 0){
            throw new ExpressError(`Can't find invoice with id of ${id}`, 404)
        }
        let newPaidDate = newResult.rows[0].paid_date
        if(!newPaidDate && paid) {
            paidDate = new Date();
        } else if(!paid) {
            paidDate = null;
        } else {
            paidDate = newPaidDate;
        }
        let result = await db.query(
            `UPDATE invoices SET amt=$1, paid=$2, paid_date=$3 WHERE id=$4 RETURNING id, comp_code, amt, paid, add_date, paid_date`,
            [amt, paid, paidDate, id]);
        return res.json({"invoice": result.rows[0]});
    } catch(err) {
        return next(err);
    }
})


// Deletes a single invoice
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = db.query("DELETE FROM invoices WHERE id=$1", [id])
        if(!id) {
            throw new ExpressErrror(`Can't find invoice with id of ${id}`, 404)
        }
        return res.send({message: 'DELETED!'})
    } catch(err) {
        return next(err);
    }
});


module.exports = router;