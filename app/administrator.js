const express = require('express');
const app = express();
const async = require('async');
const con = require('./index').con;
const { create } = require('express-handlebars');

// TODO: put files in models folder
// TODO: change to exports. instead

function createAccountType(accountType, con) {
    /* 
    Purpose: Creates an account type in the DB (i.e. Student, Administrator, etc.). 
    Input:
        accountType: account type to be created in the DB [string]
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, 'Data too long for column 'Name' at row 1']).
    */
    let sql = 'INSERT INTO AccountType VALUES (?)';
    return new Promise((resolve, reject) => {
        con.query(sql, accountType, (err, result) => {
            return err ? resolve([false, err.sqlMessage]) : resolve([true]);
        });
    });
}

function getAccountTypes(con) {
    /* 
    Purpose: Retrieves an array of all account types in the DB as objects
    Input:
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If an error occurs, returns an array with only one element of false (i.e. [false])
        If there is no account types in the DB, returns an empty array. 
        Otherwise, returns an array of objects that contain the account type in each object.
    */
    let sql = 'SELECT * FROM AccountType';
    return new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            return err ? resolve([false]) : resolve(result);
        });
    });
}

function deleteAccountType(accountType, con) {
    /* 
    Purpose: Deletes an account type in the DB if it exists (i.e. Student, Administrator, etc.). 
    Input:
        accountType: account type to be deleted in the DB
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Name' at row 1"]).
        If accountType does not exist in DB, returns [false, 'No rows affected'].
    */
    let sql = 'DELETE FROM AccountType WHERE Name = ?';
    return new Promise((resolve, reject) => {
        con.query(sql, accountType, (err, result) => {
            return err ? resolve([false, err.sqlMessage]) : result.affectedRows > 0 ? resolve([true]) : resolve([false, 'No rows affected']);
        });
    });
}

function createDepartment(id, name, con) {
    /* 
    Purpose: Creates an department in the DB (i.e. Computer Science, Electrical Engineering, etc.). 
    Input:
        id: to be inserted in Id column in Department table (can be NULL if user does not specify a certain id)
        name: name of the department (i.e. Computer Science) to be inserted in the Name column of the Department table
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Name' at row 1"]).
    */
    if (id === null) var sql = 'INSERT INTO Department(name) VALUES (?)';
    else var sql = 'INSERT INTO Department VALUES (?)';
    return new Promise((resolve, reject) => {
        if (id === null) {
            con.query(sql, name, (err, result) => {
                return err ? resolve([false, err.sqlMessage]) : resolve([true]);
            });
        } else {
            con.query(sql, [[id, name]], (err, result) => {
                return err ? resolve([false, err.sqlMessage]) : resolve([true]);
            });
        }
    });
}

function getDepartments(con) {
    /* 
    Purpose: Retrieves an array of all departments in the DB as objects
    Input:
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If an error occurs, returns an array with only one element of false (i.e. [false])
        If there are no departments in the DB, returns an empty array. 
        Otherwise, returns an array of objects that contain the department type in each object.
    */
    let sql = 'SELECT * FROM Department';
    return new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            return err ? resolve([false]) : resolve(result);
        });
    });
}

function deleteDepartment(id, con) {
    /* 
    Purpose: Deletes a department in the DB if it exists (i.e. Computer Science, Electrical Engineering, etc.). 
    Input:
        id: id of department to be deleted in the DB
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Name' at row 1"]).
        If id does not exist in DB, returns [false, 'No rows affected'].
    */
    let sql = 'DELETE FROM Department WHERE Id = ?';
    return new Promise((resolve, reject) => {
        con.query(sql, id, (err, result) => {
            return err ? resolve([false, err.sqlMessage]) : result.affectedRows > 0 ? resolve([true]) : resolve([false, 'No rows affected']);
        });
    });
}

function createGrade(name, con) {
    /* 
    Purpose: Creates a grade type in the DB (i.e. 'A', 'B', 'C', 'D', 'F', etc.). 
    Input:
        name: grade to be created in the DB
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Name' at row 1"]).
    */
    let sql = 'INSERT INTO Grade VALUES (?)';
    return new Promise((resolve, reject) => {
        con.query(sql, name, (err, result) => {
            return err ? resolve([false, err.sqlMessage]) : resolve([true]);
        });
    });
}

function getGrades(con) {
    /* 
    Purpose: Retrieves an array of all grade types in the DB as objects
    Input:
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If an error occurs, returns an array with only one element of false (i.e. [false])
        If there are no grades in the DB, returns an empty array. 
        Otherwise, returns an array of objects that contain the grade in each object.
    */
    let sql = 'SELECT * FROM Grade';
    return new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            return err ? resolve([false]) : resolve(result);
        });
    });
}

function deleteGrade(name, con) {
    /* 
    Purpose: Deletes a grade type in the DB if it exists (i.e. 'A', 'B', 'C', 'D', 'F', etc.). 
    Input:
        name: name of grade to be deleted in the DB
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Name' at row 1"]).
        If name does not exist in DB, returns [false, 'No rows affected'].
    */
    let sql = 'DELETE FROM Grade WHERE Name = ?';
    return new Promise((resolve, reject) => {
        con.query(sql, name, (err, result) => {
            return err ? resolve([false, err.sqlMessage]) : result.affectedRows > 0 ? resolve([true]) : resolve([false, 'No rows affected']);
        });
    });
}

function createSemester(name, con) {
    /* 
    Purpose: Creates a semester in the DB (i.e. 'Winter', 'Spring', 'Summer', 'Fall', etc.). 
    Input:
        name: semester to be created in the DB
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Name' at row 1"]).
    */
    let sql = 'INSERT INTO Semester VALUES (?)';
    return new Promise((resolve, reject) => {
        con.query(sql, name, (err, result) => {
            return err ? resolve([false, err.sqlMessage]) : resolve([true]);
        });
    });
}

function getSemesters(con) {
    /* 
    Purpose: Retrieves an array of all semesters in the DB as objects
    Input:
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If an error occurs, returns an array with only one element of false (i.e. [false])
        If there are no grades in the DB, returns an empty array. 
        Otherwise, returns an array of objects that contain the grade in each object.
    */
    let sql = 'SELECT * FROM Semester';
    return new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            return err ? resolve([false]) : resolve(result);
        });
    });
}

function deleteSemester(name, con) {
    /* 
    Purpose: Deletes a semester in the DB if it exists (i.e. 'Winter', 'Spring', 'Summer', 'Fall', etc.). 
    Input:
        name: name of semester to be deleted in the DB
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Name' at row 1"]).
        If name does not exist in DB, returns [false, 'No rows affected'].
    */
    let sql = 'DELETE FROM Semester WHERE Name = ?';
    return new Promise((resolve, reject) => {
        con.query(sql, name, (err, result) => {
            return err ? resolve([false, err.sqlMessage]) : result.affectedRows > 0 ? resolve([true]) : resolve([false, 'No rows affected']);
        });
    });
}

function assignCurrentSemester(name, year, con) {
    /* 
    Purpose: Updates the current semester in the DB so that students are allowed to enroll, view, and drop courses for this semester and not previous semesters.
    Warning:
        name must already be in Semester table's Name column
    Input:
        name: semester name for the current semester [string]
        year: the year of the current semester [int]
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, 'Data too long for column 'Name' at row 1']).
    */
    let sql = 'INSERT INTO CurrentSemester(Name, Year) VALUES (?)';
    return new Promise((resolve, reject) => {
        con.query(sql, [[name, year]], (err, result) => {
            return err ? resolve([false, err.sqlMessage]) : resolve([true]);
        });
    });
}

function assignNextSemester(name, year, con) {
    /* 
    Purpose: Updates the next semester in the DB so that students are allowed to enroll, view, and drop courses for this semester, current semester, and not previous semesters.
    Warning:
        name must already be in Semester table's Name column
    Input:
        name: semester name for the next semester [string]
        year: the year of the next semester [int]
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If the anticipated next semester is the same as the current semester in the DB, returns [false, 'Next semester cannot be current semester']
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Name' at row 1"]).
    */
    let sql = 'INSERT INTO NextSemester(Name, Year) VALUES (?)';
    return new Promise((resolve, reject) => {
        async.waterfall([
            function verify(callback) {
                con.query('SELECT Name, Year FROM CurrentSemester ORDER BY DateAdded DESC LIMIT 1', (err, result) => {
                    let currSem = result[0];
                    if (typeof currSem !== 'undefined' && currSem['Name'] === name && currSem['Year'] === year) {
                        callback(null, false);
                        return resolve([false, 'Next semester cannot be current semester']);
                    }
                    callback(null, true);
                });
            },
            function execute(verification) {
                if (!verification) return;
                con.query(sql, [[name, year]], (err, result) => {
                    return err ? resolve([false, err.sqlMessage]) : resolve([true]);
                });
            }
        ]);
    });
}

function createInstructor(id, name, email, con) {
    /* 
    Purpose: Creates an instructor in the DB
    Input:
        id: to be inserted in Id column in Instructor table (must specify a specific ID number; cannot be null] [int]
        name: name of the instructor (i.e. 'John Doe') to be inserted in the Name column of the Instructor table [null, empty string, string]
        email: email of the instructor (i.e. 'johndoe@gmail.com') to be inserted in the Email column of the Instructor table (must be unique; not used by other instructors) [null, empty string, string] // TODO: would be a good idea to make sure it's not null or empty (not immediately necessary)
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Name' at row 1"]).
    */
    let sql = 'INSERT INTO Instructor VALUES (?)';
    return new Promise((resolve, reject) => {
        con.query(sql, [[id, name, email]], (err, result) => {
            return err ? resolve([false, err.sqlMessage]) : resolve([true]);
        });
    });
}

function getInstructors(con) {
    /* 
    Purpose: Retrieves an array of all instructors in the DB as objects
    Input:
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If an error occurs, returns an array with only one element of false (i.e. [false])
        If there are no instructors in the DB, returns an empty array. 
        Otherwise, returns an array of objects that contain the instructor's information in each object.
    */
    let sql = 'SELECT * FROM Instructor';
    return new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            return err ? resolve([false]) : resolve(result);
        });
    });
}

function deleteInstructor(id, con) {
    /* 
    Purpose: Deletes an instructor in the DB if it exists 
    Input:
        id: id of the instructor to be deleted in the DB
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Id' at row 1"]).
        If id does not exist in DB, returns [false, 'No rows affected'].
    */
    let sql = 'DELETE FROM Instructor WHERE Id = ?';
    return new Promise((resolve, reject) => {
        con.query(sql, id, (err, result) => {
            return err ? resolve([false, err.sqlMessage]) : result.affectedRows > 0 ? resolve([true]) : resolve([false, 'No rows affected']);
        });
    });
}

function createCourse(id, title, dept, credits, cost, con) {
    /* 
    Purpose: Creates a course in the DB
    Warning: 
        dept must already be in Department table's Id column
    Input:
        id: course ID to be inserted in Id column of Course table (must specify a specific ID number; cannot be null and must be unique) [int)
        title: title/name of the course to be inserted in the Title column of Course table [string]
        dept: ID of the department that the course belongs to (same ID as the one in the Department table) [int]
        credits: the number of credits the course is [int]
        cost: how much the course costs (decimal with at most precision 2)
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Name' at row 1"]).
    */
    let sql = 'INSERT INTO Course VALUES (?)';
    return new Promise((resolve, reject) => {
        con.query(sql, [[id, title, dept, credits, cost]], (err, result) => {
            return err ? resolve([false, err.sqlMessage]) : resolve([true]);
        });
    });
}

function viewCourses(con) {
    let sql = "SELECT * FROM course";
    return new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            return err ? resolve([false]) : resolve(result);
        });
    });
}

function updateCourse(id, newTitle, newDept, newCredits, newCost, con) {
    /* 
    Purpose: Updates a course's information in the DB
    Warning: 
        newDept must already be in Department table's Id column
    Input:
        id: course ID to be updated in Course table (must specify a specific ID number; cannot be null and must be unique) [int]
        newTitle: new title/name of the course that is being updated [string]
        newDept: new department ID of the course that is being updated (same ID as the one in the Department table) [int]
        newCredits: the number of credits the course is being updated to [int]
        newCost: the new cost of the course (decimal with at most precision 2)
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Name' at row 1"]).
        If no such row in the Course table has a matching id, returns [false, 'No rows affected'].
    */
    let sql = 'UPDATE Course \
                SET Title = ?, \
                    Dept = ?, \
                    Credits = ?, \
                    Cost = ? \
                WHERE Id = ?';
    return new Promise((resolve, reject) => {
        con.query(sql, [newTitle, newDept, newCredits, newCost, id], (err, result) => {
            return err ? resolve([false, err.sqlMessage]) : result.affectedRows > 0 ? resolve([true]) : resolve([false, 'No rows affected']);
        });
    });
}

function deleteCourse(id, con) {
    /* 
    Purpose: Deletes a course in the DB if it exists 
    Input:
        id: id of the course to be deleted in the DB
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Id' at row 1"]).
        If id does not exist in DB, returns [false, 'No rows affected'].
    */
    let sql = 'DELETE FROM Course WHERE Id = ?';
    return new Promise((resolve, reject) => {
        con.query(sql, id, (err, result) => {
            return err ? resolve([false, err.sqlMessage]) : result.affectedRows > 0 ? resolve([true]) : resolve([false, 'No rows affected']);
        });
    });
}

function createClass(classId, courseId, section, instructor, year, semester, con) {
    /* 
    Purpose: Creates a class in the DB
    Warning: 
        courseId must already be in Course table's Id column
        instructor must already be in Instructor table's Id column
        semester must already be in Semester table's Name column
        year and semester must collectively be either the current or next semester
        There must be a current semester and next semester assigned in the DB. // TODO: change this (not immediately necessary)
    Input:
        classId: class ID for the class the user wants to create (if null, automatically sets a class ID) [int]
        courseId: course ID that references a course in the Course table (must specify a specific ID number that's in the Course table's Id column, cannot be null, int)
        section: section of the class (cannot be null) [string]
        instructor: ID of the instructor that teaches the class (same ID as the one in the Instructor table) [int]
        year: the year the class takes place (cannot be null) [int]
        semester: the semester the class takes place (same as the name in the Semester table, cannot be null) [string]
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Name' at row 1"]).
        If the year and semester does not belong to the current or next semester, returns [false, 'Desired year or semester does not belong to the current or next semesters'].
    */
    if (classId === null) var sql = 'INSERT INTO Class(CourseId, Section, Instructor, Year, Semester) VALUES (?)';
    else var sql = 'INSERT INTO Class VALUES (?)';
    return new Promise((resolve, reject) => {
        async.waterfall([
            function verify(callback) {
                con.query('SELECT Name, Year FROM CurrentSemester ORDER BY DateAdded DESC LIMIT 1; \
                           SELECT Name, Year FROM NextSemester ORDER BY DateAdded DESC LIMIT 1;', (err, result) => {
                    let currSem = result[0][0]['Name'];
                    let currYear = result[0][0]['Year'];
                    let nextSem = result[1][0]['Name'];
                    let nextYear = result[1][0]['Year'];
                    if ((currSem !== semester || currYear !== year) && (nextSem !== semester || nextYear !== year)) {
                        callback(null, false);
                        return resolve([false, 'Desired year or semester does not belong to the current or next semesters']);
                    }
                    callback(null, true);
                });
            },
            function execute(verification) {
                if (!verification) return;
                if (classId === null) var args = [[courseId, section, instructor, year, semester]];
                else var args = [[classId, courseId, section, instructor, year, semester]];
                con.query(sql, args, (err, result) => {
                    return err ? resolve([false, err.sqlMessage]) : resolve([true]);
                });
            }
        ]);
    });
}

// TODO: for administrator.js and student.js
function getCurrentSemClasses(con) { // TODO: Akbar, you can move this
    /* 
    Purpose: Retrieves an array of all classes taking place during the current semester as objects
    Input:
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If an error occurs, returns an array with only one element of false (i.e. [false])
        If current semester is not assigned yet in the DB, returns an empty array.
        If there are no classes yet for the current semester, returns an empty array. 
        Otherwise, returns an array of objects that contain the classes' informations in each object.
    */
    return new Promise((resolve, reject) => {
        async.waterfall([
            function getCurrentSemester(callback) {
                con.query('SELECT Name, Year FROM CurrentSemester ORDER BY DateAdded DESC LIMIT 1', (err, result) => {
                    if (result.length === 0) {
                        callback(null, false, '', '');
                        return resolve([]);
                    }
                    callback(null, true, result[0]['Year'], result[0]['Name']);
                });
            },
            function execute(verification, year, semester) {
                if (!verification) return;
                let sql = 'SELECT Class.Id AS ClassId, Class.CourseId, Course.Title, Class.Section, Instructor.Name AS Instructor, Class.Year, Class.Semester, Department.Name AS Department, Course.Credits, Course.Cost \
                            FROM Class \
                            JOIN Course ON Class.CourseId = Course.Id \
                            JOIN Instructor ON Class.Instructor = Instructor.Id \
                            JOIN Department ON Course.Dept = Department.Id \
                            WHERE Class.Year = ? AND Class.Semester = ?';
                con.query(sql, [year, semester], (err, result) => {
                    return err ? resolve([false]) : resolve(result);
                });
            }
        ])
    });
}

// TODO: for administrator.js and student.js
function getNextSemClasses(con) { // TODO: Akbar, you can move this
    /* 
    Purpose: Retrieves an array of all classes taking place during the next semester as objects
    Input:
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If an error occurs, returns an array with only one element of false (i.e. [false])
        If next semester is not assigned yet in the DB, returns an empty array.
        If there are no classes yet for the next semester, returns an empty array. 
        Otherwise, returns an array of objects that contain the classes' informations in each object.
    */
    // TODO: repetitive code
    return new Promise((resolve, reject) => {
        async.waterfall([
            function getNextSemester(callback) {
                con.query('SELECT Name, Year FROM NextSemester ORDER BY DateAdded DESC LIMIT 1', (err, result) => {
                    if (result.length === 0) {
                        callback(null, false, '', '');
                        return resolve([]);
                    }
                    callback(null, true, result[0]['Year'], result[0]['Name']);
                });
            },
            function execute(verification, year, semester) {
                if (!verification) return;
                let sql = 'SELECT Class.Id AS ClassId, Class.CourseId, Course.Title, Class.Section, Instructor.Name AS Instructor, Class.Year, Class.Semester, Department.Name AS Department, Course.Credits, Course.Cost \
                                FROM Class \
                                JOIN Course ON Class.CourseId = Course.Id \
                                JOIN Instructor ON Class.Instructor = Instructor.Id \
                                JOIN Department ON Course.Dept = Department.Id \
                                WHERE Class.Year = ? AND Class.Semester = ?';
                con.query(sql, [year, semester], (err, result) => {
                    return err ? resolve([false]) : resolve(result);
                });
            }
        ])
    });
}

function updateClass(courseId, currSection, currYear, currSemester, newSection, newInstructor, newYear, newSemester, con) {
    /* 
    Purpose: Updates a class's information in the DB
    Warning: 
        newInstructor must already be in Instructor table's Id column
        newSemester must already be in Semester table's Name column
        There must be a current semester and next semester assigned in the DB.
    Input:
        courseId: course ID of class that is being updated in Class table [int]
        currSection: current section of class that is being updated in Class table [string]
        currYear: current year of class that is being updated in Class table [int]
        currSemester: current semester of class that is being updated in Class table [string]
        newSection: new section of class that is being updated in Class table (can be the same as the current section, cannot be null) [string]
        newInstructor: new ID of the instructor that teaches the class (can be the same as the current instructor, same ID as the one in the Instructor table, int)
        newYear: new year of class that is being updated in Class table (cannot be null) [int)
        newSemester: new semester of class that is being updated in Class table (same as the name in the Semester table, cannot be null) [string]
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If the newYear and newSemester does not belong to the current or next semester, returns [false, 'Desired year or semester does not belong to the current or next semesters'].
        If no such row in the Class table has a matching courseId, currSection, currYear, and currSemester, returns [false, 'No rows affected'].
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Name' at row 1"]).
    */
    let sql = 'UPDATE Class \
                SET Section = ?, \
                    Instructor = ?, \
                    Year = ?, \
                    Semester = ? \
                WHERE CourseId = ? AND \
                    Section = ? AND \
                    Year = ? AND \
                    Semester = ?';
    return new Promise((resolve, reject) => {
        async.waterfall([
            function verify(callback) {
                con.query('SELECT Name, Year FROM CurrentSemester ORDER BY DateAdded DESC LIMIT 1; \
                           SELECT Name, Year FROM NextSemester ORDER BY DateAdded DESC LIMIT 1;', (err, result) => {
                    let currSem = result[0][0]['Name'];
                    let currYear = result[0][0]['Year'];
                    let nextSem = result[1][0]['Name'];
                    let nextYear = result[1][0]['Year'];
                    if ((currSem !== newSemester || currYear !== newYear) && (nextSem !== newSemester || nextYear !== newYear)) {
                        callback(null, false);
                        return resolve([false, 'Desired year or semester does not belong to the current or next semesters']);
                    }
                    callback(null, true);
                });
            },
            function execute(verification) {
                if (!verification) return;
                con.query(sql, [newSection, newInstructor, newYear, newSemester, courseId, currSection, currYear, currSemester], (err, result) => {
                    return err ? resolve([false, err.sqlMessage]) : result.affectedRows > 0 ? resolve([true]) : resolve([false, 'No rows affected']);
                });
            }
        ]);
    });
}

function deleteClass(courseId, section, year, semester, con) {
    /* 
    Purpose: Deletes a class in the DB if it exists 
    Warning:
        There must be a next semester assigned in the DB.
    Input:
        courseId: course ID for the to-be deleted class [int]
        section: section of the to-be deleted class [string]
        year: the year in which the to-be deleted class takes place (int)
        semester: the semester in which the to-be deleted class takes place [string]
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If the year and semester does not belong to the next semester, returns [false, 'Year or semester does not belong to the next semester'] (cannot delete classes from the past or present)
        If a matching courseId, section, year, and semester does not exist in DB, returns [false, 'No rows affected'].
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Id' at row 1"]).
    */
    let sql = 'DELETE FROM Class WHERE CourseId = ? AND Section = ? AND Year = ? AND Semester = ?';
    return new Promise((resolve, reject) => {
        async.waterfall([
            function verify(callback) {
                con.query('SELECT Name, Year FROM NextSemester ORDER BY DateAdded DESC LIMIT 1', (err, result) => {
                    let nextSem = result[0];
                    if (nextSem['Name'] !== semester || nextSem['Year'] !== year) {
                        callback(null, false);
                        return resolve([false, 'Year or semester does not belong to the next semester']);
                    }
                    callback(null, true);
                });
            },
            function execute(verification) {
                if (!verification) return;
                con.query(sql, [courseId, section, year, semester], (err, result) => {
                    return err ? resolve([false, err.sqlMessage]) : result.affectedRows > 0 ? resolve([true]) : resolve([false, 'No rows affected']);
                });
            }
        ]);
    });
}

function createStudent(id, name, ssn, con) {
    /* 
    Purpose: Creates a pending student in the DB
    Input:
        id: student ID number of the potential student to be inserted in the Id column of Student table (must specify a specify a unique ID number; cannot be null) [int]
        name: full name of the potential student to be inserted in the Name column of Student table [string]
        ssn: Social Security Number of the potential student to be inserted in SSN column of Student table [int]
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Name' at row 1"]).
    */
    let sql = 'INSERT INTO Student(Id, Name, Credits, Registered, Probation, SSN) VALUES (?)';
    return new Promise((resolve, reject) => {
        con.query(sql, [[id, name, 0, true, false, ssn]], (err, result) => {
            return err ? resolve([false, err.sqlMessage]) : resolve([true]);
        });
    });
}

function assignGraduation(id, con) {
    /* 
    Purpose: Marks a student as having graduated in the DB (deregisters the student)
    Input:
        id: student ID number of the student [int]
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is no matching id, returns [false, 'No matching id'].
        If the student is not registered as a student anymore (may have already graduated, transferred, or got kicked out), returns [false, 'Not registered as a student anymore'].
        If student is on probation, returns [false, 'Student on probation'].
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Name' at row 1"]).
    */
    let sql = 'UPDATE Student SET Registered = false WHERE Id = ?';
    return new Promise((resolve, reject) => {
        async.waterfall([
            function verify(callback) {
                con.query('SELECT Registered, Probation FROM Student WHERE Id = ?', id, (err, result) => {
                    if (result.length === 0) {
                        callback(null, false);
                        return resolve([false, 'No matching id']);
                    }
                    if (result[0]['Registered'] === 0) {
                        callback(null, false);
                        return resolve([false, 'Not registered as a student anymore']);
                    }
                    if (result[0]['Probation'] === 1) {
                        callback(null, false);
                        return resolve([false, 'Student on probation']);
                    }
                    callback(null, true);
                });
            },
            function execute(verification) {
                if (!verification) return;
                con.query(sql, id, (err, result) => {
                    return err ? resolve([false, err.sqlMessage]) : result.affectedRows > 0 ? resolve([true]) : resolve([false, 'No rows affected']);
                });
            }
        ]);
    });
}

function assignProbation(id, con) {
    /* 
    Purpose: Puts a student on probation in the DB
    Input:
        id: student ID number of the student [int]
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is no matching id, returns [false, 'No matching id'].
        If student is not registered anymore, returns [false, 'Student not registered anymore'].
        If student is already on probation, returns [false, 'Student already on probation'].
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Name' at row 1"]).
    */
    let sql = 'UPDATE Student SET Probation = true WHERE Id = ?';
    return new Promise((resolve, reject) => {
        async.waterfall([
            function verify(callback) {
                con.query('SELECT Registered, Probation FROM Student WHERE Id = ?', id, (err, result) => {
                    if (result.length === 0) {
                        callback(null, false);
                        return resolve([false, 'No matching id']);
                    }
                    if (result[0].Registered === 0) {
                        callback(null, false);
                        return resolve([false, 'Student not registered anymore']);
                    }
                    if (result[0].Probation === 1) {
                        callback(null, false);
                        return resolve([false, 'Student already on probation']);
                    }
                    callback(null, true);
                });
            },
            function execute(verification) {
                if (!verification) return;
                con.query(sql, id, (err, result) => {
                    return err ? resolve([false, err.sqlMessage]) : result.affectedRows > 0 ? resolve([true]) : resolve([false, 'No rows affected']);
                });
            }
        ]);
    });
}

function removeProbation(id, con) { // TODO: Akbar, you can move this
    /* 
    Purpose: Removes probation status for a student in the DB
    Input:
        id: student ID number of the student [int]
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is no matching id, returns [false, 'No matching id'].
        If student is not on probation, returns [false, 'Student not currently on probation'].
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Name' at row 1"]).
    */
    let sql = 'UPDATE Student SET Probation = false WHERE Id = ?';
    return new Promise((resolve, reject) => {
        async.waterfall([
            function verify(callback) {
                con.query('SELECT Registered, Probation FROM Student WHERE Id = ?', id, (err, result) => {
                    if (result.length === 0) {
                        callback(null, false);
                        return resolve([false, 'No matching id']);
                    }
                    if (result[0].Probation === 0) {
                        callback(null, false);
                        return resolve([false, 'Student not currently on probation']);
                    }
                    callback(null, true);
                });
            },
            function execute(verification) {
                if (!verification) return;
                con.query(sql, id, (err, result) => {
                    return err ? resolve([false, err.sqlMessage]) : result.affectedRows > 0 ? resolve([true]) : resolve([false, 'No rows affected']);
                });
            }
        ]);
    });
}

// TODO: for instructor.js
function getMyCurrentlyTaughtClasses(id, con) { // TODO: Akbar, you can move this
    /* 
    Purpose: Retrieves an array of all classes an instructor is teaching for the current semester
    Input:
        id: id of instructor [int]
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If an error occurs, returns an array with only one element of false (i.e. [false])
        If the id does not match an instructor id, returns [false, 'No matching instructor id']
        If current semester is not assigned yet in the DB, returns an empty array.
        If the instructor is not teaching any classes yet for the current semester, returns an empty array. 
        Otherwise, returns an array of objects that contain the classes' information in each object.
    */
    return new Promise((resolve, reject) => {
        async.waterfall([
            function verifyInstructor(callback) {
                con.query('SELECT Id FROM Instructor WHERE Id = ?', id, (err, result) => {
                    if (result.length === 0) {
                        callback(null, false);
                        return resolve([false, 'No matching instructor id']);
                    }
                    callback(null, true);
                });
            },
            function getCurrentSemester(verification, callback) {
                if (!verification) return;
                con.query('SELECT Name, Year FROM CurrentSemester ORDER BY DateAdded DESC LIMIT 1', (err, result) => {
                    if (result.length === 0) {
                        callback(null, false, '', '');
                        return resolve([]);
                    }
                    callback(null, true, result[0]['Year'], result[0]['Name']);
                });
            },
            function execute(verification, year, semester) {
                if (!verification) return;
                let sql = 'SELECT Class.Id AS ClassId, Class.CourseId, Course.Title, Class.Section, Class.Year, Class.Semester, Department.Name AS Department, Course.Credits, Course.Cost \
                            FROM Class \
                            JOIN Course ON Class.CourseId = Course.Id \
                            JOIN Department ON Course.Dept = Department.Id \
                            WHERE Class.Instructor = ? AND Class.Year = ? AND Class.Semester = ?';
                con.query(sql, [id, year, semester], (err, result) => {
                    return err ? resolve([false]) : resolve(result);
                });
            }
        ])
    });
}

// TODO: for instructor.js
function getMyTaughtClasses(id, con) { // TODO: Akbar, you can move this
    /* 
    Purpose: Retrieves an array of all classes an instructor has taught, is currently teaching, or will teach
    Input:
        id: id of instructor [int]
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If an error occurs, returns an array with only one element of false (i.e. [false])
        If the id does not match an instructor id, returns [false, 'No matching instructor id']
        If the instructor has not taught classes in the past, is not currently teaching, and not yet teaching any class in the future, returns an empty array. 
        Otherwise, returns an array of objects that contain the classes' information in each object.
    */
    return new Promise((resolve, reject) => {
        async.waterfall([
            function verifyInstructor(callback) {
                con.query('SELECT Id FROM Instructor WHERE Id = ?', id, (err, result) => {
                    if (result.length === 0) {
                        callback(null, false);
                        return resolve([false, 'No matching instructor id']);
                    }
                    callback(null, true);
                });
            },
            function execute(verification) {
                if (!verification) return;
                let sql = 'SELECT Class.Id AS ClassId, Class.CourseId, Course.Title, Class.Section, Class.Year, Class.Semester, Department.Name AS Department, Course.Credits, Course.Cost \
                                FROM Class \
                                JOIN Course ON Class.CourseId = Course.Id \
                                JOIN Department ON Course.Dept = Department.Id \
                                WHERE Class.Instructor = ?';
                con.query(sql, id, (err, result) => {
                    return err ? resolve([false]) : resolve(result);
                });
            }
        ])
    });
}

// TODO: for student.js
function getMyCurrentEnrollments(id, con) { // TODO: Akbar, you can move this
    /* 
    Purpose: Retrieves an array of all classes a student is currently taking
    Input:
        id: id of student [int]
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If an error occurs, returns an array with only one element of false (i.e. [false])
        If the id does not match a student id, returns [false, 'No matching student id'].
        If current semester is not assigned yet in the DB, returns an empty array.
        If the student is not currently taking any classes, returns an empty array. 
        Otherwise, returns an array of objects that contain the classes' information in each object.
    */
    return new Promise((resolve, reject) => {
        async.waterfall([
            function verifyStudentId(callback) {
                con.query('SELECT Id FROM Student WHERE Id = ?', id, (err, result) => {
                    if (err | result.length === 0) {
                        callback(null, false);
                        return resolve([false, 'No matching student id']);
                    }
                    callback(null, true);
                })
            },
            function getCurrentSemester(verification, callback) {
                if (!verification) return;
                con.query('SELECT Name, Year FROM CurrentSemester ORDER BY DateAdded DESC LIMIT 1', (err, result) => {
                    if (result.length === 0) {
                        callback(null, false, '', '');
                        return resolve([]);
                    }
                    callback(null, true, result[0]['Year'], result[0]['Name']);
                });
            },
            function execute(verification, year, semester) {
                if (!verification) return;
                let sql = 'SELECT Class.Id AS ClassId, Class.CourseId, Course.Title, Class.Section, Instructor.Name AS Instructor, Class.Year, Class.Semester, Department.Name AS Department, Course.Credits, Course.Cost\
                            FROM Enrollment \
                            JOIN Class ON Enrollment.ClassId = Class.Id \
                            JOIN Course ON Class.CourseId = Course.Id \
                            JOIN Instructor ON Class.Instructor = Instructor.Id \
                            JOIN Department ON Course.Dept = Department.Id \
                            WHERE Enrollment.StudentId = ? AND Class.Year = ? AND Class.Semester = ?'
                con.query(sql, [id, year, semester], (err, result) => {
                    return err ? resolve([false]) : resolve(result);
                });
            }
        ]);
    });
}

function getMyNextEnrollments(id, con) { // TODO: Akbar, you can move this
    /* 
    Purpose: Retrieves an array of all classes a student will take next semester
    Input:
        id: id of student [int]
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If an error occurs, returns an array with only one element of false (i.e. [false])
        If the id does not match a student id, returns [false, 'No matching student id'].
        If next semester is not assigned yet in the DB, returns an empty array.
        If the student is not currently enrolled in any classes for next semester, returns an empty array. 
        Otherwise, returns an array of objects that contain the classes' information in each object.
    */
    return new Promise((resolve, reject) => {
        async.waterfall([
            function verifyStudentId(callback) {
                con.query('SELECT Id FROM Student WHERE Id = ?', id, (err, result) => {
                    if (err | result.length === 0) {
                        callback(null, false);
                        return resolve([false, 'No matching student id']);
                    }
                    callback(null, true);
                })
            },
            function getNextSemester(verification, callback) {
                if (!verification) return;
                con.query('SELECT Name, Year FROM NextSemester ORDER BY DateAdded DESC LIMIT 1', (err, result) => {
                    if (result.length === 0) {
                        callback(null, false, '', '');
                        return resolve([]);
                    }
                    callback(null, true, result[0]['Year'], result[0]['Name']);
                });
            },
            function execute(verification, year, semester) {
                if (!verification) return;
                let sql = 'SELECT Class.Id AS ClassId, Class.CourseId, Course.Title, Class.Section, Instructor.Name AS Instructor, Class.Year, Class.Semester, Department.Name AS Department, Course.Credits, Course.Cost \
                                FROM Enrollment \
                                JOIN Class ON Enrollment.ClassId = Class.Id \
                                JOIN Course ON Class.CourseId = Course.Id \
                                JOIN Instructor ON Class.Instructor = Instructor.Id \
                                JOIN Department ON Course.Dept = Department.Id \
                                WHERE Enrollment.StudentId = ? AND Class.Year = ? AND Class.Semester = ?'
                con.query(sql, [id, year, semester], (err, result) => {
                    return err ? resolve([false]) : resolve(result);
                });
            }
        ]);
    });
}

// TODO: for student.js
function getAllMyEnrollments(id, con) { // TODO: Akbar, you can move this
    /* 
   Purpose: Retrieves an array of all classes a student has taken, currently taking, and will take (all enrollments)
   Input:
       id: id of student [int]
       con: connection to DB (result of createConnection() method)
   Output: [Promise]
       If an error occurs, returns an array with only one element of false (i.e. [false])
       If the id does not match a student id, returns [false, 'No matching student id'].
       If the student has not taken classes in the past, not currently taking any classes, and not yet enrolled in any classes in the future, returns an empty array. 
       Otherwise, returns an array of objects that contain the classes' information in each object.
   */
    return new Promise((resolve, reject) => {
        async.waterfall([
            function verifyStudentId(callback) {
                con.query('SELECT Id FROM Student WHERE Id = ?', id, (err, result) => {
                    if (err | result.length === 0) {
                        callback(null, false);
                        return resolve([false, 'No matching student id']);
                    }
                    callback(null, true);
                })
            },
            function execute(verification) {
                if (!verification) return;
                let sql = 'SELECT Class.Id AS ClassId, Class.CourseId, Course.Title, Class.Section, Instructor.Name AS Instructor, Class.Year, Class.Semester, Department.Name AS Department, Course.Credits, Course.Cost \
                                    FROM Enrollment \
                                    JOIN Class ON Enrollment.ClassId = Class.Id \
                                    JOIN Course ON Class.CourseId = Course.Id \
                                    JOIN Instructor ON Class.Instructor = Instructor.Id \
                                    JOIN Department ON Course.Dept = Department.Id \
                                    WHERE Enrollment.StudentId = ? \
                                    ORDER BY YEAR DESC'
                con.query(sql, id, (err, result) => {
                    return err ? resolve([false]) : resolve(result);
                });
            }
        ]);
    });
}

// TODO: for student.js
function viewMyGrades(id, con) { // TODO: Akbar, you can move this
    /* 
    Purpose: Retrieves an array of all grades a student has received from their enrollments
    Input:
        id: id of student [int]
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If an error occurs, returns an array with only one element of false (i.e. [false])
        If the id does not match a student id, returns [false, 'No matching student id'].
        If the student has not received any grades yet, returns an empty array. 
        Otherwise, returns an array of objects that contain the classes' information and grade in each object.
    */
    return new Promise((resolve, reject) => {
        async.waterfall([
            function verifyStudentId(callback) {
                con.query('SELECT Id FROM Student WHERE Id = ?', id, (err, result) => {
                    if (err | result.length === 0) {
                        callback(null, false);
                        return resolve([false, 'No matching student id']);
                    }
                    callback(null, true);
                })
            },
            function execute(verification) {
                if (!verification) return;
                let sql = 'SELECT Class.Id AS ClassId, Class.CourseId, Course.Title, Class.Section, Instructor.Name AS Instructor, Class.Year, Class.Semester, Department.Name AS Department, Course.Credits, Course.Cost, Enrollment.Grade\
                                FROM Enrollment \
                                JOIN Class ON Enrollment.ClassId = Class.Id \
                                JOIN Course ON Class.CourseId = Course.Id \
                                JOIN Instructor ON Class.Instructor = Instructor.Id \
                                JOIN Department ON Course.Dept = Department.Id \
                                WHERE Enrollment.StudentId = ? AND Enrollment.Grade IS NOT NULL'
                con.query(sql, id, (err, result) => {
                    return err ? resolve([false]) : resolve(result);
                });
            }
        ]);
    });

}

// TODO: for instructor.js
function assignGrade(instructorId, classId, studentId, grade, con) { // TODO: Akbar, you can move this
    /* 
    Purpose: Instructor assigns student's final grade for a class that they teach and student is current enrolled in
    Warning: 
        grade must already be in Grade table's Name column // TODO: add a check for this (not immediately necessary)
        There must be a current semester assigned in the DB. // TODO: change this (not immediately necessary)
    Input:
        instructorId: ID of the instructor [int]
        classId: class ID for the class the instructor teaches and student is enrolled in [int]
        studentId: ID of the student [int]
        grade: grade the instructor assigns to student [string]
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If there is no matching classId with enrolled students, returns [false, 'No matching classId'].
        If there is no matching instructorId, returns [false, 'No matching instructorId for this class'].
        If the class is taught by another instructor, returns [false, 'Can only assign grades for classes that you teach'].
        If the class is not taking place during the current semester, returns [false, 'Can only assign grades for classes taking place during the current semester'].
        If there is no matching studentId, returns [false, 'No matching studentId for this class'].
        If grade is already assigned, returns [false, 'Grade already assigned for this student'].
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Name' at row 1"]).
    */
    return new Promise((resolve, reject) => {
        async.waterfall([
            function verifyClassId(callback) {
                con.query('SELECT ClassId FROM Enrollment WHERE ClassId = ?', classId, (err, result) => {
                    if (err | result.length === 0) {
                        callback(null, false);
                        return resolve([false, 'No matching classId']);
                    }
                    callback(null, true);
                });
            },
            function verifyInstructorId(verification, callback) {
                if (!verification) return;
                let sql = 'SELECT Class.Instructor \
                            FROM Enrollment \
                            JOIN Class ON Enrollment.ClassId = Class.Id \
                            WHERE Enrollment.ClassId = ? AND Class.Instructor = ?'
                con.query(sql, [classId, instructorId], (err, result) => {
                    if (err | result.length === 0) {
                        callback(null, false);
                        return resolve([false, 'No matching instructorId for the class']);
                    }
                    callback(null, true);
                });
            },
            function verifyInstructorTeachesClass(verification, callback) {
                if (!verification) return;
                con.query('SELECT Instructor, Year, Semester FROM Class WHERE Id = ? AND Instructor = ?', [classId, instructorId], (err, result) => {
                    if (err | result.length === 0) {
                        callback(null, false, '', '');
                        return resolve([false, 'Can only assign grades for classes that you teach']);
                    }
                    callback(null, true, result[0]['Year'], result[0]['Semester']);
                });
            },
            function verifySemester(verification, year, semester, callback) {
                if (!verification) return;
                con.query('SELECT Name, Year FROM CurrentSemester ORDER BY DateAdded DESC LIMIT 1', (err, result) => {
                    let currSem = result[0]['Name'];
                    let currYear = result[0]['Year'];
                    if (currSem !== semester || currYear !== year) {
                        callback(null, false);
                        return resolve([false, 'Can only assign grades for classes taking place during the current semester']);
                    }
                    callback(null, true);
                });
            },
            function verifyStudentId(verification, callback) {
                if (!verification) return;
                con.query('SELECT StudentId FROM Enrollment WHERE StudentId = ? AND ClassId = ?', [studentId, classId], (err, result) => {
                    if (err || result.length === 0) {
                        callback(null, false);
                        return resolve([false, 'No matching studentId for this class']);
                    }
                    callback(null, true);
                });
            },
            function verifyNoPrevGrade(verification, callback) {
                if (!verification) return;
                con.query('SELECT Grade FROM Enrollment WHERE ClassId = ? AND StudentId = ?', [classId, studentId], (err, result) => {
                    if (result[0]['Grade'] !== null) {
                        callback(null, false);
                        return resolve([false, 'Grade already assigned for this student']);
                    }
                    callback(null, true);
                });
            },
            function execute(verification, args) {
                if (!verification) return;
                let sql = 'UPDATE Enrollment \
                            SET Grade = ? \
                            WHERE ClassId = ? AND StudentId = ?';
                con.query(sql, [grade, classId, studentId], (err, result) => {
                    return err ? resolve([false, err.sqlMessage]) : resolve([true]);
                });
            }
        ]);
    });
}

function createAdministratorLogin(email, password, con) { // TODO: Akbar, you can move this
    /* 
    Purpose: Allows for an administrator create an account for another administrator
    Input:
        email: email address of the new administrator (must be unique; not used by other administrators) [string]
        password: password for the new administrator's account [string]
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If email is not a valid email, returns [false, 'Email not valid'].
        If email is already used by an administrator account, returns [false, 'Email address already used by an administrator account'].
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Name' at row 1"]).
    */
    // TODO: improvements can be done (not immediately necessary)
    return new Promise((resolve, reject) => {
        let emailValidator = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/; // TODO: not necessary to use regex
        if (!emailValidator.test(email)) return resolve([false, 'Email not valid']); // TODO: update here after changing regex
        async.waterfall([
            function verifyUniqueEmail(callback) {
                con.query("SELECT Email FROM Login WHERE Email = ? AND AccountType = 'Administrator'", email, (err, result) => {
                    if (result.length > 0) {
                        callback(null, false);
                        return resolve([false, 'Email address already used by an administrator account']);
                    }
                    callback(null, true);
                });
            },
            function execute(verification) {
                if (!verification) return;
                let sql = 'INSERT INTO Login VALUES (?)';
                con.query(sql, [[email, password, 'Administrator']], (err, result) => {
                    return err ? resolve([false, err.sqlMessage]) : resolve([true]);
                });
            }
        ]);
    })
}

// TODO: for instructor.js
function registerAsInstructor(id, name, email, password, con) {
    /* 
    Purpose: Instructor creates an account by specifying id, name, and email for verification and updates Login table with the instructor's email and password
    Input:
        id: ID number of the instructor [int]
        name: full name of the instructor [string]
        email: email address of the instructor [string]
        password: instructor's password of choice [string] // TODO: would be good to check that password contains some content and not null (not immediately necessary)
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If email is not a valid email, returns [false, 'Email not valid'].
        If email is already used by an instructor account, returns [false, 'Email address already used by an instructor account'].
        If id, name, or email is incorrect, or a collection of these is incorrect, returns [false, 'No matching instructor information with id, name, and email given'].
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Name' at row 1"]).
    */
    let emailValidator = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/; // TODO: not necessary to use regex
    return new Promise((resolve, reject) => {
        if (!emailValidator.test(email)) return resolve([false, 'Email not valid']); // TODO: update here after changing regex
        async.waterfall([
            function verifyUniqueEmail(callback) {
                con.query("SELECT Email FROM Login WHERE Email = ? AND AccountType = 'Instructor'", email, (err, result) => {
                    if (result.length > 0) {
                        callback(null, false);
                        return resolve([false, 'Email address already used by an instructor account']);
                    }
                    callback(null, true);
                });
            },
            function verifyInstructor(verification, callback) {
                if (!verification) return;
                let sql = "SELECT Id, Name, Email FROM Instructor WHERE Id = ? AND Name = ? AND Email = ?";
                con.query(sql, [id, name, email], (err, result) => {
                    if (err) {
                        callback(null, false);
                        return resolve([false, err.sqlMessage]);
                    }
                    if (result.length === 0) {
                        callback(null, false);
                        return resolve([false, 'No matching instructor information with id, name, and email given']);
                    }
                    callback(null, true);
                });
            },
            function executeLogin(verification) {
                if (!verification) return;
                let sql = 'INSERT INTO Login VALUES (?)';
                con.query(sql, [[email, password, 'Instructor']], (err, result) => {
                    return err ? resolve([false, err.sqlMessage]) : resolve([true]);
                });
            }
        ]);
    });
}

// TODO: for student.js
function registerAsStudent(id, name, ssn, email, password, con) { // TODO: Akbar, you can move this
    /* 
    Purpose: Student creates an account by specifying id, name, and ssn for verification and updates the email column in the Student table to the email of their choice and updates Login table with the student's email and password
    Input:
        id: student ID number of the student [int]
        name: full name of the student [string]
        ssn: Social Security Number of the student [int]
        email: student's email of choice (must be unique; not used by other students) [string]
        password: student's password of choice [string] // TODO: would be good to check that password contains some content and not null
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If email is not a valid email, returns [false, 'Email not valid'].
        If email is already used by a student, returns [false, 'Email address already used by a student account'].
        If id, name, or ssn is incorrect, or a collection of these is incorrect, returns [false, 'No matching student information with id, name, and ssn given'].
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Name' at row 1"]).
    */
    let emailValidator = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/; // TODO: not necessary to use regex
    let studentSQL = 'UPDATE Student \
                        SET Email = ? \
                        WHERE Id = ? AND Name = ? AND SSN = ?';
    let loginSQL = 'INSERT INTO Login VALUES (?)';
    return new Promise((resolve, reject) => {
        if (!emailValidator.test(email)) return resolve([false, 'Email not valid']); // TODO: update here after changing regex
        async.waterfall([
            function verifyUniqueEmail(callback) {
                con.query('SELECT Email FROM Student WHERE Email = ?', email, (err, result) => {
                    if (result.length > 0) {
                        callback(null, false);
                        return resolve([false, 'Email address already used by a student account']);
                    }
                    callback(null, true);
                });
            },
            function executeStudent(verification, callback) {
                if (!verification) return;
                con.query(studentSQL, [email, id, name, ssn], (err, result) => {
                    if (err) {
                        callback(null, false);
                        return resolve([false, err.sqlMessage]);
                    }
                    if (result.affectedRows === 0) {
                        callback(null, false);
                        return resolve([false, 'No matching student information with id, name, and ssn given']);
                    }
                    callback(null, true);
                });
            },
            function executeLogin(verification) {
                if (!verification) return;
                con.query(loginSQL, [[email, password, 'Student']], (err, result) => {
                    return err ? resolve([false, err.sqlMessage]) : resolve([true]);
                });
            }
        ]);
    });
}

function verifyAdministratorLogin(email, password, con) {
    /* 
    Purpose: Verifies administrator login
    Input:
        email: email of administrator [string]
        password: password of administrator [string]
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If an error occurs, returns an array with only one element of false (i.e. [false])
        If there is no matching administrator account with the email and password, returns [false, 'No matching account'].
        If there is a matching administrator account with the email and password, returns [true].
    */
    return new Promise((resolve, reject) => {
        let sql = "SELECT Email, Password FROM Login WHERE Email = ? AND Password = ? AND AccountType = 'Administrator'";
        con.query(sql, [email, password], (err, result) => {
            if (err) return resolve([false]);
            if (result.length > 0) return resolve([true]); // TODO: result.length > 0 preferred so check other functions (not immediately necessary)
            return resolve([false, 'No matching account']);
        })
    });
}

// TODO: for instructor.js
function verifyInstructorLogin(email, password, con) { // TODO: Akbar, you can move this
    /* 
    Purpose: Verifies instructor login
    Input:
        email: email of instructor [string]
        password: password of instructor [string]
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If an error occurs, returns an array with only one element of false (i.e. [false])
        If there is no matching instructor account with the email and password, returns [false, 'No matching account'].
        If there is a matching instructor account with the email and password, returns [true].
    */
    return new Promise((resolve, reject) => {
        let sql = "SELECT Email, Password FROM Login WHERE Email = ? AND Password = ? AND AccountType = 'Instructor'";
        con.query(sql, [email, password], (err, result) => {
            if (err) return resolve([false]);
            if (result.length > 0) return resolve([true]); // TODO: result.length > 0 preferred so check other functions (not immediately necessary)
            return resolve([false, 'No matching account']);
        })
    });
}

// TODO: for student.js
function verifyStudentLogin(email, password, con) { // TODO: Akbar, you can move this
    /* 
    Purpose: Verifies student login
    Input:
        email: email of student [string]
        password: password of student [string]
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If an error occurs, returns an array with only one element of false (i.e. [false])
        If there is no matching student account with the email and password, returns [false, 'No matching account'].
        If there is a matching student account with the email and password, returns [true].
    */
    // TODO: 3 verifyLogin functions can be formed into one helper function
    return new Promise((resolve, reject) => {
        let sql = "SELECT Email, Password FROM Login WHERE Email = ? AND Password = ? AND AccountType = 'Student'";
        con.query(sql, [email, password], (err, result) => {
            if (err) return resolve([false]);
            if (result.length > 0) return resolve([true]); // TODO: result.length > 0 preferred so check other functions (not immediately necessary)
            return resolve([false, 'No matching account']);
        })
    });
}

// TODO: for student.js
function getStudentIdFromEmail(email, con) { // TODO: Akbar, you can move this
    /* 
    Purpose: Gets the corresponding student ID number of an email address
    Input:
        email: email of student [string]
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If an error occurs, returns an array with only one element of false (i.e. [false])
        If no student is matched with the email address, returns [false, 'No matching student'].
        If a student is matched with the email address, returns an array where the second element contains the id of the student (i.e. [true, 123]).
    */
    return new Promise((resolve, reject) => {
        con.query('SELECT Id FROM Student WHERE Email = ?', email, (err, result) => { // TODO: don't declare let sql where there are short queries
            if (err) return resolve([false]);
            if (result.length === 0) return resolve([false, 'No matching student']);
            return resolve([true, result[0]['Id']]);
        });
    });
}

// TODO: for instructor.js
function getInstructorIdFromEmail(email, con) {
    /* 
    Purpose: Gets the corresponding instructor ID number of an email address
    Input:
        email: email of instructor [string]
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If an error occurs, returns an array with only one element of false (i.e. [false])
        If no instructor is matched with the email address, returns [false, 'No matching instructor'].
        If an instructor is matched with the email address, returns an array where the second element contains the id of the instructor (i.e. [true, 123]).
    */
    return new Promise((resolve, reject) => {
        con.query('SELECT Id FROM Instructor WHERE Email = ?', email, (err, result) => { // TODO: don't declare let sql where there are short queries
            if (err) return resolve([false]);
            if (result.length === 0) return resolve([false, 'No matching instructor']);
            return resolve([true, result[0]['Id']]);
        });
    });
}

// TODO: check if all features are implemented in the proposal

module.exports = {
    createAccountType,
    getAccountTypes,
    deleteAccountType,
    createDepartment,
    getDepartments,
    deleteDepartment,
    getGrades,
    createGrade,
    deleteGrade,
    getSemesters,
    deleteSemester,
    createSemester,
    assignCurrentSemester,
    assignNextSemester,
    getInstructors,
    createInstructor,
    deleteInstructor,
    createCourse,
    updateCourse,
    viewCourses,
    deleteCourse,
    createClass,
    updateClass,
    deleteClass,
    createStudent,
    assignGraduation,
    assignProbation,
    getMyCurrentEnrollments, // added by Saiful
    getMyNextEnrollments, // added by Saiful
    getAllMyEnrollments, // added by Saiful
    assignGrade, // added by Saiful
    viewMyGrades, // added by Saiful
    createAdministratorLogin, // added by Saiful
    registerAsInstructor, // added by Saiful
    registerAsStudent, // added by Saiful
    verifyAdministratorLogin, // added by Saiful
    verifyInstructorLogin, // added by Saiful
    verifyStudentLogin, // added by Saiful
    getStudentIdFromEmail, // added by Saiful
    getInstructorIdFromEmail // added by Saiful
};