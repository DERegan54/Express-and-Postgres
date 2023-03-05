// Routes for companies_industries
const express = require("express");
const ExpressError = require('../expressError')
const db = require("../db");

let router = new express.Router();

// Associates a company with an industry
router.get('/', async (req, res, next) => {
    try {
        let result = await db.query(`SELECT c.code, i.code 
                                     FROM companies AS c 
                                        INNER JOIN industries as i ON (i.comp_code = c.code)
                                     WHERE company=c.code, industry=i.code`, [c.code, i.code])
        if(result.rows.length === 0){
            throw new ExpressError(`Can't find company with code of ${code}`, 404);
        }
        const resData = result.rows[0];
        const company = {
            "company": resData.c.code,
            "industry": resData.i.code
        };
        return res.send(company);
    } catch (err) {
        return next(err);
    }
})

module.exports = router;