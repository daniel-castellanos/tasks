-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema angularcode_task
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema angularcode_task
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `angularcode_task` DEFAULT CHARACTER SET utf8 ;
USE `angularcode_task` ;

-- -----------------------------------------------------
-- Table `angularcode_task`.`tasks`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `angularcode_task`.`tasks` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT '',
  `task` VARCHAR(200) NOT NULL COMMENT '',
  `status` INT(11) NOT NULL COMMENT '',
  `position` INT(11) NOT NULL DEFAULT 0 COMMENT '',
  `created_at` INT(11) NOT NULL COMMENT '',
  PRIMARY KEY (`id`)  COMMENT '')
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = latin1;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `angularcode_task`.`tasks`
-- -----------------------------------------------------
START TRANSACTION;
USE `angularcode_task`;
INSERT INTO `angularcode_task`.`tasks` (`id`, `task`, `status`, `position`, `created_at`) VALUES (1, 'My first task', 0, 1, 1390815970);
INSERT INTO `angularcode_task`.`tasks` (`id`, `task`, `status`, `position`, `created_at`) VALUES (2, 'Perform unit testing', 2, 2, 1390815993);
INSERT INTO `angularcode_task`.`tasks` (`id`, `task`, `status`, `position`, `created_at`) VALUES (3, 'Find bugs', 2, 3, 1390817659);
INSERT INTO `angularcode_task`.`tasks` (`id`, `task`, `status`, `position`, `created_at`) VALUES (4, 'Test in small devices', 2, 4, 1390818389);

COMMIT;

