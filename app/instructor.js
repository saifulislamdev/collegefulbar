const express = require('express');
const app = express();
const async = require('async');
const con = require('./index').con;
const { create } = require('express-handlebars');

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

module.exports = {
    getMyCurrentlyTaughtClasses,
    getMyTaughtClasses,
<<<<<<< Updated upstream
    verifyInstructorLogin, // added by Saiful
    getInstructorIdFromEmail, // added by Saiful
    registerAsInstructor, // added by Saiful
    assignGrade // added by Saiful
=======
    getInstructorIdFromEmail,
    verifyInstructorLogin,
    assignGrade,
    registerAsInstructor
>>>>>>> Stashed changes
};