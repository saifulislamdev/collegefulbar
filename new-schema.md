# We will be using new and modfied schemas in our project

## New Schemas
1. AccountType(<ins>Name</ins>)
2. Department(<ins>Id</ins>:number, Name:string)
3. Grade(<ins>Name</ins>:string)
4. Semester(<ins>Name</ins>:string)
5. Instructor(<ins>Id</ins>:number, Name:string, Email:string)
6. Class(<ins>Id</ins>:number, Title:string, Section:string, Instructor:Instructor.Id, Dept:Department.Id, Year:number, Semester:Semester.Name, Credits:number, Cost:number)
7. Student(<ins>Id</ins>:number, Name:string, Email:string, Credits:number, Registered:boolean, Probation:boolean, SSN:string, Age:number)
8. PendingStudent(<ins>SSN</ins>:string, Name:string, Email:string)
9. Enrollment(<ins>ClassId</ins>:Class.Id, <ins>StudentId</ins>:Student.Id, Grade:Grade.Name)
10. ProgramAdvisor(<ins>Id</ins>:number, Name:string, Dept:Department.Id, Email:string)
11. Login(<ins>Email</ins>:string, Password:string, <ins>AccountType</ins>:Account.Type)

## Previous Schemas
Class(<ins>id</ins>, title, section, instructor, dept, year, semester, credits, cost)
Student(<ins>id</ins>, name, age, email, credits, registered_or_not, probation_or_not)
Instructor(<ins>id</ins>, name, email)
Enrollment(<ins>class_id</ins>, <ins>student_id</ins>, grade)
PendingStudent(<ins>id</ins>, name, ssn, email)
ProgramAdvisor(<ins>id</ins>, name, email, dept, initials)
EnrollmentDate(<ins>credits</ins>, enrollment_date, <ins>year</ins>, <ins>semester</ins>)