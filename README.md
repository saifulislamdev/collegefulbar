# Collegefulbar
Basic student management system for college and universities where students can , instructors can , and administrators can (proposal)

## Installation and Execution
1. Install [NodeJS](https://nodejs.org/en/)
2. Fill in database information (database name, host, user, and password) in `.env` file ([Environment Variables](#environmental-variables) section for instructions)
3. Run the script located at `sql/collegefulbar.sql`
4. From the command line 
```
cd app
npm install
npm start
```
5. Go to [http://localhost:3000](http://localhost:3000)

## Environmental Variables
1. Install "npm install dotenv"
2. Open up App Directory where Index.js is located
3. Find ".env" file 
4. Change DATABASE, DATABASE_PASSWORD, DATABASE_USER, DATABASE_PORT, DATABASE_HOST according to your local set up
5. Do not Use any quotations in this file.
6. Example inside the .env file:
	6a.DATABASE = test
	6b.DATABASE_PASSWORD = 123
	6c.DATABASE_USER = root
	6d.DATABASE_PORT = 3000
	6e.DATABASE_HOST = localhost
7. Go to index.js and inside the "CreateConnection" method for mysql connection do the following:
    7a.host: process.env.DATABASE_HOST, 
    7b.user: process.env.DATABASE_USER,
    7c.password: process.env.DATABASE_PASSWORD,
    7d.port: process.env.DATABASE_PORT
    7e.database: process.env.DATABASE,
    7f.multipleStatements: true   

## Tools Implemented
* NodeJS
* Express
* MySQL
* Handlebars
