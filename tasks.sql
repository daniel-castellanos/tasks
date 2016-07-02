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
  `created_at` INT(11) NOT NULL COMMENT '',
  `previous_tasks_id` INT(11) NULL COMMENT '',
  PRIMARY KEY (`id`)  COMMENT '',
  INDEX `fk_tasks_tasks_idx` (`previous_tasks_id` ASC)  COMMENT '',
  UNIQUE INDEX `previous_tasks_id_UNIQUE` (`previous_tasks_id` ASC)  COMMENT '',
  CONSTRAINT `fk_tasks_tasks`
    FOREIGN KEY (`previous_tasks_id`)
    REFERENCES `angularcode_task`.`tasks` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
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
INSERT INTO `angularcode_task`.`tasks` (`id`, `task`, `status`, `created_at`, `previous_tasks_id`) VALUES (1, 'My first task', 0, 0, null);
INSERT INTO `angularcode_task`.`tasks` (`id`, `task`, `status`, `created_at`, `previous_tasks_id`) VALUES (2, 'Perform unit testing', 2, 0, 1);
INSERT INTO `angularcode_task`.`tasks` (`id`, `task`, `status`, `created_at`, `previous_tasks_id`) VALUES (3, 'Find bugs', 2, 0, 2);
INSERT INTO `angularcode_task`.`tasks` (`id`, `task`, `status`, `created_at`, `previous_tasks_id`) VALUES (4, 'Test in small devices', 2, 0, 3);

COMMIT;

