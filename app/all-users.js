const express = require('express');
const app = express();
const async = require('async');
const con = require('./index').con;
const { create } = require('express-handlebars');

// TODO: for all-users.js
function getClassInfo(courseId, section, year, semester, con) {
    /*
    Purpose: Helper function that gets class info for a certain class
    Input:
        courseId: course ID of the class (cannot be null) [int]
        section: section of the class (cannot be null) [string]
        year: the year the class takes place (cannot be null) [int]
        semester: the semester the class takes place (cannot be null) [string]
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If an error occurs, returns an array with only one element of false (i.e. [false])
        If there are no classes in the DB that match the arguments, returns an empty array. 
        Otherwise, returns an array with an object that contains the class's information in the object.
    */
    let sql = 'SELECT Class.Id AS ClassId, Class.CourseId, Course.Title, Class.Section, Instructor.Name AS Instructor, Class.Year, Class.Semester, Department.Name AS Department, Course.Credits, Course.Cost \
                FROM Class \
                JOIN Course ON Class.CourseId = Course.Id \
                JOIN Instructor ON Class.Instructor = Instructor.Id \
                JOIN Department ON Course.Dept = Department.Id \
                WHERE Class.CourseId = ? AND Class.Section = ? AND Class.Year = ? AND Class.Semester = ?';
    return new Promise((resolve, reject) => {
        con.query(sql, [courseId, section, year, semester], (err, result) => {
            return err ? resolve([false]) : resolve(result);
        });
    });
}

// TODO: for all-users.js
function getClasses(con) {
    /* 
    Purpose: Retrieves an array of all classes in the DB as objects
    Input:
        con: connection to DB (result of createConnection() method)
    Output: [Promise]
        If an error occurs, returns an array with only one element of false (i.e. [false])
        If there are no classes in the DB, returns an empty array. 
        Otherwise, returns an array of objects that contain the classes' informations in each object.
    */
    let sql = 'SELECT Class.Id, Class.CourseId, Course.Title, Class.Section, Instructor.Name, Class.Year, Class.Semester, Course.Dept, Course.Credits, Course.Cost \
                FROM Class \
                JOIN Course ON Class.CourseId = Course.Id \
                JOIN Instructor ON Class.Instructor = Instructor.Id';
    return new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            return err ? resolve([false]) : resolve(result);
        });
    });
}