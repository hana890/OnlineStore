const db = require('./config');
const mysql = require("mysql");
const pool = mysql.createPool(db);
module.exports = mysql.createPool(db);