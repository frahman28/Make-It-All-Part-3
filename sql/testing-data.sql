-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 20, 2022 at 08:52 PM
-- Server version: 5.5.68-MariaDB
-- PHP Version: 8.0.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `teamb015`
--

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`comment_id`, `problem_id`, `author`, `comment`) VALUES
(1, 1, 126711, 'Submerge in bag of rice for 24 hours.'),
(2, 2, 228787, 'Clear Cache.'),
(3, 3, 329922, 'Update bluetooth drivers.'),
(4, 2, 228787, 'Update windows version.');

--
-- Dumping data for table `company_roles`
--

INSERT INTO `company_roles` (`role_id`, `role`) VALUES
(1, 'Administrator'),
(2, 'Adviser'),
(3, 'Employee'),
(4, 'Manager'),
(5, 'Specialist');

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`department_id`, `name`) VALUES
(1, 'Employee'),
(2, 'IT'),
(3, 'Managing'),
(4, 'Operations');

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`employee_id`, `name`, `role_id`, `extension`, `external`, `available`) VALUES
(126711, 'Bert Thompson', 5, '101', 0, 1),
(228787, 'Clara Hart', 5, '102', 0, 1),
(329922, 'Nick Jefferson', 5, '103', 0, 1),
(400393, 'Terry Perry', 2, '104', 0, 1),
(573827, 'Dave Davidson', 2, '105', 0, 1),
(609093, 'Lisa Poole', 3, '106', 0, 1),
(737277, 'Johnny Ipkiss', 3, '107', 0, 1);

--
-- Dumping data for table `employee_problem_type_relation`
--

INSERT INTO `employee_problem_type_relation` (`employee_id`, `problem_type_id`) VALUES
(126711, 1),
(228787, 2),
(329922, 3);

--
-- Dumping data for table `hardware`
--

INSERT INTO `hardware` (`hardware_id`, `name`, `type_id`) VALUES
(1, 'Jabra Talk 15', 1),
(2, 'Lenovo LP7', 1),
(3, 'iPad Air', 2),
(4, 'iPad Pro ', 2),
(5, 'Asus Chromebook', 3),
(6, 'MacBook Air', 3),
(7, 'MacBook Pro', 3),
(8, 'Microsoft Surface Pro 7', 3),
(9, 'Dell Inspiron', 4),
(10, 'HP Pavilion', 4),
(11, 'Canon Pixma', 5),
(12, 'HP ENVY', 5),
(13, 'Galaxy Tab S8', 6),
(14, 'LENOVO Tab M10', 6);

--
-- Dumping data for table `hardware_relation`
--

INSERT INTO `hardware_relation` (`hardware_id`, `serial`) VALUES
(1, '127827'),
(2, '726188'),
(3, '898181'),
(4, '919882'),
(5, '299388'),
(6, '635635'),
(7, '272718'),
(8, '127827'),
(9, '726188'),
(10, '898181'),
(11, '919882'),
(12, '299388'),
(13, '635635'),
(14, '288738');

--
-- Dumping data for table `job_info`
--

INSERT INTO `job_info` (`employee_id`, `title_id`, `department_id`) VALUES
(126711, 5, 2),
(228787, 5, 2),
(329922, 5, 2),
(400393, 4, 2),
(573827, 4, 2),
(609093, 1, 1),
(737277, 1, 1);

--
-- Dumping data for table `job_title`
--

INSERT INTO `job_title` (`title_id`, `title`) VALUES
(1, 'Employee'),
(2, 'Operations Manager'),
(3, 'Senior Manager'),
(4, 'Technical Adviser'),
(5, 'Technical Specialist');

--
-- Dumping data for table `login_info`
--

INSERT INTO `login_info` (`employee_id`, `password`, `username`) VALUES
(126711, '$2a$15$52hdF/KGr0PISjAG9dBOGePi5nyNSHksToroeyr6gcGSTRMzW3vUi', 'bthompson'),
(228787, '$2a$15$52hdF/KGr0PISjAG9dBOGePi5nyNSHksToroeyr6gcGSTRMzW3vUi', 'chart'),
(329922, '$2a$15$52hdF/KGr0PISjAG9dBOGePi5nyNSHksToroeyr6gcGSTRMzW3vUi', 'njefferson'),
(400393, '$2a$15$VMv21TgBN76umEcpEYzrRupXKENrT2.NKmxaj6i5O4Zz9/QEOKi96', 'tperry'),
(573827, '$2a$15$VMv21TgBN76umEcpEYzrRupXKENrT2.NKmxaj6i5O4Zz9/QEOKi96', 'bigddavidson'),
(609093, '$2a$15$sbT60XaES9wqX1kW6T0gPufmX1UJ8gokcNvcEKmdJYTS1U49ddfZK', 'lpoole'),
(737277, '$2a$15$sbT60XaES9wqX1kW6T0gPufmX1UJ8gokcNvcEKmdJYTS1U49ddfZK', 'jipkiss');

--
-- Dumping data for table `os`
--

INSERT INTO `os` (`os_id`, `name`) VALUES
(1, 'Android'),
(2, 'iOS 15'),
(3, 'macOS 12'),
(4, 'Windows 10'),
(5, 'Windows 11'),
(6, 'Windows 8');

--
-- Dumping data for table `problems`
--

INSERT INTO `problems` (`problem_id`, `name`, `problem_type_id`, `software_id`, `hardware_id`, `license`, `serial`, `last_reviewed_by`, `employee`, `assigned_to`, `solved`, `closed`, `closed_on`, `opened_on`, `os_id`) VALUES
(1, 'Dropped laptop in water.', 1, NULL, 5, NULL, '299388', 126711, 609093, NULL, 1, 1, '2022-03-15', '2022-03-09', 4),
(2, 'Chrome keeps freezing.', 2, 1, 9, '122611', '726188', 228787, 737277, NULL, 1, 1, '2022-03-09', '2022-03-03', 6),
(3, 'Bluetooth not connecting to laptop.', 3, NULL, 1, NULL, '127827', NULL, 737277, 329922, 0, 0, NULL, '2022-03-09', 5),
(4, 'Computer not booting up.', 1, NULL, 9, NULL, '726188', NULL, 609093, 126711, 0, 0, NULL, '2022-03-09', 5),
(5, 'Application crashes frequently.', 2, 2, 4, '898282', '919882', NULL, 609093, 228787, 0, 0, NULL, '2022-03-04', 2);

--
-- Dumping data for table `problem_status`
--

INSERT INTO `problem_status` (`status_id`, `status`) VALUES
(1, 'Awaiting support'),
(2, 'Comments recieved'),
(3, 'Pending solution');

--
-- Dumping data for table `problem_status_relation`
--

INSERT INTO `problem_status_relation` (`problem_id`, `status_id`) VALUES
(4, 1),
(5, 1),
(3, 2);

--
-- Dumping data for table `problem_types`
--

INSERT INTO `problem_types` (`problem_type_id`, `problem_type`, `child_of`) VALUES
(1, 'Hardware', NULL),
(2, 'Software', NULL),
(3, 'Network', NULL);

--
-- Dumping data for table `software`
--

INSERT INTO `software` (`software_id`, `name`, `type_id`) VALUES
(1, 'Google Chrome', 1),
(2, 'Microsoft Excel', 1),
(3, 'Microsoft Teams', 1),
(4, 'Microsoft Word', 1),
(5, 'Safari', 1);

--
-- Dumping data for table `software_relation`
--

INSERT INTO `software_relation` (`software_id`, `license`) VALUES
(1, '122611'),
(2, '898282'),
(3, '881821'),
(4, '909201'),
(5, '029100');

--
-- Dumping data for table `solutions`
--

INSERT INTO `solutions` (`problem_id`, `comment_id`) VALUES
(1, 1),
(2, 4);

--
-- Dumping data for table `type_of_hardware`
--

INSERT INTO `type_of_hardware` (`type_id`, `type`) VALUES
(1, 'Headset'),
(2, 'iPad'),
(3, 'Laptop'),
(4, 'PC'),
(5, 'Printer'),
(6, 'Tablet');

--
-- Dumping data for table `type_of_software`
--

INSERT INTO `type_of_software` (`type_id`, `type`) VALUES
(1, 'Application'),
(2, 'Driver'),
(3, 'Firmware'),
(4, 'Operating System');
COMMIT;
