const mysql = require('mysql');
const inquirer = require('inquirer');
const { promisify } = require('util');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '', // add password to database
    database: 'employees_example_db',
});

connection.connect((error) => {
    if (error) throw error;

    init();
});

const query = promisify(connection.query.bind(connection));

const init = () => {
    askUser();
}

const actions = [
    'View All Employees',
    'View All Employees By Roles',
    'View All Employees By Departments',
    'Add Employee',
    'Add Role',
    'Add Department',
    'Update employee role',
    'Exit App',
];

const noEmployeesMessage = `No employees.\n`;

const askUser = async () => {
    const { action } = await inquirer.prompt({
        name: 'action',
        type: 'rawlist',
        message: `What would you like to do?`,
        choices: actions,
    });

    switch (action) {
        case actions[0]:
            showAllEmployees();
            break;

        case actions[1]:
            showEmployeesByRoles();
            break;

        case actions[2]:
            showEmployeesByDepartment();
            break;

        case actions[3]:
            addEmployee();
            break;

        case actions[4]:
            addRole();
            break;

        case actions[5]:
            addDepartment();
            break;

        case actions[6]:
            updateEmployeeRole();
            break;

        case actions[actions.length - 1]:
            exitApp();
            break;

        default:
            console.log(`Invalid action: ${action}`);
            break;
    }
}

const showAllEmployees = async () => {
    const results = await query(`SELECT empl.id, empl.first_name, empl.last_name, roles.title, departments.name AS department, roles.salary, CONCAT_WS(' ', manag.first_name, manag.last_name) AS manager FROM (((employees empl
        LEFT JOIN roles ON empl.role_id = roles.id)
        LEFT JOIN departments ON roles.department_id = departments.id)
        LEFT JOIN employees manag ON manag.id = empl.manager_id)
        ORDER BY empl.id;`);

    if (results.length) {
        console.table(`\nAll Employees:`, results);
    } else {
        console.log(noEmployeesMessage);
    }

    askUser();
}

const showEmployeesByRoles = async () => {
    const roles = (await getRolesList()).map(item => item.name);

    if (!roles.length) {
        console.log(noEmployeesMessage);
        askUser();

        return;
    }

    const { selectedRole } = await inquirer.prompt({
        name: 'selectedRole',
        type: 'rawlist',
        message: `Select role:`,
        choices: roles,
    });

    const results = await query(`SELECT employees.id, employees.first_name, employees.last_name, departments.name AS department FROM ((employees
        LEFT JOIN roles ON employees.role_id = roles.id)
        LEFT JOIN departments ON roles.department_id = departments.id)
        WHERE roles.title = ?
        ORDER BY employees.id;`, [selectedRole]);

    if (results.length) {
        console.table(`\nEmployees By '${selectedRole}' role:`, results);
    } else {
        console.log(`There are no employees with '${selectedRole}' role.\n`);
    }

    askUser();
}

const showEmployeesByDepartment = async () => {
    const departments = (await getDepartmentsList()).map(item => item.name);

    if (!departments.length) {
        console.log(noEmployeesMessage);
        askUser();

        return;
    }

    const { selectedDepartment } = await inquirer.prompt({
        name: 'selectedDepartment',
        type: 'rawlist',
        message: `Select department:`,
        choices: departments,
    });

    const results = await query(`SELECT employees.id, employees.first_name, employees.last_name, roles.title FROM ((employees
        LEFT JOIN roles ON employees.role_id = roles.id)
        LEFT JOIN departments ON roles.department_id = departments.id)
        WHERE departments.name = ?
        ORDER BY employees.id;`, [selectedDepartment]);

    if (results.length) {
        console.table(`\nEmployees By '${selectedDepartment}' Department:`, results);
    } else {
        console.log(`There are no employees in '${selectedDepartment}' department.\n`);
    }

    askUser();
}

const getEmployeesList = async () => {
    const results = await query(`SELECT id AS value, CONCAT_WS(' ', first_name, last_name) AS name FROM employees;`);

    return JSON.parse(JSON.stringify(results));
}

const addEmployee = async () => {
    const rolesList = await getRolesList();
    const employeesList = await getEmployeesList();

    const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: `What is the employee's first name?`,
        },
        {
            name: 'lastName',
            type: 'input',
            message: `What is the employee's last name?`,
        },
        {
            name: 'roleId',
            type: 'list',
            message: `Select the employee's role:`,
            choices: rolesList,
        },
        {
            name: 'managerId',
            type: 'list',
            message: `Select the employee's manager:`,
            choices: [
                {
                    name: 'none',
                    value: null,
                },
                ...employeesList,
            ],
        },
    ]);

    const results = await query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`, [firstName, lastName, roleId, managerId]);

    console.log(`New employee saved successfully! New employee ID: ${results.insertId}\n`);

    askUser();
}

const getRolesList = async () => {
    const results = await query(`SELECT id AS value, title AS name FROM roles;`);

    return JSON.parse(JSON.stringify(results));
}

const addRole = async () => {
    const departmentsList = await getDepartmentsList();

    const { title, salary, departmentId } = await inquirer.prompt([
        {
            name: 'title',
            type: 'input',
            message: `What is the role's title?`,
        },
        {
            name: 'salary',
            type: 'input',
            message: `What is the role's salary?`,
            default: 0,
        },
        {
            name: 'departmentId',
            type: 'list',
            message: `Select the department for this role:`,
            choices: departmentsList,
        },
    ]);

    const results = await query(`INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?);`, [title, salary, departmentId]);

    console.log(`New role saved successfully! New role ID: ${results.insertId}\n`);

    askUser();
}

const getDepartmentsList = async () => {
    const results = await query(`SELECT id AS value, name FROM departments;`);

    return JSON.parse(JSON.stringify(results));
}

const addDepartment = async () => {
    const { name } = await inquirer.prompt({
        name: 'name',
        type: 'input',
        message: `What is the department's name?`,
    });

    const results = await query(`INSERT INTO departments (name) VALUES (?);`, [name]);

    console.log(`New department saved successfully! New department ID: ${results.insertId}\n`);

    askUser();
}

const getEmployeeRoleById = async (employeeId) => {
    const results = await query(`SELECT title FROM roles
        WHERE id = (SELECT role_id FROM employees WHERE id = ?);`, [employeeId]);

    return results[0].title;
}

const updateEmployeeRole = async () => {
    const employeesList = await getEmployeesList();

    const { employeeId } = await inquirer.prompt({
            name: 'employeeId',
            type: 'list',
            message: `Select the employee:`,
            choices: employeesList,
        });

    const currentRole = await getEmployeeRoleById(employeeId);

    const { isContinue } = await inquirer.prompt({
        name: 'isContinue',
        type: 'confirm',
        message: `The employee's current role is '${currentRole}'. Do you want update it?`,
    });

    if (isContinue) {
        const rolesList = await getRolesList();

        const { roleId } = await inquirer.prompt({
            name: 'roleId',
            type: 'list',
            message: `Select the new employee's role`,
            choices: rolesList,
        });

        await query(`UPDATE employees SET role_id = ? WHERE id = ?;`, [roleId, employeeId]);

        console.log(`The employee's role updated!\n`);
    }

    askUser();
}

const exitApp = () => {
    connection.end();
}
