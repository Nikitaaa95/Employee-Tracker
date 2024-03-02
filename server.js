const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');

const app = express();
const PORT = 3001;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'bananasplit',
  database: 'company_db',
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startApp();
});


async function startApp() {
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
    .then((answer) => {
      switch (answer.action) {
        case 'View all departments':
          viewDepartments(db);
          break;
        case 'View all roles':
          viewRoles(db);
          break;
        case 'View all employees':
          viewEmployees(db);
          break;
        case 'Add a department':
          addDepartment(db);
          break;
        case 'Add a role':
          addRole(db);
          break;
        case 'Add an employee':
          addEmployee(db);
          break;
        case 'Update an employee role':
          updateEmployeeRole(db);
          break;
        case 'Exit':
          db.end();
          break;
      }
    });
}

// Ability to view tables
function viewDepartments(db) {
  db.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    console.table(res);
    startApp();
  });
}

function viewRoles(db) {
  db.query(
    'SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id',
    (err, res) => {
      if (err) throw err;
      console.table(res);
      startApp();
    }
  );
}

function viewEmployees(db) {
  db.query(
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

function addDepartment(db) {
  inquirer
    .prompt({
      name: 'name',
      type: 'input',
      message: 'Enter the name of the department:',
    })
    .then((answer) => {
      db.query(
        'INSERT INTO department SET ?',
        {
          name: answer.name,
        },
        (err) => {
          if (err) throw err;
          console.log('Department added successfully!');
          startApp();
        }
      );
    });
}

//inquire for adding new roles to the company
function addRole(db) {
  db.query('SELECT * FROM department', (err, departments) => {
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
      ])
      .then((answer) => {
        const department = departments.find(
          (department) => department.name === answer.department
        );

        db.query(
          'INSERT INTO role SET ?',
          {
            title: answer.title,
            salary: answer.salary,
            department_id: department.id,
          },
          (err) => {
            if (err) throw err;
            console.log('Role added successfully!');
            startApp();
          }
        );
      });
  });
}

//inquire for adding new employees to the company
function addEmployee(db) {
  db.query('SELECT * FROM role', (err, roles) => {
    if (err) throw err;

    db.query(
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
          ])
          .then((answer) => {
            const role = roles.find((role) => role.title === answer.role);
            const manager = managers.find(
              (manager) =>
                `${manager.first_name} ${manager.last_name}` === answer.manager
            );

            db.query(
              'INSERT INTO employee SET ?',
              {
                first_name: answer.first_name,
                last_name: answer.last_name,
                role_id: role.id,
                manager_id: manager.id,
              },
              (err) => {
                if (err) throw err;
                console.log('Employee added successfully!');
                startApp();
              }
            );
          });
      }
    );
  });
}

//inquire for update roles for an existing client
function updateEmployeeRole(db) {
    db.query('SELECT * FROM employee', (err, employees) => {
      if (err) throw err;
  
      db.query('SELECT * FROM role', (err, roles) => {
        if (err) throw err;
  
        inquirer
          .prompt([
            {
              name: 'employee',
              type: 'list',
              message: 'Select the employee to update:',
              choices: employees.map(
                (employee) => `${employee.first_name} ${employee.last_name}`
              ),
            },
            {
              name: 'role',
              type: 'list',
              message: 'Select the new role for this employee:',
              choices: roles.map((role) => role.title),
            },
          ])
          .then((answer) => {
            const employee = employees.find(
              (employee) =>
                `${employee.first_name} ${employee.last_name}` === answer.employee
            );
            const role = roles.find((role) => role.title === answer.role);
  
            db.query(
              'UPDATE employee SET role_id = ? WHERE id = ?',
              [role.id, employee.id],
              (err) => {
                if (err) throw err;
                console.log('Employee role updated successfully!');
                startApp();
              }
            );
          });
      });
    });
  }
  