const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Connection to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'bananasplit',
      database: 'employee_db'
    },
    console.log(`Connected to the movies_db database.`)
  );

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database.');
    startApp();
  });