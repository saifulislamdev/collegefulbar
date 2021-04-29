const express = require('express');
const app = express();
const async = require('async');
const con = require('./index').con;
const { create } = require('express-handlebars');

// TODO: put files in models folder

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
                    if (currSem['Name'] === name && currSem['Year'] === year) {
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
        email: email of the instructor (i.e. 'johndoe@gmail.com') to be inserted in the Email column of the Instructor table (must be unique; not used by other instructors) [null, empty string, string]
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
function getNextSemClasses() { // TODO: Akbar, you can move this
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
function getMyCurrentlyTaughtCourses() {
}

// TODO: for instructor.js
function getMyTaughtCourses() {
}

// TODO: for student.js
function getMyCurrentEnrollments() {
}

// TODO: for student.js
function getAllMyEnrollments() {
}

// TODO: for student.js
function viewMyGrades() {
}

// TODO: for instructor.js
function assignGrade() {
}

function createAdministratorLogin() {

}

// TODO: for instructor.js
function registerAsInstructor() {
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
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If email is not a valid email, returns [false, 'Email not valid'].
        If email is already used by a student, returns [false, 'Email address already used by a student'].
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
                        return resolve([false, 'Email address already used by a student']);
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

// TODO: for administrator.js
function verifyAdministratorLogin() {
}

// TODO: for instructor.js
function verifyInstructorLogin() {
}

// TODO: for student.js
function verifyStudentLogin() { // TODO: upto here
}

// TODO: for db-setup.js
function seed() {
}

// TODO: check if all features are implemented in the proposal


/* Testing */
(async () => {
    const res1 = await createAccountType('Administrator', con);
    const res2 = await createAccountType('Instructor', con);
    const res3 = await createAccountType('Student', con);
    const res4 = await createDepartment(1, 'Computer Science', con);
    const res5 = await createDepartment(2, 'Electrical Engineering', con);
    const res6 = await createDepartment(3, 'Computer Engineering', con);
    const res7 = await createGrade('A', con);
    const res8 = await createGrade('B', con);
    const res9 = await createGrade('C', con);
    const res10 = await createGrade('D', con);
    const res11 = await createGrade('F', con);
    const res12 = await createSemester('Winter', con);
    const res13 = await createSemester('Spring', con);
    const res14 = await createSemester('Summer', con);
    const res15 = await createSemester('Fall', con);
    const res16 = await assignCurrentSemester('Spring', 2021, con);
    const res17 = await assignNextSemester('Fall', 2021, con);
    const res18 = await createInstructor(1, 'John Connor', 'john.anthony.connor@gmail.com', con);
    const res19 = await createInstructor(2, 'Hesham Auda', 'hauda@ccny.cuny.edu', con);
    const res20 = await createInstructor(3, 'Akbar Islam', 'nysaifulislam@gmail.com', con);
    const res21 = await createInstructor(4, 'Akira Kawaguchi', 'akawaguchi@ccny.cuny.edu', con);
    const res22 = await createCourse(1, 'Database Systems', 1, 3, 1000.00, con);
    const res23 = await createCourse(2, 'Data Structures', 1, 3, 1000.00, con);
    const res24 = await createCourse(3, 'Algorithms', 1, 3, 1000.00, con);
    const res25 = await createClass(32157, 1, 'H', 1, 2021, 'Spring', con);
    const res26 = await createClass(32179, 1, 'M', 2, 2021, 'Spring', con);
    const res27 = await createClass(34280, 1, 'A', 4, 2021, 'Fall', con);
    const res28 = await createStudent(123, 'Saiful Islam', 123456789, con);
    const res29 = await createStudent(456, 'Akbar Haider', 111111111, con);

    // console.log(res);
})();

app.listen(5002, () => {
    console.log('Server Started on Port 5002');
});

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
    assignProbation
};