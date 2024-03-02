USE company_db;

/* departments */
INSERT INTO department (name)
VALUES ('Sales'),
       ('Engineering'),
       ('Finance'),
       ('Legal');

/* roles */
INSERT INTO role (title, salary, department_id) 
VALUES ('Salesperson', 80000, 1),
       ('Lead Engineer', 150000, 2),
       ('Software Engineer', 120000, 2),
       ('Account Manager', 160000, 3),
       ('Accountant', 125000, 3),
       ('Legal Team Lead', 250000, 4),
       ('Lawyer', 190000, 4);

/* employees */
INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ('John', 'Doe', 1, NULL),
       ('Mike', 'Chan', 1, 1),
       ('Ashley', 'Rodriguez', 2, NULL),
       ('Kevin', 'Tupik', 3, 3),
       ('Kunal', 'Singh', 4, NULL),
       ('Malia', 'Brown', 5, 5),
       ('Sarah', 'Lourd', 6, NULL),
       ('Tom', 'Allen', 7, 7);
