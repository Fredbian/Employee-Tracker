// import node modules
const inquirer = require('inquirer')
const connection = require('./db/connect')
const cTable = require('console.table')

// connect to database
connection.connect((err) => {
    // if err, print err
    if (err) return console.log(err.message)
    // if no err, print WELCOME and run app
    console.log('WELCOME TO EMPLOYEE TRACKER\n')
    startApp()
})

// prepare inquirer questions
const startQuestions = [{
    type: 'list',
    name: 'startQuestions',
    message: 'Please select what would you like to do?',
    choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role', 'Exit Application']
}]

// start App
const startApp = () => {
    // ask questions
    inquirer.prompt(startQuestions)
        // run functions based on user input
        .then(answer => {
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
                    createDepartment()
                    break
                // if add role, run add role
                case 'Add a Role':
                    createRole()
                    break
                // if add employee, run add employee fn
                case 'Add an Employee':
                    createEmployee()
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


// view all department fn
const viewAllDepartments = () => {
    // SELECT from department
    const query = 'SELECT * FROM department'
    connection.query(query, (err, res) => {
        // if error, print err
        if (err) return console.log(err.message)
        // if not, print department table
        console.log('View All Departments:\n')
        console.table(res)
        // call start fn after print
        startApp()
    })
}


// view all roles fn
const viewAllRoles = () => {
    // SELECT from role
    const query = 'SELECT * FROM role'
    connection.query(query, (err, res) => {
        // if err, print err
        if (err) return console.log(err.message)
        // if not, print role table
        console.log('View All Roles:\n')
        console.table(res)
        // call start app after print
        startApp()
    })
}


// view all employees fn
const viewAllEmployees = () => {
    // SELECT from employee
    const query = 'SELECT * FROM employee'
    connection.query(query, (err, res) => {
        // if err, print err
        if (err) return console.log(err.message)
        // if not, print role table
        console.log('View All Employees:\n')
        console.table(res)
        // call start app after print
        startApp()
    })
}


// create new depart fn 
const createDepartment = () => {
    // ask question, input new dpt name
    inquirer.prompt([
        {
            type: 'input',
            name: 'newDepartmentName',
            message: 'Please enter the new department name'
        }
    ])
        .then(answer => {
            // INSERT new dpt into department table
            const newDepartmentName = answer.newDepartmentName
            const query = 'INSERT INTO department (name) VALUES (?)'
            connection.query(query, [newDepartmentName], (err, res) => {
                // if err, print err
                if (err) return console.log(err.message)
                // if no err, print message 
                console.log(`\nDepartment ${newDepartmentName} has been added successfully!\n`)
            })
            // call viewAllDepartments(), print dpt table and back to start
            viewAllDepartments()
        })
}



// -------------------------------------
// fn for creating department array
const getDepartmentsArray = () => {
    let departments = []
    const query = 'SELECT name FROM department'
    connection.query(query, (err, res) => {
        // if err, print err
        if (err) return console.log(err.message)
        // if not, create department array
        res.forEach(data => departments.push(data.name))
    })
}

// create new role fn
const createRole = () => {
    // ask new role name, salary, department
    inquirer.prompt([
        {
            type: 'input',
            name: 'newRoleTitle',
            message: 'Please enter title for this new role',
        },
        {
            type: 'input',
            name: 'newRoleSalary',
            message: 'Please enter salary for this new role'
        },
        {
            type: 'list',
            name: 'newRoleDepartment',
            message: 'Please enter department for this new role',
            // call getDepartmentArray to get choices
            choices: getDepartmentsArray()
        }
    ])
        .then(answer => {
            // SELECT get id by department name
            let departmentID = 0
            const newRoleDepartment = answer.newRoleDepartment
            const query = 'SELECT id FROM department WHERE name = ?'
            connection.query(query, [newRoleDepartment], (err, res) => {
                // if err, print err
                if (err) return console.log(err.message)
                // if not, get id
                res.forEach(id => departmentID = id.id)

                // INSERT role by depart id
                const newRole = {
                    title: answer.newRoleTitle,
                    salary: answer.salary,
                    department_id: departmentID
                }
                const query = 'INSERT INTO role SET ?'
                connection.query(query, newRole, (err, res) => {
                    // if err, print err
                    if (err) return console.log(err.message)
                    // if no err, print message
                    console.log(`\nNew Role ${answer.newRoleTitle} has been added successfully!\n`)
                })
                // call viewAllRoles(), print roles table and back to start
                viewAllRoles()
            })
        })
}
// ------------------------------------------



createEmployee()
updateEmployeeRole()



