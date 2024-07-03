USE `full-stack-ecommerce`;

SET foreign_key_checks = 0;

--
-- Table structure for table `country`
--

DROP TABLE IF EXISTS `country`;

CREATE TABLE `country` (
  `id` smallint unsigned NOT NULL,
  `code` varchar(2) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

--
-- Data for table `country`
--

INSERT INTO `country` VALUES 
(1,'US','United States'),
(2, 'ME', 'Middle Earth'),
(3, 'NA', 'Narnia'),
(4, 'WA', 'The Wasteland');

--
-- Table structure for table `state`
--

DROP TABLE IF EXISTS `state`;

CREATE TABLE `state` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `country_id` smallint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_country` (`country_id`),
  CONSTRAINT `fk_country` FOREIGN KEY (`country_id`) REFERENCES `country` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1;

--
-- Dumping data for table `state`
--

INSERT INTO `state` VALUES 
(1,'Alabama',1),
(2,'Alaska',1),
(3,'Arizona',1),
(4,'Arkansas',1),
(5,'California',1),
(6,'Colorado',1),
(7,'Connecticut',1),
(8,'Delaware',1),
(9,'Florida',1),
(10,'Georgia',1),
(11,'Hawaii',1),
(12,'Idaho',1),
(13,'Illinois',1),
(14,'Indiana',1),
(15,'Iowa',1),
(16,'Kansas',1),
(17,'Kentucky',1),
(18,'Louisiana',1),
(19,'Maine',1),
(20,'Maryland',1),
(21,'Massachusetts',1),
(22,'Michigan',1),
(23,'Minnesota',1),
(24,'Mississippi',1),
(25,'Missouri',1),
(26,'Montana',1),
(27,'Nebraska',1),
(28,'Nevada',1),
(29,'New Hampshire',1),
(30,'New Jersey',1),
(31,'New Mexico',1),
(32,'New York',1),
(33,'North Carolina',1),
(34,'North Dakota',1),
(35,'Ohio',1),
(36,'Oklahoma',1),
(37,'Oregon',1),
(38,'Pennsylvania',1),
(39,'Rhode Island',1),
(40,'South Carolina',1),
(41,'South Dakota',1),
(42,'Tennessee',1),
(43,'Texas',1),
(44,'Utah',1),
(45,'Vermont',1),
(46,'Virginia',1),
(47,'Washington',1),
(48,'West Virginia',1),
(49,'Wisconsin',1),
(50,'Wyoming',1),
(51,'Eriador',2),
(52,'The Blue Mountains',2),
(53,'The Misty Mountains',2),
(54,'Rhovanion',2),
(55,'Rohan',2),
(56,'Gondor',2),
(57,'Mordor',2),
(58,'Cair Paravel',3),
(59,'Beruna',3),
(60,'Beaversdam',3),
(61,'Chippingford',3),
(62,'New California',4),
(63,'The Capital Wasteland',4),
(64,'The Mojave Wasteland',4),
(65,'The Commonwealth',4),
(66,'Appalachia',4);

SET foreign_key_checks = 1;