-- This file contains the MySQL query to initialize the Gatormmunity database.
-- You can simply copy and paste the file's contents into MySQL Workbench to set up the database.

-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema gatormmunity
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `gatormmunity` ;
CREATE SCHEMA IF NOT EXISTS `gatormmunity` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `gatormmunity` ;

-- -----------------------------------------------------
-- Table `account`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `account` ;

CREATE TABLE IF NOT EXISTS `account` (
  `account_id` INT NOT NULL AUTO_INCREMENT,
  `password` VARCHAR(100) NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`account_id`),
  UNIQUE INDEX `id_UNIQUE` (`account_id` ASC) VISIBLE,
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC) VISIBLE,
  CONSTRAINT `FK_ACCOUNT_USER`
    FOREIGN KEY (`user_id`)
    REFERENCES `user` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `attachment`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `attachment` ;

CREATE TABLE IF NOT EXISTS `attachment` (
  `attachment_id` INT NOT NULL AUTO_INCREMENT,
  `filename` VARCHAR(512) NOT NULL,
  `image_path` VARCHAR(512) NOT NULL,
  `thumbnail_path` VARCHAR(512) NOT NULL,
  `post_id` INT NOT NULL,
  PRIMARY KEY (`attachment_id`),
  UNIQUE INDEX `id_UNIQUE` (`attachment_id` ASC) VISIBLE,
  UNIQUE INDEX `post_id_UNIQUE` (`post_id` ASC) VISIBLE,
  INDEX `fk_post_id_idx` (`post_id` ASC) VISIBLE,
  CONSTRAINT `FK_ATTACHMENT_POST`
    FOREIGN KEY (`post_id`)
    REFERENCES `post` (`post_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `chat_message`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `chat_message` ;

CREATE TABLE IF NOT EXISTS `chat_message` (
  `chat_message_id` INT NOT NULL AUTO_INCREMENT,
  `body` VARCHAR(5000) NOT NULL,
  `creation_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `group_id` INT NULL,
  `sender_id` INT NOT NULL,
  PRIMARY KEY (`chat_message_id`),
  UNIQUE INDEX `id_UNIQUE` (`chat_message_id` ASC) VISIBLE,
  INDEX `fk_chat_message_author_id_idx` (`sender_id` ASC) VISIBLE,
  INDEX `fk_group_id_idx` (`group_id` ASC) VISIBLE,
  CONSTRAINT `FK_CHATMESSAGE_GROUP`
    FOREIGN KEY (`group_id`)
    REFERENCES `group` (`group_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `FK_CHATMESSAGE_USER`
    FOREIGN KEY (`sender_id`)
    REFERENCES `user` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `conversation`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `conversation` ;

CREATE TABLE IF NOT EXISTS `conversation` (
  `conversation_id` INT NOT NULL AUTO_INCREMENT,
  `creation_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `smaller_user_id` INT NOT NULL,
  `larger_user_id` INT NOT NULL,
  PRIMARY KEY (`conversation_id`),
  INDEX `FKPK_CONVERSATION_LARGEUSER_idx` (`larger_user_id` ASC) VISIBLE,
  UNIQUE INDEX `user_id_pair_UNIQUE` (`smaller_user_id` ASC, `larger_user_id` ASC) INVISIBLE,
  UNIQUE INDEX `conversation_id_UNIQUE` (`conversation_id` ASC) VISIBLE,
  CONSTRAINT `FKPK_CONVERSATION_SMALLERUSER`
    FOREIGN KEY (`smaller_user_id`)
    REFERENCES `user` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `FKPK_CONVERSATION_LARGERUSER`
    FOREIGN KEY (`larger_user_id`)
    REFERENCES `user` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `direct_message`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `direct_message` ;

CREATE TABLE IF NOT EXISTS `direct_message` (
  `direct_message_id` INT NOT NULL AUTO_INCREMENT,
  `body` VARCHAR(5000) NOT NULL,
  `creation_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `sender_id` INT NOT NULL,
  `conversation_id` INT NOT NULL,
  PRIMARY KEY (`direct_message_id`),
  INDEX `FK_DIRECTMESSAGE_SENDERUSER_idx` (`sender_id` ASC) VISIBLE,
  UNIQUE INDEX `direct_message_id_UNIQUE` (`direct_message_id` ASC) VISIBLE,
  INDEX `FK_DIRECTMESSAGE_CONVERSATION_idx` (`conversation_id` ASC) VISIBLE,
  CONSTRAINT `FK_DIRECTMESSAGE_USER`
    FOREIGN KEY (`sender_id`)
    REFERENCES `user` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `FK_DIRECTMESSAGE_CONVERSATION`
    FOREIGN KEY (`conversation_id`)
    REFERENCES `conversation` (`conversation_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `group`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `group` ;

CREATE TABLE IF NOT EXISTS `group` (
  `group_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` VARCHAR(5000) NULL,
  `announcement` VARCHAR(5000) NULL,
  `picture_path` VARCHAR(512) NOT NULL,
  `picture_thumbnail_path` VARCHAR(512) NOT NULL,
  `creation_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`group_id`),
  UNIQUE INDEX `id_UNIQUE` (`group_id` ASC) VISIBLE,
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `group_user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `group_user` ;

CREATE TABLE IF NOT EXISTS `group_user` (
  `group_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `role` INT NOT NULL,
  PRIMARY KEY (`group_id`, `user_id`),
  INDEX `fk_group_user_user_id_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `FKPK_GROUPUSER_GROUP`
    FOREIGN KEY (`group_id`)
    REFERENCES `group` (`group_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `FKPK_GROUPUSER_USER`
    FOREIGN KEY (`user_id`)
    REFERENCES `user` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `listing`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `listing` ;

CREATE TABLE IF NOT EXISTS `listing` (
  `listing_id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` VARCHAR(5000) NOT NULL,
  `price` DECIMAL(7,2) NOT NULL,
  `category` VARCHAR(255) NOT NULL,
  `image_path` VARCHAR(512) NOT NULL,
  `image_thumbnail_path` VARCHAR(512) NOT NULL,
  `creation_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `seller_id` INT NOT NULL,
  PRIMARY KEY (`listing_id`),
  INDEX `FK_LISTING_SELLER_idx` (`seller_id` ASC) VISIBLE,
  UNIQUE INDEX `listing_id_UNIQUE` (`listing_id` ASC) VISIBLE,
  CONSTRAINT `FK_LISTING_USER`
    FOREIGN KEY (`seller_id`)
    REFERENCES `user` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `post`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `post` ;

CREATE TABLE IF NOT EXISTS `post` (
  `post_id` INT NOT NULL AUTO_INCREMENT,
  `body` VARCHAR(10000) NOT NULL,
  `is_original_post` TINYINT NOT NULL,
  `creation_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `thread_id` INT NOT NULL,
  `author_id` INT NOT NULL,
  PRIMARY KEY (`post_id`),
  UNIQUE INDEX `id_UNIQUE` (`post_id` ASC) VISIBLE,
  INDEX `fk_author_id_idx` (`author_id` ASC) VISIBLE,
  INDEX `fk_thread_id_idx` (`thread_id` ASC) VISIBLE,
  CONSTRAINT `FK_POST_THREAD`
    FOREIGN KEY (`thread_id`)
    REFERENCES `thread` (`thread_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `FK_POST_USER`
    FOREIGN KEY (`author_id`)
    REFERENCES `user` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `thread`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `thread` ;

CREATE TABLE IF NOT EXISTS `thread` (
  `thread_id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(255) NOT NULL,
  `creation_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `group_id` INT NULL,
  `creator_id` INT NOT NULL,
  PRIMARY KEY (`thread_id`),
  UNIQUE INDEX `id_UNIQUE` (`thread_id` ASC) VISIBLE,
  INDEX `fk_creator_id_idx` (`creator_id` ASC) VISIBLE,
  INDEX `fk_thread_group_id_idx` (`group_id` ASC) VISIBLE,
  CONSTRAINT `FK_THREAD_GROUP`
    FOREIGN KEY (`group_id`)
    REFERENCES `group` (`group_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `FK_THREAD_USER`
    FOREIGN KEY (`creator_id`)
    REFERENCES `user` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `user` ;

CREATE TABLE IF NOT EXISTS `user` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `sfsu_id_number` INT NOT NULL,
  `sfsu_id_picture_path` VARCHAR(512) NOT NULL,
  `profile_picture_path` VARCHAR(512) NOT NULL,
  `profile_picture_thumbnail_path` VARCHAR(512) NOT NULL,
  `role` INT NOT NULL DEFAULT 0,
  `join_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `banned_by_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `id_UNIQUE` (`user_id` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  UNIQUE INDEX `sfsu_id_number_UNIQUE` (`sfsu_id_number` ASC) VISIBLE,
  INDEX `fk_banned_by_id_idx` (`banned_by_id` ASC) VISIBLE,
  CONSTRAINT `FK_USER_USER`
    FOREIGN KEY (`banned_by_id`)
    REFERENCES `user` (`user_id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;