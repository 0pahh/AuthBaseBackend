SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `ResetTokens` (
  `ID_Users` int(20) UNSIGNED NOT NULL,
  `token` varchar(255) NOT NULL,
  `expiration` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

CREATE TABLE `Users` (
  `ID` int(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `siret` varchar(14) NOT NULL,
  `sirene` varchar(9) NOT NULL,
  `address` text NOT NULL,
  `mail` varchar(255) NOT NULL,
  `phone` varchar(16) DEFAULT NULL,
  `userName` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `lastConnection` datetime NULL DEFAULT NULL,
  `creationDate` datetime NOT NULL,
  `lastPasswordUpdate` datetime NULL DEFAULT NULL,
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

ALTER TABLE `ResetTokens`
  ADD KEY `ID_Users` (`ID_Users`);

ALTER TABLE `Users`
  ADD PRIMARY KEY (`ID`);

ALTER TABLE `Users`
  MODIFY `ID` int(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

ALTER TABLE `ResetTokens`
  ADD CONSTRAINT `resettokens_ibfk_1` FOREIGN KEY (`ID_Users`) REFERENCES `Users` (`ID`);

COMMIT;

