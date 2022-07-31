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


// start App
const startApp = () => {
    // prepare inquirer questions
    const startQuestions = [{
        type: 'list',
        name: 'startQuestions',
        message: 'Please select what would you like to do?',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'View Employees by Department','View Employees by Manager', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role', 'Delete Department', 'Delete Role', 'Delete Employee', 'Exit Application']
    }]
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
                // -- if view employees by department, run view employee by manager func
                case 'View Employees by Department':
                    viewEmployeesByDepartment()
                    break    
                // -- if view employees by manager, run view employee by manager func
                case 'View Employees by Manager':
                    viewEmployeesByManager()
                    break
                // -- if delete department, run delete department func
                case 'Delete Department':
                    deleteDepartment()
                    break    
                // -- if delete role, run delete role func
                case 'Delete Role':
                    deleteRole()
                    break
                // -- if delete employee, run delete employee func
                case 'Delete Employee':
                    deleteEmployee()
                    break                        
                // if add depart, run add depart fn
                case 'Add a Department':
                    createNewDepartment()
                    break
                // if add role, run add role
                case 'Add a Role':
                    createNewRole()
                    break
                // if add employee, run add employee fn
                case 'Add an Employee':
                    createNewEmployee()
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
        console.log('\nView All Departments:')
        console.table(res)
        // call start fn after print
        startApp()
    })
}


// view all roles fn
const viewAllRoles = () => {
    // SELECT join role and department table by id
    const query = `SELECT role.id, role.title, department.name AS department, CONCAT('$', role.salary) AS salary 
    FROM role
    LEFT JOIN department ON role.department_id = department.id
    `
    connection.query(query, (err, res) => {
        // if err, print err
        if (err) return console.log(err.message)
        // if not, print role table
        console.log('\nView All Roles:')
        console.table(res)
        // call start app after print
        startApp()
    })
}


// view all employees fn
const viewAllEmployees = () => {
    // SELECT join department, role and employee table by id
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, CONCAT('$', role.salary) AS salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
    FROM employee 
    LEFT JOIN role ON employee.role_id = role.id 
    LEFT JOIN department ON role.department_id = department.id 
    LEFT JOIN employee manager ON manager.id = employee.manager_id`
    //where manager.id = ?`

    connection.query(query, (err, res) => {
        // if err, print err
        if (err) return console.log(err.message)
        // if not, print role table
        console.log('\nView All Employees:')
        console.table(res)
        // call start app after print
        startApp()
    })
}


// -------------view by department------------------
const viewEmployeesByDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'departmentID',
            message: 'Please enter departmentID to view employees'
        }
    ])
    .then(answer => {
        // SELECT join employee table, role table and department table by id, and choose row when departmentID =
        const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, CONCAT('$', role.salary) AS salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
        FROM employee 
            LEFT JOIN role ON employee.role_id = role.id 
            LEFT JOIN department ON role.department_id = department.id 
            LEFT JOIN employee manager ON manager.id = employee.manager_id
            WHERE department.id = ?`
            connection.query(query, [answer.departmentID], (err, res) => {
                // if err, print err
                if (err) return console.log(err.message)
                // if not, print table
                console.log('\nView Employees By Department:')
                console.table(res)
                startApp()
            })
    })
}



// ----------- view employees by manager-------------
const viewEmployeesByManager = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'managerID',
            message: 'Please enter managerID to view employees'
        }
    ])
    .then(answer => {
        // SELECT join employee table, role table and department table by id, and choose row when managerID =
        const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, CONCAT('$', role.salary) AS salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
        FROM employee 
            LEFT JOIN role ON employee.role_id = role.id 
            LEFT JOIN department ON role.department_id = department.id 
            LEFT JOIN employee manager ON manager.id = employee.manager_id
            WHERE manager.id = ?`
            
            connection.query(query, [answer.managerID], (err, res) => {
                // if err, print err
                if (err) return console.log(err.message)
                // if not, print table
                console.log('\nView Employees By Manager:')
                console.table(res)
                startApp()
            })
        })
}
    
    
    
    
    
// create new depart fn 
const createNewDepartment = () => {
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
                return console.log(`\nDepartment ${newDepartmentName} has been added successfully!\n`)
            })
            // call viewAllDepartments(), print dpt table and back to start
            viewAllDepartments()
        })
}
    
    
    
// -------------------------------------
// SELECT fn for creating department array
    const createDepartmentsArray = () => {
        let departmentsArray = []
        const query = 'SELECT name FROM department'
        connection.query(query, (err, res) => {
        // if err, print err
        if (err) return console.log(err.message)
        // if not, create department array
        res.forEach(data => departmentsArray.push(data.name))
    })
    // return department array
    return departmentsArray
}

// create new role fn
const createNewRole = () => {
    // ask new role name, salary, department
    const newRoleQuestions = [
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
            message: 'Please select department for this new role',
            // call getDepartmentArray to get choices
            choices: createDepartmentsArray()
        }
    ]

    inquirer.prompt(newRoleQuestions)
    .then(answer => {
        // SELECT get id by department name
        let departmentID = 0
        const newRoleDepartment = answer.newRoleDepartment
        const query = 'SELECT id FROM department WHERE name = ?'
        connection.query(query, newRoleDepartment, (err, res) => {
            // if err, print err
            if (err) return console.log(err.message)
            // if not, get id
            res.forEach(id => departmentID = id.id)
            
            // INSERT role by depart id
            const newRole = {
                title: answer.newRoleTitle,
                salary: answer.newRoleSalary,
                department_id: departmentID
            }
            const query = 'INSERT INTO role SET ?'
            connection.query(query, newRole, (err, res) => {
                // if err, print err
                if (err) return console.log(err.message)
                // if no err, print message
                return console.log(`\nNew Role ${answer.newRoleTitle} has been added successfully!\n`)
            })
                // call viewAllRoles(), print roles table and back to start
                viewAllRoles()
            })
        })
}
// ------------------------------------------
    
    
// ---------------------------------------
// SELECT create role array
const createRoleArray = () => {
    let rolesArray = []
    const query = 'SELECT title FROM role'
    connection.query(query, (err, res) => {
            // if err, print err
            if (err) return console.log(err.message)
            // if not, create department array
            res.forEach(data => rolesArray.push(data.title))
        })
        // return role array
        return rolesArray
    }
    
// SELECT create employee array for choose manager
const createEmployeeArray = () => {
    let firstNameArray = [];
    let lastNameArray = [];
    let employeesArray = [];

    connection.query('SELECT first_name FROM employee', (err, res) => {
        // if err, print err
        if (err) return console.log(err.message)
        // if not, create first name array
        res.forEach(first_name => firstNameArray.push(first_name.first_name))

        connection.query('SELECT last_name FROM employee', (err, res) => {
            // if err, print err
            if (err) return console.log(err.message)
            // if not, create last name array
            res.forEach(last_name => lastNameArray.push(last_name.last_name))
            // loop two arrays and join to get employee array
            for (let i = 0; i < firstNameArray.length; i++) {
                employeesArray[i] = `${firstNameArray[i]} ${lastNameArray[i]}`
            }
        })
    })
    // return employee array
    return employeesArray
}


const createNewEmployee = () => {
    // prepare new employee questions
    const newEmployeeQuestions = [
        {
            type: 'input',
            name: 'firstName',
            message: 'Please enter first name for the new employee',
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Please enter last name for the new employee'
        },
        {
            type: 'list',
            name: 'role',
            message: 'Please select role for the new employee',
            // call createRoleArray to get all roles
            choices: createRoleArray()
        },
        {
            type: 'list',
            name: 'manager',
            message: 'Please select manager for the new employee',
            // call createEmployeeArray to get all employees for manager
            choices: createEmployeeArray()
        }
    ]
    
    inquirer.prompt(newEmployeeQuestions)
    .then(answer => {
        let roleID = 0
        let managerID = 0
        
        //get roleID by name
            const query = 'SELECT id FROM role WHERE title = ?'
            connection.query(query, answer.role, (err, res) => {
                // if err, print err
                if (err) return console.log(err.message)
                // if not, get role id
                res.forEach(id => roleID = id.id)
                
                // get manager first name from answer
                let managerFirstName = ''
                managerFirstName = answer.manager.split(' ')[0]
                
                // SELECT get manager id from manager name
                const query = 'SELECT id FROM employee WHERE first_name = ?'
                connection.query(query, managerFirstName, (err, res) => {
                    // if err, print err
                    if (err) return console.log(err.message)
                    // if not, get manager id
                    res.forEach(id => managerID = id.id)
                    
                    
                    // INSERT new employee into table
                    const newEmployee = {
                        first_name: answer.firstName,
                        last_name: answer.lastName,
                        role_id: roleID,
                        manager_id: managerID
                    }
                    
                    const insertQuery = 'INSERT INTO employee SET ?'
                    
                    connection.query(insertQuery, newEmployee, (err, res) => {
                        // if err, print err
                        if (err) return console.log(err.message)
                        // if no err, print message
                        return console.log(`\nNew Employee ${answer.firstName} ${answer.lastName} has been added successfully!\n`)
                    })
                    
                    viewAllEmployees()
                })
                
            })
        })
}

//---------------------
    
    
    
    
    
//---------------------------
// fun for update employee role
const updateEmployeeRole = () => {
    // prepare questions
        const questions = [
            {
                type: 'number',
                name: 'employeeID',
                message: 'Please enter employee ID to update'
            },
            {
            type: 'number',
            name: 'roleID',
            message: 'Please enter the role ID you wish to update to'
        }
    ]
    // ask questions
    inquirer.prompt(questions)
    .then(answer => {
        // UPDATE employee's role by id
        const query = 'UPDATE employee SET role_id = ? WHERE id = ?'
        connection.query(query, [answer.roleID, answer.employeeID], (err, res) => {
            // if err, print err
            if (err) return console.log(err.message)
            // if no err, print message
            console.log(`\nEmployee's role has been updated successfully!\n`)
            viewAllEmployees()
        })
    })
    
}


// -------------Delete Department------------------
const deleteDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'deleteDepartmentID',
            message: 'Please enter departmentID you wish to delete'
        }
    ])
    .then(answer => {
        const query = 'DELETE FROM department WHERE id = ?'
        connection.query(query, answer.deleteDepartmentID, (err, res) => {
            // if err, print err
            if (err) return console.log(err.message)
            // if no err, print message
            console.log(`\nDepartment has been deleted successfully!`)
            viewAllDepartments()
            })
           startApp() 
        })
}


// ----------------Delete role-------------
const deleteRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'deleteRoleID',
            message: 'Please enter roleID you wish to delete'
        }
    ])
    .then(answer => {
        const query = 'DELETE FROM role WHERE id = ?'
        connection.query(query, answer.deleteRoleID, (err, res) => {
            // if err, print err
            if (err) return console.log(err.message)
            // if no err, print message
            console.log(`\nDepartment has been deleted successfully!`)
            viewAllRoles()
            })
           startApp() 
        })
}

// ----------------Delete employee-------------
const deleteEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'deleteEmployeeID',
            message: 'Please enter employeeID you wish to delete'
        }
    ])
    .then(answer => {
        const query = 'DELETE FROM employee WHERE id = ?'
        connection.query(query, answer.deleteEmployeeID, (err, res) => {
            // if err, print err
            if (err) return console.log(err.message)
            // if no err, print message
            console.log(`\nDepartment has been deleted successfully!`)
            viewAllEmployees()
            })
           startApp() 
        })
}



















// //-----------Update employee manager-----------
// const updateEmployeeManager = () => {

//     inquirer.prompt([
//         {
//             type: 'input',
//             name: 'employeeID',
//             message: 'Please enter employeeID to update'
//         },
//         {
//             type: 'input',
//             name: 'managerID',
//             message: 'Please enter the role ID you wish to update to'
//         }
//     ])
//         .then(answer => {
//             const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, CONCAT('$', role.salary) AS salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
//             FROM employee 
//             LEFT JOIN role ON employee.role_id = role.id 
//             LEFT JOIN department ON role.department_id = department.id 
//             LEFT JOIN employee manager ON manager.id = employee.manager_id
//             WHERE employee.id = ?`

//             connection.query(query, [answer.employeeID], (err, res) => {
//                 // if err, print err
//                 if (err) return console.log(err.message)
//                 // if not
                
//             })
//         })
// }
