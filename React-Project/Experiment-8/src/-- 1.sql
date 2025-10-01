-- 1. Create a new database
CREATE DATABASE school;

-- 2. Use the database
USE school;

-- 3. Create a table
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    course VARCHAR(50),
    age INT
);

-- 4. Insert some data
INSERT INTO students (name, course, age) VALUES
('Arun', 'Mathematics', 21),
('Priya', 'Physics', 22),
('Raj', 'Mathematics', 20),
('Neha', 'Computer Science', 23);

-- 5. Select all data
SELECT * FROM students;

-- 6. Select with condition
SELECT * FROM students WHERE course = 'Mathematics';

-- 7. Update a record
UPDATE students
SET age = 22
WHERE name = 'Raj';

-- 8. Delete a record
DELETE FROM students
WHERE name = 'Neha';

-- 9. Aggregate example: count students by course
SELECT course, COUNT(*) AS total_students
FROM students
GROUP BY course;


