-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Feb 11, 2024 at 06:54 PM
-- Server version: 8.0.31
-- PHP Version: 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `avani`
--

-- --------------------------------------------------------

--
-- Table structure for table `emp_login`
--

DROP TABLE IF EXISTS `emp_login`;
CREATE TABLE IF NOT EXISTS `emp_login` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user` varchar(30) NOT NULL,
  `pass` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `emp_login`
--

INSERT INTO `emp_login` (`id`, `user`, `pass`) VALUES
(1, 'cnu', '1234');

-- --------------------------------------------------------

--
-- Table structure for table `patientdetails`
--

DROP TABLE IF EXISTS `patientdetails`;
CREATE TABLE IF NOT EXISTS `patientdetails` (
  `rowid` int NOT NULL AUTO_INCREMENT,
  `patientname` varchar(30) NOT NULL,
  `mobile` varchar(30) NOT NULL,
  `visitedfrom` varchar(50) NOT NULL,
  `age` varchar(20) NOT NULL,
  `blood_pressure` varchar(20) NOT NULL,
  `dateofvisit` varchar(30) NOT NULL,
  `gender` varchar(20) NOT NULL,
  PRIMARY KEY (`rowid`)
) ENGINE=MyISAM AUTO_INCREMENT=118 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `patientdetails`
--

INSERT INTO `patientdetails` (`rowid`, `patientname`, `mobile`, `visitedfrom`, `age`, `blood_pressure`, `dateofvisit`, `gender`) VALUES
(117, 'suresh', '9876543219', 'warangal', '28', '88/122', '12-02-2024', 'male'),
(116, 'kjhkjh', '987987', 'uyuiy', '88', '6', '12-02-2024', 'male'),
(115, 'jhgjgj', '98908908', '87878', '88', '99', '12-02-2024', 'male'),
(114, 'kkhk', '9879789798', 'hkhkh', '89', '989', '12-02-2024', 'female'),
(113, 'suresh', '7172727272', 'hyderabad', '28', '80/120', '12-02-2024', 'male'),
(112, 'jgjg', '8777', 'jgjgjg', '78', '89', '11-02-2024', 'male'),
(111, 'khkjhk', '989797', 'iuyiyiyi', '99', '66', '11-02-2024', ''),
(110, 'jhkhkh', '987979', 'hkhk', '76', '989', '11-02-2024', ''),
(109, 'jhjhkh', '8979797', 'yuyuyu', '8', '88', '11-02-2024', ''),
(108, 'jhj', '8778', 'hjj', '889', '89', '11-02-2024', ''),
(107, 'jhjhhjh', '989879', 'hjhjkh', '89', '89', '11-02-2024', ''),
(106, 'jjjhjhkjh', '879797', 'hkhkh', '89', '98', '11-02-2024', ''),
(105, 'jhkjh', '78998789', 'kkhh', '879', '89', '11-02-2024', ''),
(104, 'bbbmb', '898989', 'hkh', '98', '88/90', '11-02-2024', ''),
(103, 'jkjhk', '0989089', 'kh', '98', '090', '11-02-2024', 'male'),
(102, 'jkk', '9088989', 'ukkjjk', '87', '88/99', '11-02-2024', ''),
(101, 'kjjkjk', '98898', 'hhh', '78', '7887', '11-02-2024', 'male'),
(100, 'jhjkh', '7987', 'hjhj', '76', '77/88', '11-02-2024', ''),
(99, 'sjk', '87788787', 'jjkkjjkkj', '77', '88/99', '11-02-2024', 'male'),
(98, 'asdasdas', '3877897879', 'jhgjgj', '78', '76/80', '11-02-2024', 'male'),
(97, 'sadas', '876', 'gjhjh', '87', '9898', '11-02-2024', '');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
