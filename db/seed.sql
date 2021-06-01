USE employees_example_db;

-- Departments Table
INSERT INTO departments (name) VALUES ('Engineering');
INSERT INTO departments (name) VALUES ('Sale');
INSERT INTO departments (name) VALUES ('Finance');
INSERT INTO departments (name) VALUES ('Legal');

-- Roles Table
INSERT INTO roles (title, salary, department_id) VALUES ('Sales Lead', 100000, 2);
INSERT INTO roles (title, salary, department_id) VALUES ('Saleperson', 80000, 2);
INSERT INTO roles (title, salary, department_id) VALUES ('Lead Engineer', 150000, 1);
INSERT INTO roles (title, salary, department_id) VALUES ('Software Engineer', 120000, 1);
INSERT INTO roles (title, salary, department_id) VALUES ('Accountant', 125000, 3);
INSERT INTO roles (title, salary, department_id) VALUES ('Legal Team Lead', 250000, 4);
INSERT INTO roles (title, salary, department_id) VALUES ('Lawyer', 190000, 4);

-- Employees Table
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('John', 'Doe', 1, 3);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Mike', 'Chan', 2, 1);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Ashley', 'Rodriguez', 3, null);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Kevin', 'Tupik', 4, 3);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Malia', 'Brown', 5, null);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Sarah', 'Lourd', 6, null);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Tom', 'Allen', 7, 6);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Christian', 'Eckenrode', 3, 2);
