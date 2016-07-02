<?php

class Database extends \PDO {

    var $pageSize = 20; //default page size; overrited by settings

    function __construct() {
        $dsn = \Settings::$db_dns;
        $username = \Settings::$db_user;
        $passwd = \Settings::$db_password;
        $options = array(
            self::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8',
        );
        $this->pageSize = \Settings::$db_page_size;
        parent::__construct($dsn, $username, $passwd, $options);
    }

}
