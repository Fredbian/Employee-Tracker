DROP DATABASE IF EXISTS db_12;

CREATE DATABASE db_12;

USE db_12;

DROP TABLE IF EXISTS department;

-- create dpt table
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR (30) NULL,
    PRIMARY KEY (id)
)
;
INSERT INTO 
    department (name)
VALUES
    ('Sales'),
    ('Marketing'),
    ('Customer Service'),
    ('R & D'),
    ('Human Resource')
   -- for testing ('Accounting')
;
-- create role table
CREATE TABLE role (
  id INT AUTO_INCREMENT NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY(id)
)
;

-- create employee table
CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NULL,
  last_name VARCHAR(30) NULL,
  role_id INT NULL,
  manager_id INT NULL,
  PRIMARY KEY (id)
)
;
