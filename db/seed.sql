USE db_12;

TRUNCATE TABLE department;

INSERT INTO 
    department (name)
VALUES
    ('Sales')
    ('Marketing')
    ('Customer Service')
    ('R & D')
    ('Human Resource')
   -- for testing ('Accounting')
;

TRUNCATE TABLE role;

INSERT INTO 
    role (title, salary, department_id)
VALUES 
     ('Sales Manager', 100000, 1)
     ('Sales', 70000, 1)
     ('Marketing Manager', 100000, 2)
     ('CS Manager', 100000, 3)
     ('Senior Engineer', 150000, 4)
     ('HR Manager', 100000, 5)
    --  for testing ('Accountant', 90000, 6)

TRUNCATE TABLE employee;

INSERT INTO 
    employee (first_name, last_name, role_id, manager_id)
VALUES 
    ('Humphrey', 'Bogart', 1, null)
    ('Cary', 'Grant', 2, 1)
    ('James', 'Stewart', 3, null)
    ('Marlon', 'Brando', 4, null)
    ('Fred', 'Astaire', 5, null)
    ('Henry', 'Fonda', 6, null)
    -- for testing ('Clark', 'Gable', 7, null)