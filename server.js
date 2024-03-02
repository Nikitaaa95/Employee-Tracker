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
      database: 'company_db'
    },
    console.log(`Connected to the company database.`)
  );

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database.');
  startApp();
});

// First inquire line to view table
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
    .then((answer) => {
      switch (answer.action) {
        case 'View all departments':
          viewDepartments();
          break;
        case 'View all roles':
          viewRoles();
          break;
        case 'View all employees':
          viewEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
        case 'Exit':
          connection.end();
          break;
      }
    });
}
// Ability to view tables
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

function addDepartment() {
  inquirer
    .prompt({
      name: 'name',
      type: 'input',
      message: 'Enter the name of the department:',
    })
    .then((answer) => {
      connection.query(
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
      ])
      .then((answer) => {
        const department = departments.find(
          (department) => department.name === answer.department
        );

        connection.query(
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
          ])
          .then((answer) => {
            const role = roles.find((role) => role.title === answer.role);
            const manager = managers.find(
              (manager) =>
                `${manager.first_name} ${manager.last_name}` === answer.manager
            );

            connection.query(
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

//inquire for update roles for an exixting client
function updateEmployeeRole() {
    connection.query('SELECT * FROM employee', (err, employees) => {
      if (err) throw err;
  
      connection.query('SELECT * FROM role', (err, roles) => {
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
  
            connection.query(
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
  