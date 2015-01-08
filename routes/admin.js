var models = require('../models');
var express = require('express');
var router = express.Router();

var md5 = require('blueimp-md5').md5;

var admin_sess = null;

function admin_attempted_login(req, res, then) {
  if (req.param('username')!==undefined&&req.param('password')!==undefined) {
    if (req.param('username').length&&req.param('password').length) {
      then(req, res, true);
    }
  }
  then(req, res, false);
}

function admin_conditionally_add_question(req, res, then) {
  if (req.param('question')!==undefined&&req.param('answers')!==undefined) {
    if (req.param('question').length&&req.param('answers').length) {
      var q=req.param('question');
      var a=req.param('answers');
      models.Question.create({
        question: q,
        answers: a
      }).then(function() {
        then(req, res);
      });
    } else {
      then(req, res);
    }
  } else {
    then(req, res);
  }
}

function admin_check_userpass(req, res, then) {
  if (req.cookies.admin_sess!==undefined) {
    console.log('Have admin cookie: '+req.cookies.admin_sess);
    if (req.cookies.admin_sess.length)
      admin_sess = req.cookies.admin_sess;
  } else {
    console.log('No admin cookie');
  }
  if (admin_sess == null || admin_sess.length < 1) {
    if (req.param('username')!==undefined&&req.param('password')!==undefined) {
      if (req.param('username').length&&req.param('password').length) {
        var u=req.param('username');
        var p=md5(req.param('password'));
        models.Admin.findAll({where: ["`username`=? AND `base_key`=?",u,p]}).then(function(auth_res) {
          if (auth_res.length) {
            models.Question.findAll().then(function(questions) {
              console.log("Auth OK");
              res.cookie('admin_sess',p);
              then(req, res, true, questions);
            });
          } else {
            then(req, res, false, null);
          }
        });
      } else {
        then(req, res, false, null);
      }
    } else {
      then(req, res, false, null);
    }
  } else {
	var p=admin_sess;
	models.Admin.findAll({where: ["`base_key`=?",p]}).then(function(auth_res) {
	  if (auth_res.length) {
		models.Question.findAll().then(function(questions) {
		  console.log("Auth OK, saved credo "+p);
		  then(req, res, true, questions);
		});
	  } else {
		then(req, res, false, null);
	  }
	});
  }
}

function admin_check_needs_init(req, res, then) {
  models.Admin.findAll().then(function(adminRes) {
    if (! adminRes.length) {
      models.Admin.create({
        username: 'admin',
        base_key: md5('admin')
      }).then(function() {
        then(req, res);
      });
    } else {
      then(req, res);
    }
  });
}

function admin_final_render(req, res, jade, data) {
  res.render(jade, data);
  admin_sess = null;
}

function admin_main(req, res) {
  admin_check_needs_init(req, res,
    function(req, res) {
      admin_conditionally_add_question(req, res,
        function(req, res) {
          admin_check_userpass(req, res,
            function(req, res, checkRes, data) {
              if (!checkRes) {
                admin_attempted_login(req, res,
                  function(req, res, checkRes) {
                    if (!checkRes) {
                      if (req.param('username')!==undefined&&req.param('password')!==undefined) {
                        if (req.param('username').length&&req.param('password').length) {
                          admin_final_render(req, res, 'admin_auth', {title: 'Surveyor', message: 'Login failed'});
                        } else {
                          admin_final_render(req, res, 'admin_auth', {title: 'Surveyor'});
                        }
                      } else {
                        admin_final_render(req, res, 'admin_auth', {title: 'Surveyor'});
                      }
                    } else {
                      admin_final_render(req, res, 'admin_auth', {title: 'Surveyor'});
                    }
                  }
                );
              } else {
                admin_final_render(req, res, 'admin_main', {title: 'Surveyor', questions: data});
              }
            }
          );
        }
      );
    }
  );
}

function admin_view(req, res) {
  admin_check_needs_init(req, res,
    function(req, res) {
      admin_check_userpass(req, res,
        function(req, res, checkRes, data) {
          // NOTE: `data` isn't used in admin_view!
          if (!checkRes) {
            admin_attempted_login(req, res,
              function(req, res, checkRes) {
                if (!checkRes) {
                  if (req.param('username')!==undefined&&req.param('password')!==undefined) {
                    if (req.param('username').length&&req.param('password').length) {
                      admin_final_render(req, res, 'admin_auth', {title: 'Surveyor', message: 'Login failed'});
                    } else {
                      admin_final_render(req, res, 'admin_auth', {title: 'Surveyor'});
                    }
                  } else {
                    admin_final_render(req, res, 'admin_auth', {title: 'Surveyor'});
                  }
                } else {
                  admin_final_render(req, res, 'admin_auth', {title: 'Surveyor'});
                }
              }
            );
          } else {
            models.Answer.findAll({include: [models.Guest],where: {QuestionId: req.param('question_id')}}).then(function(answers) {
              admin_final_render(req, res, 'admin_view', {title: 'Surveyor', answers: answers});
            });
          }
        }
      );
    }
  );
}

router.get('/', function(req, res) {
  admin_main(req, res);
});

router.post('/', function(req, res) {
  admin_main(req, res);
});

router.get('/:question_id/view', function(req, res) {
  admin_view(req, res);
});

module.exports = router;
