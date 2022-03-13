-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 13, 2022 at 06:50 PM
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

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `problem_id` int(11) NOT NULL,
  `author` int(11) NOT NULL,
  `comment` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `company_roles`
--

CREATE TABLE `company_roles` (
  `role` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `name` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `role` varchar(45) NOT NULL,
  `extension` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `employee_problem_type_relation`
--

CREATE TABLE `employee_problem_type_relation` (
  `id` int(11) NOT NULL,
  `problem_type` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `hardware`
--

CREATE TABLE `hardware` (
  `name` varchar(45) NOT NULL,
  `type` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `hardware_relation`
--

CREATE TABLE `hardware_relation` (
  `id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `serial` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `job_info`
--

CREATE TABLE `job_info` (
  `id` int(11) NOT NULL,
  `department` varchar(45) NOT NULL,
  `job_title` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `job_title`
--

CREATE TABLE `job_title` (
  `title` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `login_info`
--

CREATE TABLE `login_info` (
  `id` int(11) NOT NULL,
  `password` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `os`
--

CREATE TABLE `os` (
  `name` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `problems`
--

CREATE TABLE `problems` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `hardware` int(11) DEFAULT NULL,
  `software` int(11) DEFAULT NULL,
  `os` varchar(45) DEFAULT NULL,
  `last_reviewed_by` int(11) DEFAULT NULL,
  `employee` int(11) NOT NULL,
  `assigned_to` int(11) DEFAULT NULL,
  `problem_type` varchar(45) DEFAULT NULL,
  `solved` bit(1) NOT NULL DEFAULT b'0',
  `closed` bit(1) NOT NULL DEFAULT b'0',
  `closed_on` date DEFAULT NULL,
  `opened_on` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `problem_types`
--

CREATE TABLE `problem_types` (
  `problem_type` varchar(45) NOT NULL,
  `level` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `software`
--

CREATE TABLE `software` (
  `name` varchar(45) NOT NULL,
  `type` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `software_relation`
--

CREATE TABLE `software_relation` (
  `id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `license` text NOT NULL
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
  `type` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `type_of_software`
--

CREATE TABLE `type_of_software` (
  `type` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_111` (`problem_id`),
  ADD KEY `FK_115` (`author`);

--
-- Indexes for table `company_roles`
--
ALTER TABLE `company_roles`
  ADD PRIMARY KEY (`role`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`name`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_16` (`role`);

--
-- Indexes for table `employee_problem_type_relation`
--
ALTER TABLE `employee_problem_type_relation`
  ADD KEY `FK_68` (`id`),
  ADD KEY `FK_71` (`problem_type`);

--
-- Indexes for table `hardware`
--
ALTER TABLE `hardware`
  ADD PRIMARY KEY (`name`),
  ADD KEY `FK_164` (`type`);

--
-- Indexes for table `hardware_relation`
--
ALTER TABLE `hardware_relation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_172` (`name`),
  ADD KEY `FK_182` (`employee_id`);

--
-- Indexes for table `job_info`
--
ALTER TABLE `job_info`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_204` (`department`),
  ADD KEY `FK_207` (`job_title`),
  ADD KEY `FK_210` (`id`);

--
-- Indexes for table `job_title`
--
ALTER TABLE `job_title`
  ADD PRIMARY KEY (`title`);

--
-- Indexes for table `login_info`
--
ALTER TABLE `login_info`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_122` (`id`);

--
-- Indexes for table `os`
--
ALTER TABLE `os`
  ADD PRIMARY KEY (`name`);

--
-- Indexes for table `problems`
--
ALTER TABLE `problems`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_190` (`os`),
  ADD KEY `FK_193` (`software`),
  ADD KEY `FK_196` (`hardware`),
  ADD KEY `FK_78` (`problem_type`),
  ADD KEY `FK_85` (`assigned_to`),
  ADD KEY `FK_93` (`employee`),
  ADD KEY `FK_96` (`last_reviewed_by`);

--
-- Indexes for table `problem_types`
--
ALTER TABLE `problem_types`
  ADD PRIMARY KEY (`problem_type`);

--
-- Indexes for table `software`
--
ALTER TABLE `software`
  ADD PRIMARY KEY (`name`),
  ADD KEY `FK_153` (`type`);

--
-- Indexes for table `software_relation`
--
ALTER TABLE `software_relation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_169` (`name`),
  ADD KEY `FK_179` (`employee_id`);

--
-- Indexes for table `solutions`
--
ALTER TABLE `solutions`
  ADD PRIMARY KEY (`problem_id`),
  ADD KEY `FK_128` (`comment_id`),
  ADD KEY `FK_137` (`problem_id`);

--
-- Indexes for table `type_of_hardware`
--
ALTER TABLE `type_of_hardware`
  ADD PRIMARY KEY (`type`);

--
-- Indexes for table `type_of_software`
--
ALTER TABLE `type_of_software`
  ADD PRIMARY KEY (`type`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hardware_relation`
--
ALTER TABLE `hardware_relation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `problems`
--
ALTER TABLE `problems`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `software_relation`
--
ALTER TABLE `software_relation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `FK_109` FOREIGN KEY (`problem_id`) REFERENCES `problems` (`id`),
  ADD CONSTRAINT `FK_113` FOREIGN KEY (`author`) REFERENCES `employees` (`id`);

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `FK_14` FOREIGN KEY (`role`) REFERENCES `company_roles` (`role`);

--
-- Constraints for table `employee_problem_type_relation`
--
ALTER TABLE `employee_problem_type_relation`
  ADD CONSTRAINT `FK_66` FOREIGN KEY (`id`) REFERENCES `employees` (`id`),
  ADD CONSTRAINT `FK_69` FOREIGN KEY (`problem_type`) REFERENCES `problem_types` (`problem_type`);

--
-- Constraints for table `hardware`
--
ALTER TABLE `hardware`
  ADD CONSTRAINT `FK_162` FOREIGN KEY (`type`) REFERENCES `type_of_hardware` (`type`);

--
-- Constraints for table `hardware_relation`
--
ALTER TABLE `hardware_relation`
  ADD CONSTRAINT `FK_170` FOREIGN KEY (`name`) REFERENCES `hardware` (`name`),
  ADD CONSTRAINT `FK_180` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`);

--
-- Constraints for table `job_info`
--
ALTER TABLE `job_info`
  ADD CONSTRAINT `FK_202` FOREIGN KEY (`department`) REFERENCES `job_title` (`title`),
  ADD CONSTRAINT `FK_205` FOREIGN KEY (`job_title`) REFERENCES `departments` (`name`),
  ADD CONSTRAINT `FK_208` FOREIGN KEY (`id`) REFERENCES `employees` (`id`);

--
-- Constraints for table `login_info`
--
ALTER TABLE `login_info`
  ADD CONSTRAINT `FK_120` FOREIGN KEY (`id`) REFERENCES `employees` (`id`);

--
-- Constraints for table `problems`
--
ALTER TABLE `problems`
  ADD CONSTRAINT `FK_188` FOREIGN KEY (`os`) REFERENCES `os` (`name`),
  ADD CONSTRAINT `FK_191` FOREIGN KEY (`software`) REFERENCES `software_relation` (`id`),
  ADD CONSTRAINT `FK_194` FOREIGN KEY (`hardware`) REFERENCES `hardware_relation` (`id`),
  ADD CONSTRAINT `FK_76` FOREIGN KEY (`problem_type`) REFERENCES `problem_types` (`problem_type`),
  ADD CONSTRAINT `FK_83` FOREIGN KEY (`assigned_to`) REFERENCES `employees` (`id`),
  ADD CONSTRAINT `FK_91` FOREIGN KEY (`employee`) REFERENCES `employees` (`id`),
  ADD CONSTRAINT `FK_94` FOREIGN KEY (`last_reviewed_by`) REFERENCES `employees` (`id`);

--
-- Constraints for table `software`
--
ALTER TABLE `software`
  ADD CONSTRAINT `FK_151` FOREIGN KEY (`type`) REFERENCES `type_of_software` (`type`);

--
-- Constraints for table `software_relation`
--
ALTER TABLE `software_relation`
  ADD CONSTRAINT `FK_167` FOREIGN KEY (`name`) REFERENCES `software` (`name`),
  ADD CONSTRAINT `FK_177` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`);

--
-- Constraints for table `solutions`
--
ALTER TABLE `solutions`
  ADD CONSTRAINT `FK_126` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`),
  ADD CONSTRAINT `FK_135` FOREIGN KEY (`problem_id`) REFERENCES `problems` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
