const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const Handlebars = require('express-handlebars');
const app = express();
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const administrator = require('./administrator.js');
const async = require('async');

// set up the database credientials and create connections 
const db = mysql.createConnection({ // Changed connection set up to work on my own local network
    host: 'localhost', 
    user: 'root',
    password: '',
    database: 'College-ful-bar',
    multipleStatements: true
});

// database connection                              
const connect = db.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("MySQL Server Connected");
        
    }
});


//define uses and set views
app.use(express.static('static'));
app.use(session({ secret: 'collegefulbar' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded());
app.engine('handlebars', Handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');


//check for login
//as of right not using this function
//not used as of right now
//-----------------------------------
function checkAuth(req, res, next) {
    if (!req.session.user_id) {
        res.render(302, '/login');
    } else {
        next();
    }
}
//-----------------------------------

//debug on console 
//-------------------------------------------------------------------------------------------------------------------------------
function debuglog(req, res, next) {
    console.debug(`${req.method} -- ${req.path} (params: ${JSON.stringify(req.params)}) [body: ${JSON.stringify(req.body)}]`);
    next();
}
//-------------------------------------------------------------------------------------------------------------------------------


//did not implement the multiple query function yet


//load home screen
//-------------------------
app.get("/", (req, res) => {
    res.render('home');
});
//-------------------------


//upon clicking login render the login html page
//------------------------------------------------
app.get('/login', (req, res) => {
    res.render('login');
});
//------------------------------------------------

//upon clicking register 
//--------------------------------------------------
app.get('/register', (req, res) => {
    res.render('register');
});
//--------------------------------------------------

//if student account then render student handlebar material
//------------------------------------------------------------
app.get('/user/:email', (req, res) => {
    res.render('student');
});
//------------------------------------------------------------


//From login screen query database and if if user exists then log them in
//------------------------------------------------------------------------------------
app.post('/auth/login', async (req, res) => {
    const { account, email, password } = req.body;
    if (!email || !password || !account) {
        return res.status(400).render('login', {
            message: 'Fields can not be empty'
        });
    }
    db.query("SELECT * FROM login WHERE Email =?", [email], async (error, results) => {
        console.log(results);
        if (results == 0) {
            res.status(401).render('login', {
                message: 'Account does not exist'
            });
        }
        if (!results || password != results[0].Password) {
            res.status(401).render('login', {
                message: 'Email or password is Incorrect'
            });
        } else {
            const account = results[0].AccountType;
            req.session.user_id = results[0].id;
            console.log("Logging in the user ID is: " + req.session.user_id);
            req.session.user_name = req.body.email;
            console.log("Logging in the username is: " + req.session.user_name);
            if (account == "student" || account == "Student") {
                res.redirect(`/user/${req.session.user_name}`);
            }
            if (account == "admin" || account == "Admin") {
                res.redirect(`/user/admin-panel/${req.session.user_name}`);
            }
        }
    });
});
//------------------------------------------------------------------------------------


//function to let a student register 
//------------------------------------------------------------------------------------------------
app.post('/auth/register', async (req, res) => {
    const name = req.body.name;
    const account = req.body.account;
    const email = req.body.email;
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;

    //this is where we will take in the  email the user enters in the form and put inside our database and 
    //if the email already exists then show them the message
    db.query('SELECT email FROM user WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.log(error);
        }
        if (results.length > 0) {
            return res.render('register', {
                message: 'The email already exists'
            });
        } else if (password !== passwordConfirm) {
            return res.render('register', {
                message: 'Passwords do not match'
            });
        }
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);
        //insert into database
        db.query('INSERT INTO user SET ?', { name: name, account: account, email: email, password: hashedPassword }, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                console.log(results);
                return res.redirect('/login');
            }
        });
    });
});

//---------------------------------------------------------------------------------------------------------------------------------------------------



//############################################ NEW UPDATED WORK #############################################//



//if admin account then render student handlebar material
app.get('/user/admin-panel/:Email', async (req, res) => {
   administrator.getAccountTypes(db).then(result =>{
        console.log(result);
        res.render('admin-panel', { title: 'Accounts', items: result });
   });

});


app.post('/accountType/submit', (req, res) => {
    const accountType = req.body.accountType;
      console.log(accountType);
      administrator.createAccountType(accountType,db)
         .then(result => {
              return result;
         })
         .then(result => {
            res.redirect(`/user/admin-panel/${req.session.user_name}`);
             return result[0];
         });
      });


    app.get('/deleteAccount/:Name', (req, res) => {
        var name = req.params.Name;
       administrator.deleteAccountType(name,db).then(result=>{
        res.redirect(`/user/admin-panel/${req.session.user_name}`);
           console.log(result);
       });
     });
//department work
app.get('/department',(req,res)=>{
       administrator.getDepartments(db).then(result =>{
    console.log(result);
    res.render('department', { title: 'Department', dep: result });
});
});

     app.post('/createDepartment/submit', (req, res) => {
        const department = req.body.department;
        const id = req.body.id;
          console.log(department);
          administrator.createDepartment(id,department,db)
             .then(result => {
                  return result;
             })
             .then(result => {
                res.redirect('/Department');
                 return result[0];
             });
          });
    
    
        app.get('/deleteDepartment/:Id', (req, res) => {
            var id = req.params.Id;
           administrator.deleteDepartment(id,db).then(result=>{
            res.redirect('/Department');
               console.log(result);
           });
         });
    
//grade work 
app.get('/grades',(req,res)=>{
    administrator.getGrades(db).then(result =>{
 console.log(result);
 res.render('grades', { title: 'grades', grades: result });
});
});

  app.post('/createGrades/submit', (req, res) => {
     const name = req.body.grades;
       console.log(name);
       administrator.createGrade(name,db)
          .then(result => {
               return result;
          })
          .then(result => {
             res.redirect('/grades');
              return result[0];
          });
       });
 
 
     app.get('/deleteGrades/:Name', (req, res) => {
         var name = req.params.Name;
        administrator.deleteGrade(name,db).then(result=>{
         res.redirect('/grades');
            console.log(result);
        });
      });
 
      //semester work 
app.get('/semester',(req,res)=>{
    administrator.getSemesters(db).then(result =>{
 console.log(result);
 res.render('semester', { title: 'semester', semester: result });
});
});

  app.post('/createSemester/submit', (req, res) => {
     const name = req.body.semester;
       console.log(name);
       administrator.createSemester(name,db)
          .then(result => {
               return result;
          })
          .then(result => {
             res.redirect('/semester');
              return result[0];
          });
       });
 
 
     app.get('/deleteSemester/:Name', (req, res) => {
         var name = req.params.Name;
        administrator.deleteSemester(name,db).then(result=>{
         res.redirect('/semester');
            console.log(result);
        });
      });


 //assign semester work

    
app.get('/current', (req, res) => {
  
    db.query("SELECT * FROM semester",function(err,rows,fields){
        if(err) throw err;
        console.log(rows);
        res.render('current',{title: 'semester',sem: rows});
    });
 });

          app.post('/currentSemester/submit', (req, res) => {
            const name = req.body.semester;
            const year = req.body.year;
              console.log(name,year);
                administrator.assignCurrentSemester(name,year,db).then(result =>{
                    console.log(result);
                    return result;
                    
                }).then(result=>{
                    res.redirect('/current');
                    return result[0];
                });
        
              });
 
              app.post('/nextSemester/submit', (req, res) => {
                const name = req.body.semester;
                const year = req.body.year;
                  console.log(name,year);
                    administrator.assignNextSemester(name,year,db).then(result =>{
                        console.log(result);
                        return result;
                        
                    }).then(result=>{
                        res.redirect('/current');
                        return result[0];
                    });
            
                  });
            
 
//instructor work

app.get('/instructor',(req,res)=>{
    administrator.getInstructors(db).then(result =>{
 console.log(result);
 res.render('instructor', { title: 'instructor', ins: result });
});
});

  app.post('/createInstructor/submit', (req, res) => {
     const name = req.body.name;
     const id = req.body.id;
     const email  = req.body.email;
       console.log(name);
       administrator.createInstructor(id,name,email,db)
          .then(result => {
               return result;
          })
          .then(result => {
             res.redirect('/instructor');
              return result[0];
          });
       });
 
 
     app.get('/deleteInstructor/:Id', (req, res) => {
         var id = req.params.Id;
        administrator.deleteInstructor(id,db).then(result=>{
         res.redirect('/instructor');
            console.log(result);
        });
      });

//create courses work 

app.get('/courses', (req, res) => {
  
    db.query("SELECT * FROM department",function(err,rows,fields){
        if(err) throw err;
        console.log(rows);
        res.render('courses',{title: 'department',dept: rows});
    });
 });

 app.post('/createCourse/submit', (req, res) => {
    const id = req.body.id;
    const title = req.body.title;
    const dept = req.body.department;
    const credits = req.body.credits;
    const cost = req.body.cost;
      console.log(id,title,dept,credits,cost);
        administrator.createCourse(id,title,dept,credits,cost,db).then(result =>{
            console.log(result);
            
        }).then(result=>{
            res.redirect('/courses');
            return result[0];
        });

      });


     app.get('/viewcourses', (req, res) => {
        administrator.viewCourses(db).then(result =>{
            console.log(result);
            res.render('viewcourses', { title: 'courses', courses: result });
           });
     });
app.get('/EditCourse/:Id',(req,res)=>{
    var id = req.params.Id;
    console.log(id);
    var sql = `SELECT * FROM course WHERE id = ${id}`;
    db.query(sql, function (err, rows,fields){
        if(err) throw err;
        console.log(rows);
        res.render('updatecourse',{title: 'Update Course', courses: rows[0]});
    });
});

app.post('/updateCourse/submit', (req, res) => {
    const id = req.body.id;
    const title = req.body.title;
    const dept = req.body.department;
    const credits = req.body.credits;
    const cost = req.body.cost;
      console.log(id,title,dept,credits,cost);
        administrator.updateCourse(id,title,dept,credits,cost,db).then(result =>{
            console.log(result);
            
        }).then(result=>{
            res.redirect('/viewcourses');
            return result[0];
        });

      });
 
      app.get('/deleteCourse/:Id', (req, res) => {
        var id = req.params.Id;
       administrator.deleteCourse(id,db).then(result=>{
        res.redirect('/viewcourses');
           console.log(result);
       });
     });

//create class work


app.get('/createclass', (req, res) => {
    // var sql = `SELECT * FROM course;SELECT * FROM instructor;SELECT * FROM SEMESTER;SELECT * FROM currentsemester;SELECT * FROM nextsemester`;
    // db.query(sql, function (err, result){
    //     if(err) throw err;
    //     console.log(result);
        res.render('createclass');

       
    // });
 });

 
 app.post('/createClass/submit', (req, res) => {
const classId = req.body.classid;
const courseId = req.body.courseid;
const section = req.body.section;
const instructor = req.body.instructor;
const year = req.body.year;
const semester = req.body.semester;
      console.log(classId,courseId,section,instructor,year,semester);
        administrator.createClass(classId,courseId,section,instructor,year,semester,db).then(result =>{
            console.log(result);
           return result;
        }).then(result=>{
            res.redirect('/createclass');
            return result[0];
        });
      });

//student work 
app.get('/createstudent', (req, res) => {
        res.render('createstudent');
 });


 app.post('/createStudent/submit', (req, res) => {
    const id = req.body.studentid;
    const name = req.body.studentname;
    const ssn = req.body.ssn;
    
          console.log(id,name,ssn);
            administrator.createStudent(id,name,ssn,db).then(result =>{
                console.log(result);
               return result;
            }).then(result=>{
                res.redirect('/createstudent');
                return result[0];
            });
          });

//grad and probation work 

app.get('/gradprob', (req, res) => {
    res.render('gradprob');
});

app.post('/assignGraduation/submit', (req, res) => {
    const id = req.body.studentid;
    
          console.log(id);
            administrator.assignGraduation(id,db).then(result =>{
                console.log(result);
               return result;
            }).then(result=>{
                res.redirect('/gradprob');
                return result[0];
            });
          });
          app.post('/assignProbation/submit', (req, res) => {
            const id = req.body.studentid;
            
                  console.log(id);
                    administrator.assignProbation(id,db).then(result =>{
                        console.log(result);
                       return result;
                    }).then(result=>{
                        res.redirect('/gradprob');
                        return result[0];
                    });
                  });
//if logout button is pressed then log the user out of this session
//--------------------------------------------------------------------------------
app.post('/logout', async (req, res) => {
    delete req.session.user_id;
    delete req.session.user_name;
    console.log("After Logging out the user ID is: " + req.session.user_id);
    console.log("After Logging out the username is: " + req.session.user_name);
    res.redirect('/');
});
//--------------------------------------------------------------------------------

//listen to a certain port on localhost to run the app
//--------------------------------------------------------
app.listen(5000, () => {
    console.log("Server Started on Port 5000");
});
//--------------------------------------------------------

exports.con = db;