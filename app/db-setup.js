const express = require('express');
const app = express();
const con = require('./index').con;

/* table creation statements */
/* NO foreign key constraints below */
const accountType = "CREATE TABLE IF NOT EXISTS AccountType(Name VARCHAR(255) PRIMARY KEY)";
const department = "CREATE TABLE IF NOT EXISTS Department(Id SMALLINT AUTO_INCREMENT PRIMARY KEY, Name VARCHAR(255))";
const grade = "CREATE TABLE IF NOT EXISTS Grade(Name VARCHAR(255) PRIMARY KEY)";
const instructor = "CREATE TABLE IF NOT EXISTS Instructor(Id INT PRIMARY KEY, Name VARCHAR(255), Email VARCHAR(255) UNIQUE)";
// const pendingStudent = "CREATE TABLE IF NOT EXISTS PendingStudent (\
//                             SSN VARCHAR(9) PRIMARY KEY, \
//                             Name VARCHAR(255), \
//                             Email VARCHAR(255) UNIQUE)";
const semester = "CREATE TABLE IF NOT EXISTS Semester(Name VARCHAR(255) PRIMARY KEY)";
const currentSemester = "CREATE TABLE IF NOT EXISTS CurrentSemester(\
                            Name VARCHAR(255), \
                            Year SMALLINT, \
                            DateAdded DATETIME PRIMARY KEY DEFAULT CURRENT_TIMESTAMP, \
                            FOREIGN KEY (Name) REFERENCES Semester(Name))";
const nextSemester = "CREATE TABLE IF NOT EXISTS NextSemester(\
                        Name VARCHAR(255), \
                        Year SMALLINT, \
                        DateAdded DATETIME PRIMARY KEY DEFAULT CURRENT_TIMESTAMP, \
                        FOREIGN KEY (Name) REFERENCES Semester(Name))";
const student = "CREATE TABLE IF NOT EXISTS Student (\
                    Id INT AUTO_INCREMENT PRIMARY KEY, \
                    Name VARCHAR(255), \
                    Email VARCHAR(255) UNIQUE, \
                    Credits SMALLINT, \
                    Registered BOOLEAN, \
                    Probation BOOLEAN, \
                    SSN VARCHAR(9))";
/* foreign key constraints below */
const course = "CREATE TABLE IF NOT EXISTS Course (\
                    Id INT PRIMARY KEY, \
                    Title VARCHAR(255), \
                    Dept SMALLINT, \
                    Credits SMALLINT, \
                    Cost DECIMAL(11,2), \
                    FOREIGN KEY (Dept) REFERENCES Department(Id))";
const classSQL = "CREATE TABLE IF NOT EXISTS Class (\
                    Id INT AUTO_INCREMENT PRIMARY KEY, \
                    CourseId INT, \
                    Section VARCHAR(255), \
                    Instructor INT, \
                    Year SMALLINT, \
                    Semester VARCHAR(255), \
                    UNIQUE (CourseId, Section, Year, Semester), \
                    FOREIGN KEY (CourseId) REFERENCES Course(Id), \
                    FOREIGN KEY (Instructor) REFERENCES Instructor(Id), \
                    FOREIGN KEY (Semester) REFERENCES Semester(Name))";
const enrollment = "CREATE TABLE IF NOT EXISTS Enrollment (\
                        ClassId INT, \
                        StudentId INT, \
                        Grade VARCHAR(255), \
                        PRIMARY KEY (ClassId, StudentId), \
                        FOREIGN KEY (ClassId) REFERENCES Class(Id), \
                        FOREIGN KEY (StudentId) REFERENCES Student(Id), \
                        FOREIGN KEY (Grade) REFERENCES Grade(Name))";
const login = "CREATE TABLE IF NOT EXISTS Login (\
                Email VARCHAR(255), \
                Password VARCHAR(255), \
                AccountType VARCHAR(255), \
                PRIMARY KEY (Email, AccountType), \
                FOREIGN KEY (AccountType) REFERENCES AccountType(Name))";
// TODO: create a CurrentSemester table (update in createTables() and deleteTables())

function createTable(sql, successIndicator, con) {
    /* helper function for createTables() */
    con.connect(function(err) {
        con.query(sql, function(err, result) {
            if (err) throw err;
            console.log(`${successIndicator} table created`);
        });
    });
}

function createTables(con) {
    /* creates all tables necessary for the DB */
    createTable(accountType, "AccountType", con);
    createTable(department, "Department", con);
    createTable(grade, "Grade", con);
    createTable(instructor, "Instructor", con);
    // createTable(pendingStudent, "PendingStudent", con);
    createTable(semester, "Semester", con);
    createTable(currentSemester, "CurrentSemester", con);
    createTable(nextSemester, "NextSemester", con);
    createTable(student, "Student", con);
    createTable(course, "Course", con);
    createTable(classSQL, "Class", con);
    createTable(enrollment, "Enrollment", con);
    createTable(login, "Login", con);
}

// creates all tables needed for the app
createTables(con);

function deleteTable(sql, successIndicator, con) {
    /* helper function for deleteTables() */
    con.connect(function(err) {
        con.query(sql, function(err, result) {
            if (err) throw err;
            console.log(`${successIndicator} table deleted`);
        });
    });
}

function deleteTables(con) {
    /* deletes all tables in the DB that the app uses */
    deleteTable("DROP TABLE IF EXISTS Login", "Login", con);
    deleteTable("DROP TABLE IF EXISTS ProgramAdvisor", "ProgramAdvisor", con);
    deleteTable("DROP TABLE IF EXISTS Enrollment", "Enrollment", con);
    deleteTable("DROP TABLE IF EXISTS Class", "Class", con);
    deleteTable("DROP TABLE IF EXISTS Course", "Course", con);
    deleteTable("DROP TABLE IF EXISTS Student", "Student", con);
    deleteTable("DROP TABLE IF EXISTS NextSemester", "NextSemester", con);
    deleteTable("DROP TABLE IF EXISTS CurrentSemester", "CurrentSemester", con);
    deleteTable("DROP TABLE IF EXISTS Semester", "Semester", con);
    deleteTable("DROP TABLE IF EXISTS PendingStudent", "PendingStudent", con);
    deleteTable("DROP TABLE IF EXISTS Instructor", "Instructor", con);
    deleteTable("DROP TABLE IF EXISTS Grade", "Grade", con);
    deleteTable("DROP TABLE IF EXISTS Department", "Department", con);
    deleteTable("DROP TABLE IF EXISTS AccountType", "AccountType", con);
}

// delete all tables in the app
// deleteTables(con);

app.listen(5001, () => {
    console.log("Server Started on Port 5001");
})