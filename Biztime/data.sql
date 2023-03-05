\c biztime

-----------------------------------------------------
-- Drop tables
-----------------------------------------------------

DROP TABLE IF EXISTS companies_industries;
DROP TABLE IF EXISTS industries;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS companies;

-----------------------------------------------------
-- Create tables
-----------------------------------------------------

CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    ind_code text REFERENCES industries (code),
    description text
);

CREATE TABLE industries (
    code text PRIMARY KEY,
    industry text NOT NULL UNIQUE
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies (code) ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

CREATE TABLE companies_industries (
    id serial PRIMARY KEY,
    comp_code text REFERENCES companies (code),
    ind_code text REFERENCES industries (code)
);


--------------------------------------------------------------
-- Add data
--------------------------------------------------------------

INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('spot', 'Spotify', 'Audio streaming servce'),
         ('ibm', 'IBM', 'Big blue.'),
         ('aws', 'AWS', 'Amazon web services'),
         ('amz', 'Amazon.com', 'Amazon retail'),
         ('net', 'Netflix', 'Video streaming service');    

INSERT INTO invoices (comp_code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null),
         ('aws', 1000, true, '2021-03-17'),
         ('spot', 9.99, false, null),
         ('amz', 350, true, '2023-02-27'),
         ('net', 2.99, true, '2022-09-05');

INSERT INTO industries (code, industry)
  VALUES ('electronics', 'Electronics Manuafacturing'),
         ('it', 'IT Services'),
         ('audio', 'Audio Streaming'),
         ('ecom', 'E-Commerce'),
         ('video', 'Video Streaming');

INSERT INTO companies_industries (comp_code, ind_code)
  VALUES ('apple', 'electronics'),
         ('ibm', 'electronics'),
         ('aws', 'it'),
         ('spot', 'audio'),
         ('amz', 'ecom'),
         ('net', 'video');