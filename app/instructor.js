const express = require('express');
const app = express();
const async = require('async');
const con = require('./index').con;
const { create } = require('express-handlebars');

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
        Otherwise, returns an array of objects that contain the classes' informations in each object.
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
        If the instructor has not taught classes in the past, is not currently teaching, and will not teach any class in the future, returns an empty array. 
        Otherwise, returns an array of objects that contain the classes' informations in each object.
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

module.exports = {
    getGrades,
    getMyCurrentlyTaughtClasses,
    getMyTaughtClasses,
    verifyInstructorLogin, // added by Saiful
    getInstructorIdFromEmail, // added by Saiful
    registerAsInstructor, // added by Saiful
    assignGrade // added by Saiful
};