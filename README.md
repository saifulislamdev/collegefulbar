# Collegefulbar
Basic student management system for colleges and universities where students and instructors can manage their classes effortlessly and administrators can manage courses, classes, students, and more.

## Installation and Execution
1. Install [NodeJS](https://nodejs.org/en/)
2. Clone this project
```
$ git clone https://github.com/saifulislamdev/collegefulbar
$ cd collegefulbar/app/
```
3. Fill in your MySQL database information (database host, user, password, and name) in `.env` file ([Environment Variables](#environmental-variables) section for instructions)
4. For mock data, import/dump the script located at `app/collegefulbar.sql` into the database that is setup in the .env file
5. From the command line (in app/ folder)
```
$ npm install
$ npm start
```
6. Go to [http://localhost:3000](http://localhost:3000)
7. If step 4 was performed, you can use the following account logins with the app:
* For administrator: Email: admin@gmail.com, Password: admin
* For instructor: Email: john.anthony.connor@gmail.com, Password: nothingbeatstwizzle
* For student: Email: nysaifulislam@gmail.com, Password: akbarisawesome

## Environmental Variables
1. Create .env file (in app/ folder)
```
$ touch .env
```
2. In the .env file, setup your DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, and DATABASE information according to your local database setup. Do **not** use any quotations in this file. Example is shown below.
```
DATABASE_HOST = localhost
DATABASE_USER = root
DATABASE_PASSWORD = pass123
DATABASE = MyDatabaseName
```

## Tools Implemented
* NodeJS
* Express
* MySQL
* Handlebars
