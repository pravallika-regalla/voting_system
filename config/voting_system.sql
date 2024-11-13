-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 18, 2024 at 09:53 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `voting_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `candidates`
--

CREATE TABLE `candidates` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `party` varchar(100) NOT NULL,
  `age` int(11) NOT NULL,
  `qualification` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `candidates`
--

INSERT INTO `candidates` (`id`, `name`, `party`, `age`, `qualification`) VALUES
(1, 'John Cena', 'MQM', 25, 'BS CS'),
(5, 'Harry Potter', 'Gryffindor', 24, 'Aurore'),
(6, 'Draco Malfoy', 'Slytherin', 25, 'Professor of Majic'),
(7, 'Nevil Longbottom', 'Ravenclaw', 23, 'Potion Expert'),
(8, 'Harmione Granger ', 'Gryffindor', 24, 'Magician'),
(9, 'Albus Percival Wulfric Brian Dumbledore', 'Hogwarts', 76, 'Head Master'),
(10, 'Ginny Weasly', 'Gryffindor', 22, 'Professor');

-- --------------------------------------------------------

--
-- Table structure for table `candidate_election`
--

CREATE TABLE `candidate_election` (
  `id` int(11) NOT NULL,
  `candidate_id` int(11) NOT NULL,
  `election_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `candidate_election`
--

INSERT INTO `candidate_election` (`id`, `candidate_id`, `election_id`) VALUES
(4, 1, 1),
(10, 7, 10),
(11, 6, 10),
(12, 5, 10),
(13, 1, 10),
(17, 10, 10);

-- --------------------------------------------------------

--
-- Table structure for table `election`
--

CREATE TABLE `election` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `phase` enum('registration','voting','result') DEFAULT 'registration',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `election`
--

INSERT INTO `election` (`id`, `name`, `start_date`, `end_date`, `phase`, `created_at`, `updated_at`) VALUES
(1, 'Test', '2024-10-10 23:11:00', '2024-10-12 23:11:00', 'result', '2024-10-10 18:11:54', '2024-10-15 17:25:16'),
(10, 'Minister of Majic', '2024-10-17 21:24:00', '2024-10-19 21:24:00', 'registration', '2024-10-17 16:24:16', '2024-10-18 19:36:48');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `NID` int(15) DEFAULT NULL,
  `metamask_address` varchar(42) DEFAULT NULL,
  `role` enum('voter','admin') DEFAULT 'voter',
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `NID`, `metamask_address`, `role`, `is_active`, `created_at`, `updated_at`) VALUES
(4, 'John Doe', 'john@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', NULL, NULL, 'voter', 1, '2024-10-08 07:55:37', '2024-10-08 07:55:37'),
(5, 'Alex Whales', 'aw@ev.com', '$2a$10$KqZoIE3M2rvgAkMnWifmxuvaD7tyr6qgDCCO8ndgoCr42qBpYCpqa', 1224343433, '0x8a6e80055f4f0faba5ca546be944312fe3313a53', 'voter', 1, '2024-10-08 18:10:22', '2024-10-13 19:27:25'),
(6, 'Ahmed Saljuk', 'as@ev.com', '$2a$10$UOOb1rQ7p/yclr7eOzfvauRclr9VRBWQZZWk729MuJj0F4c8IpfKW', NULL, NULL, 'voter', 1, '2024-10-08 18:13:22', '2024-10-08 18:13:22'),
(7, 'abc', 'abc@xyx.com', '$2a$10$C/QVzr7EqOAQDvB5gAt4t.lTEQPI9wYwbVHtj8MdVae3ThyzELPKy', 1224343432, '0x8a6e80055f4f0faba5ca546be944312fe3313a51', 'voter', 1, '2024-10-10 12:08:11', '2024-10-17 17:06:53'),
(12, 'Lucifer', 'taimoorahamed95959@gmail.com', '$2a$10$pC6lvGJpDkkfZG6FXPgv8ekbZzXtG710eXA6koHPCtAc3wdamd0wy', NULL, NULL, 'admin', 1, '2024-10-10 17:06:26', '2024-10-10 22:00:39'),
(13, 'Succex', 'succex88@gmail.com', '$2a$10$d9ES6urijyFmjSq24qaK9.4pGzB3dgq49mKqkUGjNxZyHtzov7lam', 2147483647, '0x8a6e80055f4f0faba5ca546be944312fe3313a54', 'admin', 1, '2024-10-11 05:35:44', '2024-10-17 19:20:28'),
(14, 'Alex Whales', 'a@b.com', '$2a$10$YW0MuJdHO/fTa4FPNgv76u52Go0o43pXT3DU0pnNAbokJ/0Vaic1W', NULL, NULL, 'voter', 1, '2024-10-16 16:46:31', '2024-10-16 16:46:31');

-- --------------------------------------------------------

--
-- Table structure for table `voting_result`
--

CREATE TABLE `voting_result` (
  `id` int(11) NOT NULL,
  `election_id` int(11) NOT NULL,
  `candidate_id` int(11) NOT NULL,
  `voter_address` varchar(42) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `voting_result`
--

INSERT INTO `voting_result` (`id`, `election_id`, `candidate_id`, `voter_address`, `created_at`) VALUES
(2, 1, 1, '0x8a6e80055f4f0faba5ca546be944312fe3313a54', '2024-10-10 20:54:43'),
(3, 10, 6, '0x8a6e80055f4f0faba5ca546be944312fe3313a54', '2024-10-18 19:02:54');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `candidates`
--
ALTER TABLE `candidates`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `candidate_election`
--
ALTER TABLE `candidate_election`
  ADD PRIMARY KEY (`id`),
  ADD KEY `candidate_id` (`candidate_id`),
  ADD KEY `election_id` (`election_id`);

--
-- Indexes for table `election`
--
ALTER TABLE `election`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `metamask_address` (`metamask_address`);

--
-- Indexes for table `voting_result`
--
ALTER TABLE `voting_result`
  ADD PRIMARY KEY (`id`),
  ADD KEY `election_id` (`election_id`),
  ADD KEY `candidate_id` (`candidate_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `candidates`
--
ALTER TABLE `candidates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `candidate_election`
--
ALTER TABLE `candidate_election`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `election`
--
ALTER TABLE `election`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `voting_result`
--
ALTER TABLE `voting_result`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `candidate_election`
--
ALTER TABLE `candidate_election`
  ADD CONSTRAINT `candidate_election_ibfk_1` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `candidate_election_ibfk_2` FOREIGN KEY (`election_id`) REFERENCES `election` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `voting_result`
--
ALTER TABLE `voting_result`
  ADD CONSTRAINT `voting_result_ibfk_1` FOREIGN KEY (`election_id`) REFERENCES `election` (`id`),
  ADD CONSTRAINT `voting_result_ibfk_2` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
