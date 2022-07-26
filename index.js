// import node modules
const inquirer = require('inquirer')
const connection = require('./db/connect')
const cTable = require('console.table')

// connect to database
connection.connect((err) => {
    // if err
    if (err) return console.log(err.message)
    // if no err console WELCOME and run app
    console.log('WELCOME TO EMPLOYEE TRACKER\n')
    startApp()
})

// start App
const startApp = () => {
    // ask questions
    inquirer.prompt({
        type: 'list',
        name: 'startQuestions',
        message: 'Please select what would you like to do?',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role', 'Exit Application']
    })
        // run functions based on user input
        .then((answer) => {
            switch (answer.startQuestions) {
                // if view all depart, run viewAllDepart function
                case 'View All Departments':
                    viewAllDepartments()
                    break
                // if view all roles, run view roles function    
                case 'View All Roles':
                    viewAllRoles()
                    break
                // if view all employees, run view employees function    
                case 'View All Employees':
                    viewAllEmployees()
                    break
                // if add depart, run add depart fn
                case 'Add a Department':
                    addDepartment()
                    break
                // if add role, run add role
                case 'Add a Role':
                    addRole()
                    break
                // if add employee, run add employee fn
                case 'Add an Employee':
                    addEmployee()
                    break
                // if update employee role, fun update fn
                case 'Update an Employee Role':
                    updateEmployeeRole()
                    break
                // if exit, end connection
                case 'Exit Application':
                    connection.end()
                    break
            }
        })
}

// view department fnc
const viewAllDepartments = () => {
    const query = 'SELECT * FROM department'
    connection.query(query, (err, res) => {
        if (err) return console.log(err.message)
        
    })
}


viewAllRoles()
viewAllEmployees()
addDepartment()
addRole()
addEmployee()
updateEmployeeRole()