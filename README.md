Surveyor
========

A mobile-friendly survey-generation and survey-display system backed by MySQL storage and leveraging jQuery Mobile.

Requirements
------------

* A system capable of running `npm` with `npm` in `$PATH`
* A system capable of running `node` with `node` in `$PATH`
* A system with MySQL server installed and `mysql` in `$PATH`
  * *This should be compatible with MariaDB, but it wasn't tested* 
* **Tested Systems:**
  * Mac OS X Yosemite with official Node and MySQL packages
  * Ubuntu 14.04 LTS with official `npm`, `nodejs-legacy`, and `mysql-server` packages

Quickstart
----------

**First run:**

Assuming `npm`, `node`, `mysql` are in your `$PATH` and the MySQL server is running, you can simply edit the `mysql_pw` variable in `quickrun.sh` and run it.  It will create the database, grant privileges to it, and start the ExpressJS-based server.

**Accessing it:**

The server runs on port 3000 by default.  Survey-takers can visit:

`http://server.address:3000/`

A question-adding and answer-viewing admin interface is available by visiting:

`http://server.address:3000/admin`

*The default username is `admin`, the default password is `admin`*

**Subsequent runs:**

From within your local repo copy, just run:

`npm start`

Room for Improvement
--------------------

Future improvements could be made:

* Easier way to set the admin password
* Better security for the admin password (in the DB, it's currently MD5-based)
* Allow editing of existing questions
* Allow deletion of existing questions

*Let it be said this project is an academic exercise, of sorts.*

Licence
-------

In brief:

* Surveyor is provided to the public for non-commercial educational use only.
* Surveyor may NOT be modified or used for commercial use without the express prior written consent of Quinn Ebert.
* Quinn Ebert's endorsement or direct sharing of Surveyor does NOT constitute express prior written consent for modification or commercial use.