const express = require('express');
const app = express();
const administrator = require('./administrator.js');
const allUsers = require('./all-users');
const instructor = require('./instructor');
const student = require('./student');
const con = require('./index').con;

async function seed() {
    const res1 = await administrator.createAdministratorLogin('admin@gmail.com', 'admin', con);
    const res2 = await administrator.createAccountType('Administrator', con);
    const res3 = await administrator.createAccountType('Instructor', con);
    const res4 = await administrator.createAccountType('Student', con);
    const res5 = await administrator.createDepartment(1, 'Computer Science', con);
    const res6 = await administrator.createDepartment(2, 'Electrical Engineering', con);
    const res7 = await administrator.createDepartment(3, 'Computer Engineering', con);
    const res8 = await administrator.createGrade('A', con);
    const res9 = await administrator.createGrade('B', con);
    const res10 = await administrator.createGrade('C', con);
    const res11 = await administrator.createGrade('D', con);
    const res12 = await administrator.createGrade('F', con);
    const res13 = await administrator.createSemester('Winter', con);
    const res14 = await administrator.createSemester('Spring', con);
    const res15 = await administrator.createSemester('Summer', con);
    const res16 = await administrator.createSemester('Fall', con);
    const res17 = await administrator.assignCurrentSemester('Spring', 2021, con);
    const res18 = await administrator.assignNextSemester('Fall', 2021, con);
    const res19 = await administrator.createInstructor(1, 'John Connor', 'john.anthony.connor@gmail.com', con);
    const res20 = await administrator.createInstructor(2, 'Hesham Auda', 'hauda@ccny.cuny.edu', con);
    const res21 = await administrator.createInstructor(3, 'Akbar Islam', 'nysaifulislam@gmail.com', con);
    const res22 = await administrator.createInstructor(4, 'Akira Kawaguchi', 'akawaguchi@ccny.cuny.edu', con);
    const res23 = await administrator.registerAsInstructor(1, 'John Connor', 'john.anthony.connor@gmail.com', 'nothingbeatstwizzle', con); // TODO: Akbar, change this to instructor.registerAsInstructor() when you move registerAsInstructor() to instructor.js
    const res24 = await administrator.createCourse(1, 'Database Systems', 1, 3, 1000.00, con);
    const res25 = await administrator.createCourse(2, 'Data Structures', 1, 3, 1000.00, con);
    const res26 = await administrator.createCourse(3, 'Algorithms', 1, 3, 1000.00, con);
    const res27 = await administrator.createClass(32157, 1, 'H', 1, 2021, 'Spring', con);
    const res28 = await administrator.createClass(32179, 1, 'M', 2, 2021, 'Spring', con);
    const res29 = await administrator.createClass(32132, 1, 'P', 2, 2021, 'Spring', con);
    const res30 = await administrator.createClass(32150, 1, 'R', 2, 2021, 'Spring', con);
    const res31 = await administrator.createClass(34271, 1, 'P', 2, 2021, 'Fall', con);
    const res32 = await administrator.createClass(34272, 1, 'R', 2, 2021, 'Fall', con);
    const res33 = await administrator.createClass(34280, 1, 'A', 4, 2021, 'Fall', con);
    const res34 = await administrator.createStudent(123, 'Saiful Islam', 123456789, con);
    const res35 = await administrator.createStudent(456, 'Akbar Haider', 111111111, con);
    const res36 = await administrator.createStudent(1, 'John Doe', 987654321, con);
    const res37 = await administrator.registerAsStudent(123, 'Saiful Islam', 123456789, 'nysaifulislam@gmail.com', 'akbarisawesome', con);
    const res38 = await student.enrollInClass(32157, null, null, null, null, 123, con);
    const res39 = await student.enrollInClass(32132, null, null, null, null, 123, con);
    const res40 = await student.enrollInClass(32157, null, null, null, null, 456, con);
    const res41 = await student.enrollInClass(34271, null, null, null, null, 123, con);
    const res42 = await student.enrollInClass(34280, null, null, null, null, 123, con);
    const res43 = await student.enrollInClass(34280, null, null, null, null, 456, con);    
    const res44 = await administrator.assignGrade(1, 32157, 123, 'A', con); // TODO: Akbar, change this to instructor.assignGrade() when you move assignGrade() to instructor.js
    const res45 = await administrator.assignGrade(1, 32157, 456, 'A', con); // TODO: Akbar, change this to instructor.assignGrade() when you move assignGrade() to instructor.js
    const res46 = await administrator.assignGrade(2, 32132, 123, 'A', con); // TODO: Akbar, change this to instructor.assignGrade() when you move assignGrade() to instructor.js
}

app.listen(5002, () => {
    console.log('Server Started on Port 5002');
});

seed();