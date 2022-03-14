-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 14, 2022 at 04:48 PM
-- Server version: 5.5.68-MariaDB
-- PHP Version: 8.0.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `teamb015`
--

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `problem_id`, `author`, `comment`) VALUES
(1, 2, 2, 'Clear cache.'),
(2, 1, 1, 'Submerge in bag of rice for 24 hours.');

--
-- Dumping data for table `company_roles`
--

INSERT INTO `company_roles` (`role`) VALUES
('Administrator'),
('Adviser'),
('Employee'),
('Manager'),
('Specialist');

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`name`) VALUES
('Employee'),
('IT'),
('Managing'),
('Operations');

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `name`, `role`, `extension`) VALUES
(1, 'Bert Thompson', 'Specialist', 101),
(2, 'Clara Hart', 'Specialist', 102),
(3, 'Nick Jefferson', 'Specialist', 103),
(4, 'Terry Perry', 'Adviser', 104),
(5, 'Dave Davidson', 'Adviser', 105),
(6, 'Lisa Poole', 'Employee', 106),
(7, 'Johnny Ipkiss', 'Employee', 107);

--
-- Dumping data for table `employee_problem_type_relation`
--

INSERT INTO `employee_problem_type_relation` (`id`, `problem_type`) VALUES
(1, 'Hardware'),
(2, 'Software'),
(3, 'Network');

--
-- Dumping data for table `hardware`
--

INSERT INTO `hardware` (`name`, `type`) VALUES
('Jabra Talk 15', 'Headset'),
('Lenovo LP7', 'Headset'),
('iPad Air', 'iPad'),
('iPad Pro ', 'iPad'),
('Asus Chromebook', 'Laptop'),
('MacBook Air', 'Laptop'),
('MacBook Pro', 'Laptop'),
('Microsoft Surface Pro 7', 'Laptop'),
('Dell Inspiron', 'PC'),
('HP Pavilion', 'PC'),
('Canon Pixma', 'Printer'),
('HP ENVY', 'Printer'),
('Galaxy Tab S8', 'Tablet'),
('LENOVO Tab M10', 'Tablet');

--
-- Dumping data for table `hardware_relation`
--

INSERT INTO `hardware_relation` (`id`, `name`, `employee_id`, `serial`) VALUES
(1, 'Asus Chromebook', 6, '127827'),
(2, 'MacBook Pro', 7, '726188'),
(3, 'Lenovo LP7', 7, '898181'),
(4, 'HP ENVY', 6, '919882'),
(5, 'Dell Inspiron', 7, '299388'),
(6, 'Dell Inspiron', 6, '635635');

--
-- Dumping data for table `job_info`
--

INSERT INTO `job_info` (`id`, `department`, `job_title`) VALUES
(1, 'IT', 'Technical Specialist'),
(2, 'IT', 'Technical Specialist'),
(3, 'IT', 'Technical Specialist'),
(4, 'IT', 'Technical Adviser'),
(6, 'Employee', 'Employee'),
(7, 'Employee', 'Employee');

--
-- Dumping data for table `job_title`
--

INSERT INTO `job_title` (`title`) VALUES
('Employee'),
('Operations Manager'),
('Senior Manager'),
('Technical Adviser'),
('Technical Specialist');

--
-- Dumping data for table `login_info`
--

INSERT INTO `login_info` (`id`, `password`) VALUES
(1, 'specialist'),
(2, 'specialist'),
(3, 'specialist'),
(4, 'adviser'),
(6, 'employee'),
(7, 'employee');

--
-- Dumping data for table `os`
--

INSERT INTO `os` (`name`) VALUES
('Android'),
('iOS 15'),
('macOS 12'),
('Windows 10'),
('Windows 11'),
('Windows 8');

--
-- Dumping data for table `problems`
--

INSERT INTO `problems` (`id`, `name`, `hardware`, `software`, `os`, `last_reviewed_by`, `employee`, `assigned_to`, `problem_type`, `solved`, `closed`, `closed_on`, `opened_on`) VALUES
(1, 'Dropped laptop in water.', 1, NULL, 'Windows 10', 1, 6, NULL, 'Hardware', 1, 1, '2022-03-06', '2022-03-02'),
(2, 'Chrome keeps freezing.', 6, 2, 'Windows 10', 2, 7, NULL, 'Software', 1, 1, '2022-03-10', '2022-02-22'),
(3, 'Bluetooth not connecting to laptop.', 2, NULL, 'macOS 12', NULL, 7, 3, 'Network', 0, 0, NULL, '2022-03-02'),
(4, 'Computer not booting up.', 6, NULL, 'Windows 11', 1, 6, 4, 'Hardware', 0, 0, NULL, '2022-03-01'),
(5, 'Application crashes frequently.', 2, 1, 'macOS 12', NULL, 7, 2, 'Software', 0, 0, NULL, '2022-02-27');

--
-- Dumping data for table `problem_status`
--

INSERT INTO `problem_status` (`status`) VALUES
('Awaiting support'),
('Comments recieved'),
('Pending solution');

--
-- Dumping data for table `problem_status_relation`
--

INSERT INTO `problem_status_relation` (`problem_id`, `status`) VALUES
(3, 'Awaiting support'),
(4, 'Awaiting support'),
(5, 'Awaiting support');

--
-- Dumping data for table `problem_types`
--

INSERT INTO `problem_types` (`problem_type`, `level`) VALUES
('Hardware', 1),
('Network', 1),
('Software', 1);

--
-- Dumping data for table `software`
--

INSERT INTO `software` (`name`, `type`) VALUES
('Google Chrome', 'Application'),
('Microsoft Excel', 'Application'),
('Microsoft Teams', 'Application'),
('Microsoft Word', 'Application'),
('Safari', 'Application');

--
-- Dumping data for table `software_relation`
--

INSERT INTO `software_relation` (`id`, `name`, `employee_id`, `license`) VALUES
(1, 'Microsoft Word', 7, 'GMWKB'),
(2, 'Google Chrome', 6, 'Freeware');

--
-- Dumping data for table `solutions`
--

INSERT INTO `solutions` (`problem_id`, `comment_id`) VALUES
(2, 1),
(1, 2);

--
-- Dumping data for table `type_of_hardware`
--

INSERT INTO `type_of_hardware` (`type`) VALUES
('Headset'),
('iPad'),
('Laptop'),
('PC'),
('Printer'),
('Tablet');

--
-- Dumping data for table `type_of_software`
--

INSERT INTO `type_of_software` (`type`) VALUES
('Application'),
('Driver'),
('Firmware'),
('Operating System');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;