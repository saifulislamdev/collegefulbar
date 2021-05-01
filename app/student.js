const express = require('express');
const app = express();
const async = require('async');
const con = require('./index').con;
const { create } = require('express-handlebars');
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
function viewCourses(con) {
    let sql = "SELECT * FROM course";
    return new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            return err ? resolve([false]) : resolve(result);
        });
    });
}

// TODO: for student.js
function enrollInClass(classId, courseId, section, year, semester, studentId, con) { // TODO: repeating code
    /* 
    Purpose: Student enrolls in a class (adds enrollment to Enrollment table) either through specifying classId (1) or courseId, section, year, and semester (2) (don't have to specify both groups)
    Warning: There must be a current semester and next semester assigned in the DB. // TODO: change this (not immediately necessary)
    Input:
        classId: class ID for the class the student wants to enroll in (if null, checks the courseId, section, year, and semester instead, otherwise, doesn't check) [int]
        courseId: course ID of the class [int]
        section: section of the class [string]
        year: the year the class takes place [int]
        semester: the semester the class takes place [string]
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If there is no matching classId (1) and no matching courseId, section, year, and semester (2), returns [false, 'No matching class'].
        If the year and semester don't match either the current or next semesters, returns [false, 'Can only enroll in classes for current and next semesters'].
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
                        return resolve([false, 'Can only enroll in classes for current and next semesters']);
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

module.exports = {
    viewCourses,
    dropClass,
    enrollInClass,
    registerAsStudent,
    getCurrentSemClasses,
    getNextSemClasses,
    getMyNextEnrollments,
    getMyCurrentEnrollments, // added by Saiful
    getMyNextEnrollments, // added by Saiful
    getAllMyEnrollments, // added by Saiful
    viewMyGrades, // added by Saiful
    verifyStudentLogin, // added by Saiful
    getStudentIdFromEmail // added by Saiful
};