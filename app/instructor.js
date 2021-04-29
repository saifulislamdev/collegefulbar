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
function assignGrade() {
}

// TODO: for instructor.js
function registerAsInstructor() {
    
}

// TODO: for instructor.js
function verifyInstructorLogin() {
}

// TODO: for instructor.js
function getMyCurrentlyTaughtCourses() {
}

// TODO: for instructor.js
function getMyTaughtCourses() {
}
