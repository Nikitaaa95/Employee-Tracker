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

  //prompts
  function startApp() {
    inquirer
      .prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Exit',
        ],
      })
      inquirer
      .prompt([
        {
          name: 'title',
          type: 'input',
          message: 'Enter the title of the role:',
        },
        {
          name: 'salary',
          type: 'input',
          message: 'Enter the salary for this role:',
        },
        {
          name: 'department',
          type: 'list',
          message: 'Select the department for this role:',
          choices: departments.map((department) => department.name),
        },
      ])    
      inquirer
          .prompt([
            {
              name: 'first_name',
              type: 'input',
              message: 'Enter the first name of the employee:',
            },
            {
              name: 'last_name',
              type: 'input',
              message: 'Enter the last name of the employee:',
            },
            {
              name: 'role',
              type: 'list',
              message: 'Select the role for this employee:',
              choices: roles.map((role) => role.title),
            },
            {
              name: 'manager',
              type: 'list',
              message: 'Select the manager for this employee:',
              choices: managers.map((manager) => `${manager.first_name} ${manager.last_name}`),
            },
          ])
    }