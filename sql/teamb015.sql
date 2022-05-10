-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 20, 2022 at 08:34 PM
-- Server version: 5.5.68-MariaDB
-- PHP Version: 8.0.17

SET foreign_key_checks = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `teamb015`
--

-- --------------------------------------------------------

DROP TABLE IF EXISTS `comments`,
                    `company_roles`,
                    `departments`,
                    `employees`,
                    `employee_problem_type_relation`,
                    `hardware`,
                    `hardware_relation`,
                    `job_info`,
                    `job_title`,
                    `login_info`,
                    `os`,
                    `problems`,
                    `problem_status`,
                    `problem_status_relation`,
                    `problem_types`,
                    `software`,
                    `software_relation`,
                    `solutions`,
                    `type_of_hardware`,
                    `type_of_software`;

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `comment_id` int(11) NOT NULL,
  `problem_id` int(11) NOT NULL,
  `author` int(11) NOT NULL,
  `comment` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `company_roles`
--

CREATE TABLE `company_roles` (
  `role_id` int(11) NOT NULL,
  `role` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `department_id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `employee_id` int(11) NOT NULL,
  `name` text NOT NULL,
  `role_id` int(11) NOT NULL,
  `extension` varchar(14) DEFAULT NULL,
  `external` tinyint(1) NOT NULL DEFAULT '0',
  `available` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `employee_problem_type_relation`
--

CREATE TABLE `employee_problem_type_relation` (
  `employee_id` int(11) NOT NULL,
  `problem_type_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `hardware`
--

CREATE TABLE `hardware` (
  `hardware_id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `type_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `hardware_relation`
--

CREATE TABLE `hardware_relation` (
  `hardware_id` int(11) NOT NULL,
  `serial` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `job_info`
--

CREATE TABLE `job_info` (
  `employee_id` int(11) NOT NULL,
  `title_id` int(11) NOT NULL,
  `department_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `job_title`
--

CREATE TABLE `job_title` (
  `title_id` int(11) NOT NULL,
  `title` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `login_info`
--

CREATE TABLE `login_info` (
  `employee_id` int(11) NOT NULL,
  `password` text NOT NULL,
  `username` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `os`
--

CREATE TABLE `os` (
  `os_id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `problems`
--

CREATE TABLE `problems` (
  `problem_id` int(11) NOT NULL,
  `name` text NOT NULL,
  `problem_description` text DEFAULT NULL,
  `problem_type_id` int(11) DEFAULT NULL,
  `software_id` int(11) DEFAULT NULL,
  `hardware_id` int(11) DEFAULT NULL,
  `license` varchar(45) DEFAULT NULL,
  `serial` varchar(45) DEFAULT NULL,
  `last_reviewed_by` int(11) DEFAULT NULL,
  `employee` int(11) NOT NULL,
  `assigned_to` int(11) DEFAULT NULL,
  `solved` tinyint(1) NOT NULL DEFAULT '0',
  `closed` tinyint(1) NOT NULL DEFAULT '0',
  `closed_on` date DEFAULT NULL,
  `opened_on` date NOT NULL,
  `os_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `problem_status`
--

CREATE TABLE `problem_status` (
  `status_id` int(11) NOT NULL,
  `status` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `problem_status_relation`
--

CREATE TABLE `problem_status_relation` (
  `problem_id` int(11) NOT NULL,
  `status_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `problem_types`
--

CREATE TABLE `problem_types` (
  `problem_type_id` int(11) NOT NULL,
  `problem_type` varchar(45) NOT NULL,
  `child_of` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `software`
--

CREATE TABLE `software` (
  `software_id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `type_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `software_relation`
--

CREATE TABLE `software_relation` (
  `software_id` int(11) NOT NULL,
  `license` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `solutions`
--

CREATE TABLE `solutions` (
  `problem_id` int(11) NOT NULL,
  `comment_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `type_of_hardware`
--

CREATE TABLE `type_of_hardware` (
  `type_id` int(11) NOT NULL,
  `type` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `type_of_software`
--

CREATE TABLE `type_of_software` (
  `type_id` int(11) NOT NULL,
  `type` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `FK_115` (`author`),
  ADD KEY `FK_300` (`problem_id`);

--
-- Indexes for table `company_roles`
--
ALTER TABLE `company_roles`
  ADD PRIMARY KEY (`role_id`),
  ADD UNIQUE KEY `uniqye_role` (`role`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`department_id`),
  ADD UNIQUE KEY `unique_derpartment` (`name`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`employee_id`),
  ADD KEY `FK_311` (`role_id`);

--
-- Indexes for table `employee_problem_type_relation`
--
ALTER TABLE `employee_problem_type_relation`
  ADD PRIMARY KEY (`employee_id`,`problem_type_id`),
  ADD KEY `FK_347` (`problem_type_id`),
  ADD KEY `FK_68` (`employee_id`);

--
-- Indexes for table `hardware`
--
ALTER TABLE `hardware`
  ADD PRIMARY KEY (`hardware_id`),
  ADD KEY `FK_305` (`type_id`);

--
-- Indexes for table `hardware_relation`
--
ALTER TABLE `hardware_relation`
  ADD PRIMARY KEY (`hardware_id`,`serial`),
  ADD KEY `FK_260` (`hardware_id`);

--
-- Indexes for table `job_info`
--
ALTER TABLE `job_info`
  ADD PRIMARY KEY (`employee_id`),
  ADD KEY `FK_210` (`employee_id`),
  ADD KEY `FK_325` (`title_id`),
  ADD KEY `FK_330` (`department_id`);

--
-- Indexes for table `job_title`
--
ALTER TABLE `job_title`
  ADD PRIMARY KEY (`title_id`),
  ADD UNIQUE KEY `unique_job_title` (`title`);

--
-- Indexes for table `login_info`
--
ALTER TABLE `login_info`
  ADD PRIMARY KEY (`employee_id`),
  ADD UNIQUE KEY `unique_username` (`username`),
  ADD KEY `FK_122` (`employee_id`);

--
-- Indexes for table `os`
--
ALTER TABLE `os`
  ADD PRIMARY KEY (`os_id`),
  ADD UNIQUE KEY `unique_name` (`name`);

--
-- Indexes for table `problems`
--
ALTER TABLE `problems`
  ADD PRIMARY KEY (`problem_id`),
  ADD KEY `FK_190` (`os_id`),
  ADD KEY `FK_266` (`hardware_id`,`serial`),
  ADD KEY `FK_277` (`software_id`,`license`),
  ADD KEY `FK_350` (`problem_type_id`),
  ADD KEY `FK_85` (`assigned_to`),
  ADD KEY `FK_93` (`employee`),
  ADD KEY `FK_96` (`last_reviewed_by`);

--
-- Indexes for table `problem_status`
--
ALTER TABLE `problem_status`
  ADD PRIMARY KEY (`status_id`),
  ADD UNIQUE KEY `unique_status` (`status`);

--
-- Indexes for table `problem_status_relation`
--
ALTER TABLE `problem_status_relation`
  ADD PRIMARY KEY (`problem_id`),
  ADD KEY `FK_296` (`problem_id`),
  ADD KEY `FK_337` (`status_id`);

--
-- Indexes for table `problem_types`
--
ALTER TABLE `problem_types`
  ADD PRIMARY KEY (`problem_type_id`),
  ADD UNIQUE KEY `unique_problem_type` (`problem_type`),
  ADD KEY `FK_344` (`child_of`);

--
-- Indexes for table `software`
--
ALTER TABLE `software`
  ADD PRIMARY KEY (`software_id`),
  ADD KEY `FK_319` (`type_id`);

--
-- Indexes for table `software_relation`
--
ALTER TABLE `software_relation`
  ADD PRIMARY KEY (`software_id`,`license`),
  ADD KEY `FK_272` (`software_id`);

--
-- Indexes for table `solutions`
--
ALTER TABLE `solutions`
  ADD PRIMARY KEY (`problem_id`),
  ADD KEY `FK_128` (`comment_id`),
  ADD KEY `FK_292` (`problem_id`);

--
-- Indexes for table `type_of_hardware`
--
ALTER TABLE `type_of_hardware`
  ADD PRIMARY KEY (`type_id`),
  ADD UNIQUE KEY `unique_type_hardware` (`type`);

--
-- Indexes for table `type_of_software`
--
ALTER TABLE `type_of_software`
  ADD PRIMARY KEY (`type_id`),
  ADD UNIQUE KEY `unique_type_software` (`type`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `comment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `company_roles`
--
ALTER TABLE `company_roles`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `department_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hardware`
--
ALTER TABLE `hardware`
  MODIFY `hardware_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `job_title`
--
ALTER TABLE `job_title`
  MODIFY `title_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `os`
--
ALTER TABLE `os`
  MODIFY `os_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `problems`
--
ALTER TABLE `problems`
  MODIFY `problem_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `problem_status`
--
ALTER TABLE `problem_status`
  MODIFY `status_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `problem_types`
--
ALTER TABLE `problem_types`
  MODIFY `problem_type_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `software`
--
ALTER TABLE `software`
  MODIFY `software_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `type_of_hardware`
--
ALTER TABLE `type_of_hardware`
  MODIFY `type_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `type_of_software`
--
ALTER TABLE `type_of_software`
  MODIFY `type_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `FK_113` FOREIGN KEY (`author`) REFERENCES `employees` (`employee_id`),
  ADD CONSTRAINT `FK_298` FOREIGN KEY (`problem_id`) REFERENCES `problems` (`problem_id`);

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `FK_309` FOREIGN KEY (`role_id`) REFERENCES `company_roles` (`role_id`);

--
-- Constraints for table `employee_problem_type_relation`
--
ALTER TABLE `employee_problem_type_relation`
  ADD CONSTRAINT `FK_345` FOREIGN KEY (`problem_type_id`) REFERENCES `problem_types` (`problem_type_id`),
  ADD CONSTRAINT `FK_66` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`);

--
-- Constraints for table `hardware`
--
ALTER TABLE `hardware`
  ADD CONSTRAINT `FK_303` FOREIGN KEY (`type_id`) REFERENCES `type_of_hardware` (`type_id`);

--
-- Constraints for table `hardware_relation`
--
ALTER TABLE `hardware_relation`
  ADD CONSTRAINT `FK_258` FOREIGN KEY (`hardware_id`) REFERENCES `hardware` (`hardware_id`);

--
-- Constraints for table `job_info`
--
ALTER TABLE `job_info`
  ADD CONSTRAINT `FK_208` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`),
  ADD CONSTRAINT `FK_323` FOREIGN KEY (`title_id`) REFERENCES `job_title` (`title_id`),
  ADD CONSTRAINT `FK_328` FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`);

--
-- Constraints for table `login_info`
--
ALTER TABLE `login_info`
  ADD CONSTRAINT `FK_120` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`);

--
-- Constraints for table `problems`
--
ALTER TABLE `problems`
  ADD CONSTRAINT `FK_188` FOREIGN KEY (`os_id`) REFERENCES `os` (`os_id`),
  ADD CONSTRAINT `FK_263` FOREIGN KEY (`hardware_id`,`serial`) REFERENCES `hardware_relation` (`hardware_id`, `serial`),
  ADD CONSTRAINT `FK_274` FOREIGN KEY (`software_id`,`license`) REFERENCES `software_relation` (`software_id`, `license`),
  ADD CONSTRAINT `FK_348` FOREIGN KEY (`problem_type_id`) REFERENCES `problem_types` (`problem_type_id`),
  ADD CONSTRAINT `FK_83` FOREIGN KEY (`assigned_to`) REFERENCES `employees` (`employee_id`),
  ADD CONSTRAINT `FK_91` FOREIGN KEY (`employee`) REFERENCES `employees` (`employee_id`),
  ADD CONSTRAINT `FK_94` FOREIGN KEY (`last_reviewed_by`) REFERENCES `employees` (`employee_id`);

--
-- Constraints for table `problem_status_relation`
--
ALTER TABLE `problem_status_relation`
  ADD CONSTRAINT `FK_294` FOREIGN KEY (`problem_id`) REFERENCES `problems` (`problem_id`),
  ADD CONSTRAINT `FK_335` FOREIGN KEY (`status_id`) REFERENCES `problem_status` (`status_id`);

--
-- Constraints for table `problem_types`
--
ALTER TABLE `problem_types`
  ADD CONSTRAINT `FK_342` FOREIGN KEY (`child_of`) REFERENCES `problem_types` (`problem_type_id`);

--
-- Constraints for table `software`
--
ALTER TABLE `software`
  ADD CONSTRAINT `FK_317` FOREIGN KEY (`type_id`) REFERENCES `type_of_software` (`type_id`);

--
-- Constraints for table `software_relation`
--
ALTER TABLE `software_relation`
  ADD CONSTRAINT `FK_270` FOREIGN KEY (`software_id`) REFERENCES `software` (`software_id`);

--
-- Constraints for table `solutions`
--
ALTER TABLE `solutions`
  ADD CONSTRAINT `FK_126` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`comment_id`),
  ADD CONSTRAINT `FK_290` FOREIGN KEY (`problem_id`) REFERENCES `problems` (`problem_id`);
COMMIT;
