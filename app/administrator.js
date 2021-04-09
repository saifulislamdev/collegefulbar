const express = require('express');
const app = express();
const con = require('./index').con;

function createAccountType(accountType, con) {
    /* 
    Purpose: Creates an account type in the DB (i.e. Student, Administrator, etc.). 
    Warning: Must use await keyword before calling function, and must call function within an async function. Look at example in asynch-await.png
    Input:
        accountType: account type to be created in the DB (string)
        con: connection to DB (result of createConnection() method)
    Output:
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Name' at row 1"]).
    */
    var sql = "INSERT INTO AccountType VALUES (?)";
    return new Promise((resolve, reject) => {
        con.connect(function (err) {
            con.query(sql, accountType, (err, result) => {
                return err ? resolve([false, err.sqlMessage]) : resolve([true]);
            });
        })
    });
}

function deleteAccountType(accountType, con) {
    /* 
    Purpose: Deletes an account type in the DB if it exists (i.e. Student, Administrator, etc.). 
    Warning: Must use await keyword before calling function, and must call function within an async function. Look at example in asynch-await.png
    Input:
        accountType: account type to be deleted in the DB
        con: connection to DB (result of createConnection() method)
    Output:
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Name' at row 1"]).
        If accountType does not exist in DB, returns [false, "No rows affected"].
    */
    var sql = "DELETE FROM AccountType WHERE Name = ?";
    return new Promise((resolve, reject) => {
        con.connect(function (err) {
            con.query(sql, accountType, (err, result) => {
                return err ? resolve([false, err.sqlMessage]) : result.affectedRows > 0 ? resolve([true]) : resolve([false, "No rows affected"]);
            });
        })
    });
}

function getAccountTypes(con) {
    /* 
    Purpose: Retrieves an array of all account types in the DB as objects
    Warning: Must use await keyword before calling function, and must call function within an async function. Look at example in asynch-await.png
    Input:
        con: connection to DB (result of createConnection() method)
    Output:
        If an error occurs, returns an array with only one element of false (i.e. [false])
        If there is no account types in the DB, returns an empty array. 
        Otherwise, returns an array of objects that contain the account type in each object.
    */
    var sql = "SELECT * FROM AccountType";
    return new Promise((resolve, reject) => {
        con.connect(function (err) {
            con.query(sql, (err, result) => {
                return err ? resolve([false]) : resolve(result);
            });
        })
    });
}

function createDepartment(id, name, con) {
    /* 
    Purpose: Creates an department in the DB (i.e. Computer Science, Electrical Engineering, etc.). 
    Warning: Must use await keyword before calling function, and must call function within an async function. Look at example in asynch-await.png
    Input:
        id: to be inserted in Id column in Department table (can be NULL if user does not specify a certain id)
        name: name of the department (i.e. Computer Science) to be inserted in the Name column of the Department table
        con: connection to DB (result of createConnection() method)
    Output:
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Name' at row 1"]).
    */
    if (id === null) {
        var sql = "INSERT INTO Department(name) VALUES (?)";
    } else {
        var sql = "INSERT INTO Department VALUES (?)";
    }
    return new Promise((resolve, reject) => {
        con.connect(function (err) {
            if (id === null) {
                con.query(sql, name, (err, result) => {
                    return err ? resolve([false, err.sqlMessage]) : resolve([true]);
                });
            } else {
                con.query(sql, [[id, name]], (err, result) => {
                    return err ? resolve([false, err.sqlMessage]) : resolve([true]);
                });
            }
        })
    });
}

function deleteDepartment(id, con) {
    /* 
    Purpose: Deletes a department in the DB if it exists (i.e. Computer Science, Electrical Engineering, etc.). 
    Warning: Must use await keyword before calling function, and must call function within an async function. Look at example in asynch-await.png
    Input:
        id: id of department to be deleted in the DB
        con: connection to DB (result of createConnection() method)
    Output:
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Name' at row 1"]).
        If id does not exist in DB, returns [false, "No rows affected"].
    */
    var sql = "DELETE FROM Department WHERE Id = ?";
    return new Promise((resolve, reject) => {
        con.connect(function (err) {
            con.query(sql, id, (err, result) => {
                return err ? resolve([false, err.sqlMessage]) : result.affectedRows > 0 ? resolve([true]) : resolve([false, "No rows affected"]);
            });
        })
    });
}

function getDepartments(con) {
    /* 
    Purpose: Retrieves an array of all departments in the DB as objects
    Warning: Must use await keyword before calling function, and must call function within an async function. Look at example in asynch-await.png
    Input:
        con: connection to DB (result of createConnection() method)
    Output:
        If an error occurs, returns an array with only one element of false (i.e. [false])
        If there are no departments in the DB, returns an empty array. 
        Otherwise, returns an array of objects that contain the department type in each object.
    */
    var sql = "SELECT * FROM Department";
    return new Promise((resolve, reject) => {
        con.connect(function (err) {
            con.query(sql, (err, result) => {
                // return err ? resolve([false]) : result.length > 0 ? resolve(result) : resolve([]);
                return err ? resolve([false]) : resolve(result);
            });
        })
    });
}

function createGrade(name, con) {
    /* 
    Purpose: Creates a grade in the DB (i.e. 'A', 'B', 'C', 'D', 'F', etc.). 
    Warning: Must use await keyword before calling function, and must call function within an async function. Look at example in asynch-await.png
    Input:
        name: grade to be created in the DB
        con: connection to DB (result of createConnection() method)
    Output:
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Name' at row 1"]).
    */
    var sql = "INSERT INTO Grade VALUES (?)";
    return new Promise((resolve, reject) => {
        con.connect(function (err) {
            con.query(sql, name, (err, result) => {
                return err ? resolve([false, err.sqlMessage]) : resolve([true]);
            });
        })
    });
}

function deleteGrade(name, con) {
    /* 
    Purpose: Deletes a grade in the DB if it exists (i.e. 'A', 'B', 'C', 'D', 'F', etc.). 
    Warning: Must use await keyword before calling function, and must call function within an async function. Look at example in asynch-await.png
    Input:
        name: name of grade to be deleted in the DB
        con: connection to DB (result of createConnection() method)
    Output:
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Name' at row 1"]).
        If name does not exist in DB, returns [false, "No rows affected"].
    */
    var sql = "DELETE FROM Grade WHERE Name = ?";
    return new Promise((resolve, reject) => {
        con.connect(function (err) {
            con.query(sql, name, (err, result) => {
                return err ? resolve([false, err.sqlMessage]) : result.affectedRows > 0 ? resolve([true]) : resolve([false, "No rows affected"]);
            });
        })
    });
}

function getGrades(con) {
    /* 
    Purpose: Retrieves an array of all grades in the DB as objects
    Warning: Must use await keyword before calling function, and must call function within an async function. Look at example in asynch-await.png
    Input:
        con: connection to DB (result of createConnection() method)
    Output:
        If an error occurs, returns an array with only one element of false (i.e. [false])
        If there are no grades in the DB, returns an empty array. 
        Otherwise, returns an array of objects that contain the grade in each object.
    */
    var sql = "SELECT * FROM Grade";
    return new Promise((resolve, reject) => {
        con.connect(function (err) {
            con.query(sql, (err, result) => {
                return err ? resolve([false]) : resolve(result);
            });
        })
    });
}

function createSemester(name, con) {
    /* 
    Purpose: Creates a semester in the DB (i.e. 'Winter', 'Spring', 'Summer', 'Fall', etc.). 
    Warning: Must use await keyword before calling function, and must call function within an async function. Look at example in asynch-await.png
    Input:
        name: semester to be created in the DB
        con: connection to DB (result of createConnection() method)
    Output:
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Name' at row 1"]).
    */
    var sql = "INSERT INTO Semester VALUES (?)";
    return new Promise((resolve, reject) => {
        con.connect(function (err) {
            con.query(sql, name, (err, result) => {
                return err ? resolve([false, err.sqlMessage]) : resolve([true]);
            });
        })
    });
}

function deleteSemester(name, con) {
    /* 
    Purpose: Deletes a semester in the DB if it exists (i.e. 'Winter', 'Spring', 'Summer', 'Fall', etc.). 
    Warning: Must use await keyword before calling function, and must call function within an async function. Look at example in asynch-await.png
    Input:
        name: name of semester to be deleted in the DB
        con: connection to DB (result of createConnection() method)
    Output:
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Name' at row 1"]).
        If name does not exist in DB, returns [false, "No rows affected"].
    */
    var sql = "DELETE FROM Semester WHERE Name = ?";
    return new Promise((resolve, reject) => {
        con.connect(function (err) {
            con.query(sql, name, (err, result) => {
                return err ? resolve([false, err.sqlMessage]) : result.affectedRows > 0 ? resolve([true]) : resolve([false, "No rows affected"]);
            });
        })
    });
}

function getSemesters(con) {
    /* 
    Purpose: Retrieves an array of all semesters in the DB as objects
    Warning: Must use await keyword before calling function, and must call function within an async function. Look at example in asynch-await.png
    Input:
        con: connection to DB (result of createConnection() method)
    Output:
        If an error occurs, returns an array with only one element of false (i.e. [false])
        If there are no grades in the DB, returns an empty array. 
        Otherwise, returns an array of objects that contain the grade in each object.
    */
    var sql = "SELECT * FROM Semester";
    return new Promise((resolve, reject) => {
        con.connect(function (err) {
            con.query(sql, (err, result) => {
                return err ? resolve([false]) : resolve(result);
            });
        })
    });
}

function createInstructor(id, name, email, con) {
    /* 
    Purpose: Creates an instructor in the DB (i.e. 12345, 'John Doe', 'johndoe@gmail.com'). 
    Warning: Must use await keyword before calling function, and must call function within an async function. Look at example in asynch-await.png
    Input:
        id: to be inserted in Id column in Instructor table (must specify a specific ID number; cannot be null and must be an integer value)
        name: name of the instructor (i.e. 'John Doe') to be inserted in the Name column of the Instructor table (can be null or empty string)
        email: email of the instructor (i.e. 'johndoe@gmail.com') to be inserted in the Email column of the Instructor table (can be null or empty string)
        con: connection to DB (result of createConnection() method)
    Output:
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Name' at row 1"]).
    */
    var sql = "INSERT INTO Instructor VALUES (?)";
    return new Promise((resolve, reject) => {
        con.connect(function (err) {
            con.query(sql, [[id, name, email]], (err, result) => {
                return err ? resolve([false, err.sqlMessage]) : resolve([true]);
            });
        })
    });
}

function deleteInstructor(id, con) {
    /* 
    Purpose: Deletes an instructor in the DB if it exists 
    Warning: Must use await keyword before calling function, and must call function within an async function. Look at example in asynch-await.png
    Input:
        id: id of the instructor to be deleted in the DB
        con: connection to DB (result of createConnection() method)
    Output:
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Id' at row 1"]).
        If id does not exist in DB, returns [false, "No rows affected"].
    */
    var sql = "DELETE FROM Instructor WHERE Id = ?";
    return new Promise((resolve, reject) => {
        con.connect(function (err) {
            con.query(sql, id, (err, result) => {
                return err ? resolve([false, err.sqlMessage]) : result.affectedRows > 0 ? resolve([true]) : resolve([false, "No rows affected"]);
            });
        })
    });
}

function getInstructors(con) {
    /* 
    Purpose: Retrieves an array of all instructors in the DB as objects
    Warning: Must use await keyword before calling function, and must call function within an async function. Look at example in asynch-await.png
    Input:
        con: connection to DB (result of createConnection() method)
    Output:
        If an error occurs, returns an array with only one element of false (i.e. [false])
        If there are no instructors in the DB, returns an empty array. 
        Otherwise, returns an array of objects that contain the instructor's information in each object.
    */
    var sql = "SELECT * FROM Instructor";
    return new Promise((resolve, reject) => {
        con.connect(function (err) {
            con.query(sql, (err, result) => {
                return err ? resolve([false]) : resolve(result);
            });
        })
    });
}

function createCourse(id, title, dept, credits, cost, con) {
    /* 
    Purpose: Creates a course in the DB
    Warning: 
        dept must already be in Department table's Id column
        Must use await keyword before calling function, and must call function within an async function. Look at example in asynch-await.png
    Input:
        id: course ID to be inserted in Id column of Course table (must specify a specific ID number; cannot be null and must be a unique integer value)
        title: title/name of the course to be inserted in the Title column of Course table (string)
        dept: ID of the department that the course belongs to (same ID as the one in the Department table, int)
        credits: the number of credits the course is (int)
        cost: how much the course costs (decimal with at most precision 2)
        con: connection to DB (result of createConnection() method)
    Output:
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Name' at row 1"]).
    */
    var sql = "INSERT INTO Course VALUES (?)";
    return new Promise((resolve, reject) => {
        con.connect(function (err) {
            con.query(sql, [[id, title, dept, credits, cost]], (err, result) => {
                return err ? resolve([false, err.sqlMessage]) : resolve([true]);
            });
        })
    });
}

function updateCourse(id, newTitle, newDept, newCredits, newCost, con) {
    /* 
    Purpose: Updates a course's information in the DB
    Warning: 
        newDept must already be in Department table's Id column
        Must use await keyword before calling function, and must call function within an async function. Look at example in asynch-await.png
    Input:
        id: course ID to be updated in Course table (int)
        newTitle: new title/name of the course that is being updated (string)
        newDept: new department ID of the course that is being updated (same ID as the one in the Department table, int)
        newCredits: the number of credits the course is being updated to (int)
        newCost: the new cost of the course (decimal with at most precision 2)
        con: connection to DB (result of createConnection() method)
    Output:
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Name' at row 1"]).
        If no such row in the Course table has a matching id, returns [false, "No rows affected"].
    */
    var sql = "UPDATE Course \
                SET Title = ?, \
                    Dept = ?, \
                    Credits = ?, \
                    Cost = ? \
                WHERE Id = ?";
    return new Promise((resolve, reject) => {
        con.query(sql, [newTitle, newDept, newCredits, newCost, id], (err, result) => {
            return err ? resolve([false, err.sqlMessage]) : result.affectedRows > 0 ? resolve([true]) : resolve([false, "No rows affected"]);
        });
    });
}

function deleteCourse(id, con) {
    /* 
    Purpose: Deletes a course in the DB if it exists 
    Warning: Must use await keyword before calling function, and must call function within an async function. Look at example in asynch-await.png
    Input:
        id: id of the course to be deleted in the DB
        con: connection to DB (result of createConnection() method)
    Output:
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Id' at row 1"]).
        If id does not exist in DB, returns [false, "No rows affected"].
    */
    var sql = "DELETE FROM Course WHERE Id = ?";
    return new Promise((resolve, reject) => {
        con.connect(function (err) {
            con.query(sql, id, (err, result) => {
                return err ? resolve([false, err.sqlMessage]) : result.affectedRows > 0 ? resolve([true]) : resolve([false, "No rows affected"]);
            });
        })
    });
}

function createClass(classId, courseId, section, instructor, year, semester, con) {
    /* 
    Purpose: Creates a class in the DB
    Warning: 
        courseId must already be in Course table's Id column
        instructor must already be in Instructor table's Id column
        semester must already be in Semester table's Name column
        Must use await keyword before calling function, and must call function within an async function. Look at example in asynch-await.png
    Input:
        classId: class ID for the class the user wants to create (if null, automatically sets a class ID, int)
        courseId: course ID that references a course in the Course table (must specify a specific ID number that's in the Course table's Id column, cannot be null, int)
        section: section of the class (cannot be null, string)
        instructor: ID of the instructor that teaches the class (same ID as the one in the Instructor table, int)
        year: the year the class takes place (cannot be null, int)
        semester: the semester the class takes place (same as the name in the Semester table, cannot be null, string)
        con: connection to DB (result of createConnection() method)
    Output:
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Name' at row 1"]).
    */
    if (classId === null) {
        var sql = "INSERT INTO Class(CourseId, Section, Instructor, Year, Semester) VALUES (?)";
    } else {
        var sql = "INSERT INTO Class VALUES (?)";
    }
    return new Promise((resolve, reject) => {
        con.connect(function (err) {
            if (classId === null) {
                var args = [[courseId, section, instructor, year, semester]];
            } else {
                var args = [[classId, courseId, section, instructor, year, semester]];
            }
            con.query(sql, args, (err, result) => {
                return err ? resolve([false, err.sqlMessage]) : resolve([true]);
            });
        })
    });
}

function updateClass(courseId, currSection, currYear, currSemester, newSection, newInstructor, newYear, newSemester, con) {
    /* 
    Purpose: Updates a class's information in the DB
    Warning: 
        newInstructor must already be in Instructor table's Id column
        newSemester must already be in Semester table's Name column
        Must use await keyword before calling function, and must call function within an async function. Look at example in asynch-await.png
    Input:
        courseId: course ID of class that is being updated in Class table (int) 
        currSection: current section of class that is being updated in Class table (string)
        currYear: current year of class that is being updated in Class table (int)
        currSemester: current semester of class that is being updated in Class table (string)
        newSection: new section of class that is being updated in Class table (can be the same as the current section, cannot be null, string)
        newInstructor: new ID of the instructor that teaches the class (can be the same as the current instructor, same ID as the one in the Instructor table, int)
        newYear: new year of class that is being updated in Class table (cannot be null, int)
        newSemester: new semester of class that is being updated in Class table (same as the name in the Semester table, cannot be null, string)
        con: connection to DB (result of createConnection() method)
    Output:
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Name' at row 1"]).
        If no such row in the Class table has a matching courseId, currSection, currYear, and currSemester, returns [false, "No rows affected"].
    */
    var sql = "UPDATE Class \
                SET Section = ?, \
                    Instructor = ?, \
                    Year = ?, \
                    Semester = ? \
                WHERE CourseId = ? AND \
                    Section = ? AND \
                    Year = ? AND \
                    Semester = ?";
    return new Promise((resolve, reject) => {
        con.query(sql, [newSection, newInstructor, newYear, newSemester, courseId, currSection, currYear, currSemester], (err, result) => {
            return err ? resolve([false, err.sqlMessage]) : result.affectedRows > 0 ? resolve([true]) : resolve([false, "No rows affected"]);
        });
    });
}

function deleteClass(courseId, section, year, semester, con) {
    /* 
    Purpose: Deletes a class in the DB if it exists 
    Warning: Must use await keyword before calling function, and must call function within an async function. Look at example in asynch-await.png
    Input:
        courseId: course ID for the to-be deleted class  (int)
        section: section of the to-be deleted class (string)
        year: the year in which the to-be deleted class takes place (int)
        semester: the semester in which the to-be deleted class takes place (string)
        con: connection to DB (result of createConnection() method)
    Output:
        If there is no error, returns an array with only one element of true (i.e. [true])
        If there is an error, returns false with the SQL message in an array (i.e. [false, "Data too long for column 'Id' at row 1"]).
        If a matching courseId, section, year, and semester does not exist in DB, returns [false, "No rows affected"].
    */
    var sql = "DELETE FROM Class WHERE CourseId = ? AND Section = ? AND Year = ? AND Semester = ?";
    return new Promise((resolve, reject) => {
        con.connect(function (err) {
            con.query(sql, [courseId, section, year, semester], (err, result) => {
                return err ? resolve([false, err.sqlMessage]) : result.affectedRows > 0 ? resolve([true]) : resolve([false, "No rows affected"]);
            });
        })
    });
}

// TODO: for all-users.js
function getClassInfo() {
}

// TODO: for all-users.js
function getClasses() {
}

function enrollInClass() {

}

function dropClass() {

}

function getMyCurrentEnrollments() {

}

function getAllMyEnrollments() {

}

function viewMyGrades() {

}

function assignGrade() {

}

function createLogin() {

}

function updatePassword() {

}

function verifyStudentLogin() {

}

function verifyInstructorLogin() {

}

function verifyAdministratorLogin() {

}

function assignGrade() {

}

function getMyCurrentlyTaughtCourses() {

}

function getMyTaughtCourses() {

}
// TODO: for db-setup.js
function fillMockData() {

}

// TODO: check if all features are implemented in the proposal

/* Testing */
(async () => {
    // createAccountType() is the function we want to call
    // const res1 = await createAccountType("Administrator", con);
    // const res2 = await createAccountType("Instructor", con);
    // const res3 = await createAccountType("Student", con);
    // const res4 = await createDepartment(1, "Computer Science", con);
    // const res5 = await createGrade('A', con);
    // const res6 = await createGrade('B', con);
    // const res7 = await createGrade('C', con);
    // const res8 = await createGrade('D', con);
    // const res9 = await createGrade('E', con);
    // const res10 = await createSemester('Winter', con);
    // const res11 = await createSemester('Spring', con);
    // const res12 = await createSemester('Summer', con);
    // const res13 = await createSemester('Fall', con);
    // const res14 = await createInstructor(1, 'John Connor', 'john.anthony.connor@gmail.com', con);
    // const res15 = await createInstructor(2, 'Hesham Auda', 'hauda@ccny.cuny.edu', con);
    // const res16 = await createCourse(1, "Database Systems", 1, 3, 1000.00, con);
    // const res17 = await createClass(32157, 1, 'H', 1, 2021, 'Spring', con);
    // const res18 = await createClass(32200, 1, 'M', 2, 2021, 'Spring', con); 
    // const res = await deleteAccountType('Student', con);
    // const res = await getAccountTypes(con);
    // const res = await deleteAccountType("Teacher", con);
    // const res = await createDepartment(2, "Test department", con);
    // const res = await deleteDepartment(26, con);
    // const res = await getDepartments(con);
    // const res = await deleteGrade('E', con);
    // const res = await deleteGrade('F', con);
    // const res = await getGrades(con);
    // const res = await deleteSemester('Fa', con);
    // const res = await getSemesters(con);
    // const res = await createInstructor(123, 'John Doe', 'johndoe@gmail.com', con);
    // const res = await deleteInstructor(0, con);
    // const res = await getInstructors(con);
    // const res = await updatedInstructorForClass(123, 'Bob', con);
    // const res = await createCourse(100, "Saiful's Awesome Lab", 1, 3, 1000.00, con);
    // const res = await deleteCourse(1, con);
    // const res = await updateCourse(101, "Saiful's New Awesome Lab", 1, 4, 1500.00, con);
    // const res = await deleteClass(1, 'B', 2021, 'Spring', con);
    console.log(res);
})();

app.listen(5002, () => {
    console.log("Server Started on Port 5002");
});