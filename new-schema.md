# We will be using new and modfied schemas in our project

## New Schemas
1. AccountType(<ins>Name</ins>)
2. Department(<ins>Id</ins>:number, Name:string)
3. Grade(<ins>Name</ins>:string)
4. Semester(<ins>Name</ins>:string)
5. CurrentSemester(Name:Semester.Name, Year:number, <ins>DateAdded</ins>:string)
6. NextSemester(Name:Semester.Name, Year:number, <ins>DateAdded</ins>:string)
7. Instructor(<ins>Id</ins>:number, Name:string, Email:string)
8. Class(<ins>Id</ins>:number, Title:string, Section:string, Instructor:Instructor.Id, Dept:Department.Id, Year:number, Semester:Semester.Name, Credits:number, Cost:number)
9. Student(<ins>Id</ins>:number, Name:string, Email:string, Credits:number, Registered:boolean, Probation:boolean, SSN:string)
10. Enrollment(<ins>ClassId</ins>:Class.Id, <ins>StudentId</ins>:Student.Id, Grade:Grade.Name)
11. ProgramAdvisor(<ins>Id</ins>:number, Name:string, Dept:Department.Id, Email:string)
12. Login(<ins>Email</ins>:string, Password:string, <ins>AccountType</ins>:Account.Type)

## Previous Schemas
1. Class(<ins>id</ins>, title, section, instructor, dept, year, semester, credits, cost)
2. Student(<ins>id</ins>, name, age, email, credits, registered_or_not, probation_or_not)
3. Instructor(<ins>id</ins>, name, email)
4. Enrollment(<ins>class_id</ins>, <ins>student_id</ins>, grade)
5. PendingStudent(<ins>id</ins>, name, ssn, email)
6. ProgramAdvisor(<ins>id</ins>, name, email, dept, initials)
7. EnrollmentDate(<ins>credits</ins>, enrollment_date, <ins>year</ins>, <ins>semester</ins>)