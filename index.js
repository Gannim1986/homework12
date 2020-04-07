var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employees"
});

connection.connect((err) => {
    if (err) throw err;
    startUp();
});

function startUp() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do ?",
        choices: [
            "View All Employees",
            "View All Departments",
            "View All Roles",
            "Add Employees",
            "Add Departments",
            "Add Roles",
            "Update Employee Role",
            "exit"
        ]
    }).then((answer) => {
        switch (answer.action) {
            case " View All Employees":
                SearchAllEmp();
                break;
            case "View All Departments":
                searchDep();
                break;
            case "View All Roles":
                searchRole();
                break;
            case "Add Employees":
                addEmp();
                break;
            case "Add Departments":
                addDep();
                break;
            case "Add Roles":
                addRole();
                break;
            case "Update Employee Role":
                updateEmpRole();
                break;
            case "exit":
                connection.end();
                break;
        }
    });
};

function SearchAllEmp() {
    connection.query(
        "SELECT employee.employee_id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.role_id LEFT JOIN department on role.department_id = department.department_id LEFT JOIN employee manager on manager.manager_id = employee.manager_id;",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            startUp();
        }
    );
};

function searchDep() {
    connection.query("SELECT * from department", (err, res) => {
        if (err) throw err;
        console.table(res);
        startUp();
    });
};

function searchRole() {
    connection.query("SELECT * from department", (err, res) => {
        if (err) throw err;
        console.table(res);
        startUp();
    });
};

function updateEmpManger(empID, roleID) {
    connection.query("UPDATE employee SET role_id = ? WHERE employee_id = ?", [roleID, empID])
};

function addEmp() {
    var questions = [
        {
            type: "input",
            message: " What's the employees first name?",
            name: "first_name"
        },
        {
            type: "input",
            message: " What's the employees last name?",
            name: "last_name"
        },
        {
            type: "input",
            message: " Who's the employees manager (employee_id)?",
            name: "managerID"
        },
        {
            type: "input",
            message: " What's the employees title (role_id)?",
            name: "titleID"
        }
    ]
    inquirer.prompt(questions).then((answer) => {
        connection.query(
            "INSERT INTO employee SET ?",
            {
                first_name: answer.first_name,
                last_name: answer.last_name,
                role_id: answer.titleID,
                manager_id: answer.amangerID,
            },
            function (err) {
                if (err) throw err;
                updateEmpManger(answer.titleID, answer.managerID);
                SearchAllEmp();
            }
        );
    });
};

function addDep() {
    inquirer.prompt({
        type: "input",
        message: "What would you like to name the new department?",
        name: "department"
    })
        .then((answer) => {
            console.log(answer.department);
            connection.query("INSERT INTO department SET?",
                {
                    name: answer.department,
                },
                function (err, res) {
                    if (err) throw err;
                    startUp();
                });
        });
};

function addRole() {
    var questions = [
        {
            type: "input",
            message: "What type of role would you like to add?",
            name: "title",
        },
        {
            type: "input",
            message: "In what department is the new role?",
            name: "id",
        },
        {
            type: "input",
            message: "What is the salary for this role?",
            name: "salary",
        }
    ];
    inquirer.prompt(questions).then((answer) => {
        connection.query("INSERT INTO role SET ?",
            {
                title: answer.title,
                department_id: answer.id,
                salary: answer.salary
            },
            function (err, res) {
                if (err) throw err;
                startUp();
            }
        );
    });
};
function updateEmpRole() {
    var employees = SearchAllEmp();
    var empChoices = employees.map(index => {
        id: id,
    })
    inquirer.prompt({
        type: "list",
        name: "role_id",
        message: "Which role would you like to assign the employee?",
        choices: empChoices
    })
    connection.query('UPDATE employee SET role_id = ? WHERE employee_id = ?', [roleID, empID])
}