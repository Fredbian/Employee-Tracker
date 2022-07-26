// import node modules
const mysql = require('mysql2')

// create connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '!Bthenan123!',
    database: 'db_12'
})

// export
module.exports = connection