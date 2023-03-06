/** BizTime express application. */
const express = require("express");
const ExpressError = require("./expressError")
const compRoutes = require("./routes/companies");
const invRoutes = require("./routes/invoices");
const indRoutes = require("./routes/industries");
// const compIndRoutes = require("./routes/companies_industries");
const app = express();

// Parse request bodies for JSON
app.use(express.json());


app.use("/companies", compRoutes);
app.use("/invoices", invRoutes);
app.use ("/industries", indRoutes);
// app.use("/companies_industries", compIndRoutes);

/** 404 handler */

app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});

app.listen(3000, function () {
  console.log("Listening on 3000");
});

module.exports = app;
