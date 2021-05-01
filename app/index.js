const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const Handlebars = require('express-handlebars');
const app = express();
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const administrator = require('./administrator.js');
const student = require('./student.js');
const instructor = require('./instructor.js');
const dotenv = require('dotenv');
const allusers = require('./all-users.js');

dotenv.config({path: './.env'});
// set up the database credentials and create connections 
// TODO: would be a good idea to put this in db-setup instead and change the imports in administrator.js, all-user.js, db-setup.js, seed.js, student.js, index.js, instructor.js
const db = mysql.createConnection({ // Changed connection set up to work on my own local network
    host: process.env.DATABASE_HOST, 
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    multipleStatements: true
});

// const db = mysql.createConnection({ // Changed connection set up to work on my own local network
//     host: '127.0.0.1', 
//     user: 'root',
//     password: 'ploop',
//     database: 'Collegefulbar',
//     port: 3306, // create this option for me in the .env
//     multipleStatements: true
// });      

//define uses and set views
app.use(express.static('static'));
app.use(session({ secret: 'collegefulbar' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded());
app.engine('handlebars', Handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');



//load home screen
//-------------------------
app.get("/", (req, res) => {
    res.render('home');
});
//-------------------------


//upon clicking login render the login html page
//------------------------------------------------
app.get('/loginadmin', (req, res) => {
    res.render('login');
});
//------------------------------------------------
app.get('/loginstudent', (req, res) => {
    res.render('studentlogin');
});
//---------

app.get('/loginins', (req, res) => {
    res.render('instructorlogin');
});
//upon clicking register 
//--------------------------------------------------
app.get('/registerstudent', (req, res) => {
    res.render('register');
});
//--------------------------------------------------

app.get('/registerins', (req, res) => {
    res.render('registerins');
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
app.post('/auth/admin/login', async (req, res) => {
    const {email, password } = req.body;
    if (!email || !password) {
        return res.status(400).render('login', {
            message: 'Fields can not be empty'
        });
    }
    administrator.verifyAdministratorLogin(email,password,db).then(result =>{
        req.session.user_name = req.body.email;
        console.log("Logging in the username is: " + req.session.user_name);
        return result;
    }).then(result=>{
        res.redirect(`/user/admin-panel/${req.session.user_name}`);
        return result[0];
    });               

});
//------------------------------------------------------------------------------------
app.post('/auth/student/login', async (req, res) => {
    const {email, password } = req.body;
    if (!email || !password) {
        return res.status(400).render('login', {
            message: 'Fields can not be empty'
        });
    }
    student.verifyStudentLogin(email,password,db).then(result =>{
        req.session.user_name = req.body.email;
        console.log("Logging in the username is: " + req.session.user_name);
        return result;
    }).then(result=>{
        res.redirect('/studentview');
        return result[0];
    });               

});

app.post('/auth/instructor/login', async (req, res) => {
    const {email, password } = req.body;
    if (!email || !password) {
        return res.status(400).render('login', {
            message: 'Fields can not be empty'
        });
    }
    instructor.verifyInstructorLogin(email,password,db).then(result =>{
        req.session.user_name = req.body.email;
        console.log("Logging in the username is: " + req.session.user_name);
        return result;
    }).then(result=>{
        
        res.render('instructorpanel');
        return result[0];
    });               

});

//function to let a student register 
//------------------------------------------------------------------------------------------------
app.post('/auth/register', async (req, res) => {
    const id = parseInt(req.body.id);
    const name = req.body.name;
    const ssn = parseInt(req.body.ssn);
    const email = req.body.email;
    const password = req.body.password;
   

    console.log(id,name,ssn,email,password);
    student.registerAsStudent(id,name,ssn,email,password,db).then(result =>{
        console.log(result);
        return result;
      
    }).then(result =>{
        res.redirect('/loginstudent');
        return result[0];
    });
});

//---------------------------------------------------------------------------------------------------------------------------------------------------

app.post('/auth/ins/register', async (req, res) => {
    const id = parseInt(req.body.insid);
    const name = req.body.insname;
    const email = req.body.insemail;
    const password = req.body.inspassword;
   

    console.log(id,name,email,password);
    instructor.registerAsInstructor(id,name,email,password,db).then(result =>{
        console.log(result);
        return result;
      
    }).then(result =>{
        res.redirect('/loginins');
        return result[0];
    });
});



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
    res.render('createclass');
 });

 

 
 app.post('/createClass/submit', (req, res) => {
const classId = parseInt(req.body.classid);
const courseId = parseInt(req.body.courseid);
const section = req.body.section;
const instructor = req.body.instructor;
const year = parseInt(req.body.year);
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


      app.get('/view/current', (req, res) => {
        administrator.getCurrentSemClasses(db).then(result=>{
            console.log(result);
            return result;
        }).then(result =>{
           res.render('createclass',{title: ' class', class: result});
        });
     });

     app.get('/view/next', (req, res) => {
        administrator.getNextSemClasses(db).then(result=>{
            console.log(result);
            return result;
        }).then(result =>{
           res.render('createclass',{title: ' class', class: result});
        });
     });

     app.get('/EditClass/:ClassId',(req,res)=>{
        var id = req.params.ClassId;
        console.log(id);
        var sql = `SELECT * FROM class WHERE Id = ${id}`;
        db.query(sql, function (err, rows,fields){
            if(err) throw err;
            console.log(rows);
            res.render('classupdate',{title: 'Update class', class: rows[0]});
        });
    });  

    app.post('/updateClass/submit', (req, res) => {
        const  courseId = req.body.CourseId;
        const currSection = req.body.section;
        const currYear = parseInt(req.body.year);
        const currSemester = req.body.semester;
        const newSection = req.body.newsection;
        const newInstructor = parseInt(req.body.newinstructor);
        const newYear = parseInt(req.body.newyear);
        const newSemester = req.body.newsemester;
       console.log(courseId, currSection, currYear, currSemester, newSection, newInstructor, newYear, newSemester);
             administrator.updateClass(courseId, currSection, currYear, currSemester, newSection, newInstructor, newYear, newSemester, db).then(result =>{
                 console.log(result);
                 return result;
                 
             }).then(result=>{
                 res.redirect('/createclass');
                 return result[0];
             });
     
           });    

           app.get('/deleteClass/:ClassId', (req, res) => {
          
          const Classid = req.params.ClassId;

         var sql = `SELECT * FROM class WHERE Id = ${Classid}`;
         db.query(sql, async function (err, results){
            if(err) throw err;
            console.log(results);
            const courseId = results[0].CourseId;
            const section = results[0].Section;
            const year = parseInt(results[0].Year);
           const semester = results[0].Semester;
            console.log(courseId, section,year,semester);
            administrator.deleteClass(courseId,section,year,semester,db).then(result=>{
                res.redirect('/createclass');
                   console.log(result);
               });


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

                  app.post('/removeProbation/submit', (req, res) => {
                    const id = req.body.studentid;
                    
                          console.log(id);
                            administrator.removeProbation(id,db).then(result =>{
                                console.log(result);
                               return result;
                            }).then(result=>{
                                res.redirect('/gradprob');
                                return result[0];
                            });
                          });


                          app.get('/createadmin', (req, res) => {
                            res.render('addadmin');
                        });

                        app.post('/createAdmin/submit', (req, res) => {
                            const email = req.body.adminemail;
                            const password = req.body.adminpassword;
                            
                                  console.log(email, password);
                                    administrator.createAdministratorLogin(email,password,db).then(result =>{
                                        console.log(result);
                                       return result;
                                    }).then(result=>{
                                        res.redirect('/createadmin');
                                        return result[0];
                                    });
                                  });
                              
//################################# NEW STUDENT WORK ################################################

app.get('/studentview', (req, res) => {
    administrator.viewCourses(db).then(result =>{
        console.log(result);
        res.render('studentview', { title: 'courses', courses: result });
       });
 });


 app.get('/studentclasses', (req, res) => {
res.render('studentclasses');
 
 });

 app.get('/EnrollClass/:ClassId',(req,res)=>{
    var id = req.params.ClassId;
    console.log(id);
    var sql = `SELECT * FROM class WHERE Id = ${id}`;
    db.query(sql, function (err, rows,fields){
        if(err) throw err;
        console.log(rows);
        res.render('enroll',{title: 'Update class', class: rows[0]});
    });
});  

app.post('/enrollClass/submit', (req, res) => {
    const studentId = parseInt(req.body.studentid);
    const courseId = parseInt(req.body.courseId);
    const classId = parseInt(req.body.classid);
    const section = req.body.section;
    const year = parseInt(req.body.year);
    const semester = req.body.semester;
    req.session.user_id = studentId;
   console.log(classId, courseId, section, year, semester, studentId);
         student.enrollInClass(classId, courseId, section, year, semester, studentId, db).then(result =>{
             console.log(result);
             return result;
             
         }).then(result=>{
             res.redirect('/studentclasses');
             return result[0];
         });
 
       });    

       app.get('/studentview/currentclass', (req, res) => {
        student.getCurrentSemClasses(db).then(result=>{
            console.log(result);
            return result;
        }).then(result =>{
           res.render('studentclasses',{title: ' class', class: result});
        });
     });

     app.get('/studentview/nextclass', (req, res) => {
        student.getNextSemClasses(db).then(result=>{
            console.log(result);
            return result;
        }).then(result =>{
           res.render('studentclasses',{title: ' class', class: result});
        });
     });

     app.get('/studentenrollments', (req, res) => {
        res.render('getid');
         
         });
    


app.post('/getid/submit',(req,res)=>{
    const email = req.body.email;
    let id;
    student.getStudentIdFromEmail(email,db).then(result=>{
        console.log(result);
       id= req.session.user_id = result[1];
        console.log(id);
        return result;
    }).then(result =>{
        res.render('checkenrollments');
        return result[0];
    });
    
    app.get('/view/enroll',(req,res)=>{
      
        console.log(req.session.user_id);
        student.getMyCurrentEnrollments(id,db).then(result =>{
            return result;
        }).then(result=>{
            res.render('checkenrollments',{title: ' class', curclass: result});
            
        });
    });

    app.get('/view/nextenroll',(req,res)=>{
      
        console.log(req.session.user_id);
        student.getMyNextEnrollments(id,db).then(result =>{
            return result;
        }).then(result=>{
            res.render('checkenrollments',{title: ' class', curclass: result});
            
        });
    });

    app.get('/view/allenroll',(req,res)=>{
      
        console.log(req.session.user_id);
        student.getAllMyEnrollments(id,db).then(result =>{
            return result;
        }).then(result=>{
            res.render('checkenrollments',{title: ' class', curclass: result});
            
        });
    });

    app.get('/view/grade',(req,res)=>{
      
        console.log(req.session.user_id);
        student.viewMyGrades(id,db).then(result =>{
            return result;
        }).then(result=>{
            res.render('checkenrollments',{title: ' class', curclass: result});
            
        });
    });

    app.get('/dropclass/:ClassId',(req,res)=>{
        var id = req.params.ClassId;
        console.log(id);
        var sql = `SELECT * FROM class WHERE Id = ${id}`;
        db.query(sql, function (err, rows,fields){
            if(err) throw err;
            console.log(rows);
            res.render('drop',{title: 'Drop class', class: rows[0]});
        });
        
    });

    app.post('/dropClass/submit', (req, res) => {
        const studentId = parseInt(req.body.studentid);
        const courseId = parseInt(req.body.courseId);
        const classId = parseInt(req.body.classid);
        const section = req.body.section;
        const year = parseInt(req.body.year);
        const semester = req.body.semester;
        req.session.user_id = studentId;
       console.log(classId, courseId, section, year, semester, studentId);
             student.dropClass(classId, courseId, section, year, semester, studentId, db).then(result =>{
                 console.log(result);
                 return result;
                 
             }).then(result=>{
                 res.redirect('/studentclasses');
                 return result[0];
             });
     
           });    
});

//######################################instructor work ################################################

app.get('/inswork', (req, res) => {
    res.render('getinsid');
     });

     app.post('/getinsid/submit',(req,res)=>{
        const email = req.body.email;
        let id;
        instructor.getInstructorIdFromEmail(email,db).then(result=>{
            console.log(result);
           id= req.session.user_id = result[1];
            console.log(id);
            return result;
        }).then(result =>{
            res.render('inswork');
            return result[0];
        });
        
        app.get('/view/current/class',(req,res)=>{
          
            console.log(req.session.user_id);
            instructor.getMyCurrentlyTaughtClasses(id,db).then(result =>{
                return result;
            }).then(result=>{
                res.render('inswork',{title: ' class', insclass: result});
                
            });
        });
    
        app.get('/view/previous/class',(req,res)=>{
          
            console.log(req.session.user_id);
            instructor.getMyTaughtClasses(id,db).then(result =>{
                return result;
            }).then(result=>{
                res.render('inswork',{title: ' class', insclass: result});
                
            });
        });
             
         app.get('/view/assigngrade',(req,res)=>{
          
            console.log(req.session.user_id);
            res.render('assigngrades');
        });

        app.post('/assigngrade/submit', (req, res) => {
            const studentid = parseInt(req.body.studentid);
            const insid = parseInt(req.body.insid);
            const classid = parseInt(req.body.classid);
            const grade = req.body.grade;
           console.log(insid, classid, studentid, grade);
                 instructor.assignGrade(insid, classid, studentid, grade, db).then(result =>{
                     console.log(result);
                     return result;
                     
                 }).then(result=>{
                     res.redirect('/view/assigngrade');
                     return result[0];
                 });
         
               });    
    });


app.get('/viewinsclass',(req,res)=>{
    allusers.getClasses(db).then(result=>{
        console.log(result);
        return result;
    }).then(result =>{
        res.render('viewinsclass',{title: 'classes', class: result});
        return result[0];
    });
});






//if logout button is pressed then log the user out of this session
//--------------------------------------------------------------------------------
app.post('/logout', async (req, res) => {
    delete req.session.user_name;
    console.log("After Logging out the username is: " + req.session.user_name);
    res.redirect('/');
});
//--------------------------------------------------------------------------------

//listen to a certain port on localhost to run the app
//--------------------------------------------------------
app.listen(3000, () => {
    console.log("Server Started on Port 3000");
});
//--------------------------------------------------------

exports.con = db;