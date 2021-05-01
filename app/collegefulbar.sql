-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 01, 2021 at 08:16 PM
-- Server version: 10.4.17-MariaDB
-- PHP Version: 8.0.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `college-ful-bar`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounttype`
--

CREATE TABLE `accounttype` (
  `Name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `accounttype`
--

INSERT INTO `accounttype` (`Name`) VALUES
('Administrator'),
('Instructor'),
('Student');

-- --------------------------------------------------------

--
-- Table structure for table `class`
--

CREATE TABLE `class` (
  `Id` int(11) NOT NULL,
  `CourseId` int(11) DEFAULT NULL,
  `Section` varchar(255) DEFAULT NULL,
  `Instructor` int(11) DEFAULT NULL,
  `Year` smallint(6) DEFAULT NULL,
  `Semester` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `class`
--

INSERT INTO `class` (`Id`, `CourseId`, `Section`, `Instructor`, `Year`, `Semester`) VALUES
(32132, 1, 'P', 2, 2021, 'Spring'),
(32150, 1, 'R', 2, 2021, 'Spring'),
(32157, 1, 'H', 1, 2021, 'Spring'),
(32179, 1, 'M', 2, 2021, 'Spring'),
(34271, 1, 'P', 2, 2021, 'Fall'),
(34272, 1, 'R', 2, 2021, 'Fall'),
(34280, 1, 'A', 4, 2021, 'Fall');

-- --------------------------------------------------------

--
-- Table structure for table `course`
--

CREATE TABLE `course` (
  `Id` int(11) NOT NULL,
  `Title` varchar(255) DEFAULT NULL,
  `Dept` smallint(6) DEFAULT NULL,
  `Credits` smallint(6) DEFAULT NULL,
  `Cost` decimal(11,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `course`
--

INSERT INTO `course` (`Id`, `Title`, `Dept`, `Credits`, `Cost`) VALUES
(1, 'Database Systems', 1, 3, '1000.00'),
(2, 'Data Structures', 1, 3, '1000.00'),
(3, 'Algorithms', 1, 3, '1000.00');

-- --------------------------------------------------------

--
-- Table structure for table `currentsemester`
--

CREATE TABLE `currentsemester` (
  `Name` varchar(255) DEFAULT NULL,
  `Year` smallint(6) DEFAULT NULL,
  `DateAdded` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `currentsemester`
--

INSERT INTO `currentsemester` (`Name`, `Year`, `DateAdded`) VALUES
('Spring', 2021, '2021-05-01 14:13:45'),
('Spring', 2021, '2021-05-01 14:15:01');

-- --------------------------------------------------------

--
-- Table structure for table `department`
--

CREATE TABLE `department` (
  `Id` smallint(6) NOT NULL,
  `Name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `department`
--

INSERT INTO `department` (`Id`, `Name`) VALUES
(1, 'Computer Science'),
(2, 'Electrical Engineering'),
(3, 'Computer Engineering');

-- --------------------------------------------------------

--
-- Table structure for table `enrollment`
--

CREATE TABLE `enrollment` (
  `ClassId` int(11) NOT NULL,
  `StudentId` int(11) NOT NULL,
  `Grade` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `enrollment`
--

INSERT INTO `enrollment` (`ClassId`, `StudentId`, `Grade`) VALUES
(34271, 123, NULL),
(34280, 123, NULL),
(34280, 456, NULL),
(32132, 123, 'A'),
(32157, 123, 'A'),
(32157, 456, 'A');

-- --------------------------------------------------------

--
-- Table structure for table `grade`
--

CREATE TABLE `grade` (
  `Name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `grade`
--

INSERT INTO `grade` (`Name`) VALUES
('A'),
('B'),
('C'),
('D'),
('F');

-- --------------------------------------------------------

--
-- Table structure for table `instructor`
--

CREATE TABLE `instructor` (
  `Id` int(11) NOT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `instructor`
--

INSERT INTO `instructor` (`Id`, `Name`, `Email`) VALUES
(1, 'John Connor', 'john.anthony.connor@gmail.com'),
(2, 'Hesham Auda', 'hauda@ccny.cuny.edu'),
(3, 'Akbar Islam', 'nysaifulislam@gmail.com'),
(4, 'Akira Kawaguchi', 'akawaguchi@ccny.cuny.edu');

-- --------------------------------------------------------

--
-- Table structure for table `login`
--

CREATE TABLE `login` (
  `Email` varchar(255) NOT NULL,
  `Password` varchar(255) DEFAULT NULL,
  `AccountType` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `login`
--

INSERT INTO `login` (`Email`, `Password`, `AccountType`) VALUES
('admin@gmail.com', 'admin', 'Administrator'),
('john.anthony.connor@gmail.com', 'nothingbeatstwizzle', 'Instructor'),
('nysaifulislam@gmail.com', 'akbarisawesome', 'Student');

-- --------------------------------------------------------

--
-- Table structure for table `nextsemester`
--

CREATE TABLE `nextsemester` (
  `Name` varchar(255) DEFAULT NULL,
  `Year` smallint(6) DEFAULT NULL,
  `DateAdded` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `nextsemester`
--

INSERT INTO `nextsemester` (`Name`, `Year`, `DateAdded`) VALUES
('Fall', 2021, '2021-05-01 14:13:45'),
('Fall', 2021, '2021-05-01 14:15:02');

-- --------------------------------------------------------

--
-- Table structure for table `semester`
--

CREATE TABLE `semester` (
  `Name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `semester`
--

INSERT INTO `semester` (`Name`) VALUES
('Fall'),
('Spring'),
('Summer'),
('Winter');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `Id` int(11) NOT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `Credits` smallint(6) DEFAULT NULL,
  `Registered` tinyint(1) DEFAULT NULL,
  `Probation` tinyint(1) DEFAULT NULL,
  `SSN` varchar(9) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`Id`, `Name`, `Email`, `Credits`, `Registered`, `Probation`, `SSN`) VALUES
(1, 'John Doe', NULL, 0, 1, 0, '987654321'),
(123, 'Saiful Islam', 'nysaifulislam@gmail.com', 0, 1, 0, '123456789'),
(456, 'Akbar Haider', NULL, 0, 1, 0, '111111111');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounttype`
--
ALTER TABLE `accounttype`
  ADD PRIMARY KEY (`Name`);

--
-- Indexes for table `class`
--
ALTER TABLE `class`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `CourseId` (`CourseId`,`Section`,`Year`,`Semester`),
  ADD KEY `Instructor` (`Instructor`),
  ADD KEY `Semester` (`Semester`);

--
-- Indexes for table `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Dept` (`Dept`);

--
-- Indexes for table `currentsemester`
--
ALTER TABLE `currentsemester`
  ADD PRIMARY KEY (`DateAdded`),
  ADD KEY `Name` (`Name`);

--
-- Indexes for table `department`
--
ALTER TABLE `department`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `enrollment`
--
ALTER TABLE `enrollment`
  ADD PRIMARY KEY (`ClassId`,`StudentId`),
  ADD KEY `StudentId` (`StudentId`),
  ADD KEY `Grade` (`Grade`);

--
-- Indexes for table `grade`
--
ALTER TABLE `grade`
  ADD PRIMARY KEY (`Name`);

--
-- Indexes for table `instructor`
--
ALTER TABLE `instructor`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Indexes for table `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`Email`,`AccountType`),
  ADD KEY `AccountType` (`AccountType`);

--
-- Indexes for table `nextsemester`
--
ALTER TABLE `nextsemester`
  ADD PRIMARY KEY (`DateAdded`),
  ADD KEY `Name` (`Name`);

--
-- Indexes for table `semester`
--
ALTER TABLE `semester`
  ADD PRIMARY KEY (`Name`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `class`
--
ALTER TABLE `class`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34281;

--
-- AUTO_INCREMENT for table `department`
--
ALTER TABLE `department`
  MODIFY `Id` smallint(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=457;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `class`
--
ALTER TABLE `class`
  ADD CONSTRAINT `class_ibfk_1` FOREIGN KEY (`CourseId`) REFERENCES `course` (`Id`),
  ADD CONSTRAINT `class_ibfk_2` FOREIGN KEY (`Instructor`) REFERENCES `instructor` (`Id`),
  ADD CONSTRAINT `class_ibfk_3` FOREIGN KEY (`Semester`) REFERENCES `semester` (`Name`);

--
-- Constraints for table `course`
--
ALTER TABLE `course`
  ADD CONSTRAINT `course_ibfk_1` FOREIGN KEY (`Dept`) REFERENCES `department` (`Id`);

--
-- Constraints for table `currentsemester`
--
ALTER TABLE `currentsemester`
  ADD CONSTRAINT `currentsemester_ibfk_1` FOREIGN KEY (`Name`) REFERENCES `semester` (`Name`);

--
-- Constraints for table `enrollment`
--
ALTER TABLE `enrollment`
  ADD CONSTRAINT `enrollment_ibfk_1` FOREIGN KEY (`ClassId`) REFERENCES `class` (`Id`),
  ADD CONSTRAINT `enrollment_ibfk_2` FOREIGN KEY (`StudentId`) REFERENCES `student` (`Id`),
  ADD CONSTRAINT `enrollment_ibfk_3` FOREIGN KEY (`Grade`) REFERENCES `grade` (`Name`);

--
-- Constraints for table `login`
--
ALTER TABLE `login`
  ADD CONSTRAINT `login_ibfk_1` FOREIGN KEY (`AccountType`) REFERENCES `accounttype` (`Name`);

--
-- Constraints for table `nextsemester`
--
ALTER TABLE `nextsemester`
  ADD CONSTRAINT `nextsemester_ibfk_1` FOREIGN KEY (`Name`) REFERENCES `semester` (`Name`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
