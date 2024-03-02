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
      })}

//view table items
function viewDepartments() {
    connection.query('SELECT * FROM department', (err, res) => {
      if (err) throw err;
      console.table(res);
      startApp();
    });
  }
  
  function viewRoles() {
    connection.query(
      'SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id',
      (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
      }
    );
  }
  
  function viewEmployees() {
    connection.query(
      `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
      FROM employee
      LEFT JOIN role ON employee.role_id = role.id
      LEFT JOIN department ON role.department_id = department.id
      LEFT JOIN employee manager ON employee.manager_id = manager.id`,
      (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
      }
    );
  }

  function addRole() {
    connection.query('SELECT * FROM department', (err, departments) => {
      if (err) throw err;
  
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
        ])}

        function addEmployee() {
            connection.query('SELECT * FROM role', (err, roles) => {
              if (err) throw err;
          
              connection.query(
                'SELECT * FROM employee WHERE manager_id IS NULL',
                (err, managers) => {
                  if (err) throw err;
          
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
                    ])}