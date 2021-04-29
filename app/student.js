const express = require('express');
const app = express();
const async = require('async');
const con = require('./index').con;
const { create } = require('express-handlebars');
// TODO: for administrator and student.js
function viewCourses(con) {
    let sql = "SELECT * FROM course";
    return new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            return err ? resolve([false]) : resolve(result);
        });
    });
}


// TODO: for administrator.js and student.js
function getCurrentClasses() {
}

// TODO: for administrator.js and student.js
function getNextClasses() {
}

// TODO: for student.js
function enrollInClass(classId, courseId, section, year, semester, studentId, con) { // TODO: repeating code
    /* 
    Purpose: Student enrolls in a class (adds enrollment to Enrollment table) either through specifying classId (1) or courseId, section, year, and semester (2) (don't have to specify both groups)
    Input:
        classId: class ID for the class the student wants to enroll in (if null, checks the courseId, section, year, and semester instead, otherwise, doesn't check) [int]
        courseId: course ID of the class [int]
        section: section of the class [string]
        year: the year the class takes place [int]
        semester: the semester the class takes place [string]
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
    TODO: SWITCH THESE AROUND
        If the year and semester don't match either the current or next semesters, returns [false, 'Can only enroll in classes for current and next semesters'].
        If there is no matching classId (1) and no matching courseId, section, year, and semester (2), returns [false, 'No matching class'].
        If there is no matching studentId, returns [false, 'No matching studentId'].
        If student is not registered anymore, returns [false, 'Student not registered anymore'].
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Name' at row 1"]).
    */
   let sql = 'INSERT INTO Enrollment(ClassId, StudentId) VALUES (?)';
   return new Promise((resolve, reject) => {
       async.waterfall([
           function getAndVerifyClassId(callback) {
               con.query('SELECT Id, Year, Semester FROM Class WHERE Id = ?', classId, async (err, result) => {
                   if (classId === null) {
                       let classInfo = await getClassInfo(courseId, section, year, semester, con);
                       if (classInfo.length === 0) {
                           callback(null, false, []);
                           return resolve([false, 'No matching class']);
                        }
                        let classId = classInfo[0]['Id'];
                        var args1 = [[classId, studentId]];
                        var args2 = [classInfo[0]['Year'], classInfo[0]['Semester']];
                    } else {
                        if (result.length === 0) {
                            callback(null, false, []);
                            return resolve([false, 'No matching class']);
                        }
                        var args1 = [[classId, studentId]];
                        var args2 = [result[0]['Year'], result[0]['Semester']];
                    }
                    callback(null, true, args1, args2);
                });
            },
            function verifySemester(verification, args1, args2, callback) {
                if (!verification) return;
                let semester = args2[1];
                let year = args2[0];
                con.query('SELECT Name, Year FROM CurrentSemester ORDER BY DateAdded DESC LIMIT 1; \
                SELECT Name, Year FROM NextSemester ORDER BY DateAdded DESC LIMIT 1;', (err, result) => {
                    let currSem = result[0][0]['Name'];
                    let currYear = result[0][0]['Year'];
                    let nextSem = result[1][0]['Name'];
                    let nextYear = result[1][0]['Year'];
                    if ((currSem !== semester || currYear !== year) && (nextSem !== semester || nextYear !== year)) {
                        callback(null, false, []);
                        return resolve([false, 'Can only drop classes for current and next semesters']);
                    }
                    callback(null, true, args1);
                });
            },
            function verifyStudentId(verification, args, callback) {
                if (!verification) return;
                con.query('SELECT Registered from Student Where Id = ?', studentId, (err, result) => {
                    if (err || result.length === 0) { // TODO: would be good to do this everywhere (err)
                        callback(null, false, []);
                        return resolve([false, 'No matching studentId']);
                    }
                    if (result[0]['Registered'] === 0) {
                        callback(null, false, []);
                        return resolve([false, 'Student not registered anymore']);
                    }
                    callback(null, true, args);
                });
            },
            function execute(verification, args) {
                if (!verification) return;
                con.query(sql, args, (err, result) => {
                    return err ? resolve([false, err.sqlMessage]) : resolve([true]);
                });
            }
        ]);
    });
}

// TODO: for student.js
function getMyCurrentEnrollments() {
}

// TODO: for student.js
function getAllMyEnrollments() {
}

// TODO: for student.js
function dropClass(classId, courseId, section, year, semester, studentId, con) { // TODO: repeating code
    /* 
    Purpose: Student drops a class in their enrollments (adds enrollment to Enrollment table) either through specifying classId (1) or courseId, section, year, and semester (2) (don't have to specify both groups)
    Input:
        classId: class ID for the class the student wants to enroll in (if null, checks the courseId, section, year, and semester instead, otherwise, doesn't check) [int]
        courseId: course ID of the class [int]
        section: section of the class [string]
        year: the year the class takes place [int]
        semester: the semester the class takes place [string]
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If there is no matching classId (1) and no matching courseId, section, year, and semester (2), returns [false, 'No matching class'].
        If the year and semester don't match either the current or next semesters, returns [false, 'Can only drop classes for current and next semesters'].
        If there is no matching studentId, returns [false, 'No matching studentId'].
        If student is not registered anymore, returns [false, 'Student not registered anymore'].
        If student is not enrolled in the class, returns [false, 'Student not enrolled in this class'].
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Name' at row 1"]).
    */
   let sql = 'DELETE FROM Enrollment WHERE ClassId = ? AND StudentId = ?';
   return new Promise((resolve, reject) => {
       async.waterfall([
           function getAndVerifyClassId(callback) {
               con.query('SELECT Id, Year, Semester FROM Class WHERE Id = ?', classId, async (err, result) => {
                   if (classId === null) {
                       let classInfo = await getClassInfo(courseId, section, year, semester, con);
                       if (classInfo.length === 0) {
                           callback(null, false, [], []);
                           return resolve([false, 'No matching class']);
                        }
                        let classId = classInfo[0]['Id'];
                        var args1 = [[classId, studentId]];
                        var args2 = [classInfo[0]['Year'], classInfo[0]['Semester']];
                    } else {
                        if (result.length === 0) {
                            callback(null, false, [], []);
                            return resolve([false, 'No matching class']);
                        }
                        var args1 = [[classId, studentId]];
                        var args2 = [result[0]['Year'], result[0]['Semester']];
                    }
                    callback(null, true, args1, args2);
                });
            },
            function verifySemester(verification, args1, args2, callback) {
                if (!verification) return;
                let semester = args2[1];
                let year = args2[0];
                con.query('SELECT Name, Year FROM CurrentSemester ORDER BY DateAdded DESC LIMIT 1; \
                SELECT Name, Year FROM NextSemester ORDER BY DateAdded DESC LIMIT 1;', (err, result) => {
                    let currSem = result[0][0]['Name'];
                    let currYear = result[0][0]['Year'];
                    let nextSem = result[1][0]['Name'];
                    let nextYear = result[1][0]['Year'];
                    if ((currSem !== semester || currYear !== year) && (nextSem !== semester || nextYear !== year)) {
                        callback(null, false, []);
                        return resolve([false, 'Can only drop classes for current and next semesters']);
                    }
                    callback(null, true, args1);
                });
            },
            function verifyStudentId(verification, args, callback) {
                if (!verification) return;
                con.query('SELECT Registered FROM Student Where Id = ?', studentId, (err, result) => {
                    if (err || result.length === 0) {
                        callback(null, false, []);
                        return resolve([false, 'No matching studentId']);
                    }
                    if (result[0]['Registered'] === 0) {
                        callback(null, false, []);
                        return resolve([false, 'Student not registered anymore']);
                    }
                    callback(null, true, args);
                });
            },
            function verifyEnrollment(verification, args, callback) {
                if (!verification) return;
                con.query('SELECT ClassId, StudentId FROM Enrollment WHERE ClassId = ? AND StudentId = ?', args[0], (err, result) => {
                    if (result.length === 0) {
                        callback(null, false, []);
                        return resolve([false, 'Student not enrolled in this class']);
                    }
                    callback(null, true, args[0]);
                })
            },
            function execute(verification, args) {
                if (!verification) return;
                con.query(sql, args, (err, result) => {
                    return err ? resolve([false, err.sqlMessage]) : resolve([true]);
                });
            }
        ])
    });
}


// TODO: for student.js
function viewMyGrades() {
}

// TODO: for student.js
function registerAsStudent(id, name, ssn, email, con) { // TODO: ERROR HERE UPDATE THIS .. THEN TEST FROM HERE
    /* 
    Purpose: Student creates an account by specifying id, name, and ssn for verification and updates the email column in the Student table to the email of their choice
    Input:
        id: student ID number of the student [int]
        name: full name of the student [string]
        ssn: Social Security Number of the student [int]
        email: student's email of choice (must be unique; not used by other students) [string]
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If email is not a valid email, returns [false, 'Email not valid'].
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Name' at row 1"]).
    */
    let emailValidator = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/; // TODO: not necessary to use regex
    let sql = 'UPDATE Student \
                SET Email = ? \
                WHERE Id = ? AND Name = ? AND SSN = ?';
    return new Promise((resolve, reject) => {
        if (!emailValidator.test(email)) return resolve([false, 'Email not valid']); // TODO: update here after changing regex
        con.query(sql, [email, id, name, ssn], (err, result) => {
            return err ? resolve([false, err.sqlMessage]) : result.affectedRows > 0 ? resolve([true]) : resolve([false, 'No rows affected']);
        });
    });
}

// TODO: for student.js
function verifyStudentLogin() {
}