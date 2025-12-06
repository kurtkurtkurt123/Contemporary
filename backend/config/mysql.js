// backend/db.js
const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",          // default XAMPP
  password: "",          // default XAMPP
  database: "elms_db" // palitan mo sa database mo
}).promise();

module.exports = db;
