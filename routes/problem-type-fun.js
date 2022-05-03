const express = require("express");
const router = express.Router();

var conn = require("../dbconfig");

var getAllProblemTypes = function() {
  return new Promise((resolve, reject) => {
    conn.query("SELECT * FROM problem_types", (err, results) => {
      if (err) throw err;
      return resolve(results);
    })
  });
};

module.exports = {getAllProblemTypes};
