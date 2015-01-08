#!/bin/bash

# This script automates the process of creating a MySQL database called
# `surveyor_db`, installing Surveyor's required node modules, and starting
# the ExpressJS-based server for the first time on the default port (3000)

# For security, once this script finishes, you should really change the user
# passwords in MySQL and config/config.json  ;)

# You can set your MySQL root password here for zero-interaction automation
# or leave this blank if you do not mind entering the password at run time
mysql_pw='root_password_or_blank'

npm=`which npm`
sql=`which mysql`

dbmakes='CREATE DATABASE `surveyor_db`; GRANT ALL PRIVILEGES ON `surveyor_db`.* TO surveyor_db@localhost IDENTIFIED BY "surveyor_db";'

if [ "$npm" == '' ]; then
  echo 'FATAL: "npm" not available, please check your PATH!'
else
  if [ "$sql" == '' ]; then
    echo 'FATAL: "mysql" not available, please check your PATH!'
  else
    if [ "$mysql_pw" == '' ]; then
      echo 'Please enter the MySQL root password:'
      echo $dbmakes | mysql -u root -p
    else
      echo $dbmakes | mysql -u root -p"$mysql_pw"
    fi
    $npm install
    $npm start
  fi
fi