var models = require('../models');
var express = require('express');
var router = express.Router();

var guest_name = null;

function askme_guest_id_bootstrap_and_continue(req, res) {
  models.Guest.findAll({where: {email: guest_name}}).then(function(previous_guests) {
    if (! previous_guests.length) {
      models.Guest.create({
        email: guest_name
      }).then(function() {
        models.Guest.findAll({where: {email: guest_name}}).then(function(registered_guest) {
          guest_name = registered_guest[0].id.toString();
          console.log('Guest ID is: '+guest_name.toString());
          askme_common(req, res);
        });
      });
    } else {
      guest_name = previous_guests[0].id.toString();
      console.log('Guest ID is: '+guest_name.toString());
      askme_common(req, res);
    }
  });
}

function askme_random_int_inRange(mn,mx) {
  return Math.floor(Math.random()*(mx-mn+1))+mn;
}

function askme_final_render(req, res) {
  models.Question.findAll().then(function(questions) {
    models.Answer.findAll({where: {GuestId: guest_name}}).then(function(previous_answers) {
      var id = -1; var ok = true; var z = new Array();
      for (var x = 0 ; x < questions.length ; x++) {
        ok = true;
        for (var y = 0 ; y < previous_answers.length ; y++) {
          if (previous_answers[y].QuestionId==questions[x].id)
            ok = false;
        }
        if (ok) {
          z.push(questions[x].id);
        }
      }
      id = askme_random_int_inRange(0,(z.length-1));
      for (var x = 0 ; x < questions.length ; x++) {
        if (parseInt(questions[x].id)==z[id]) {
          id = x;
          break;
        }
      }
      console.log("Chose Q id: "+id.toString());
      if (!questions.length) {
        res.render('askme_none', {
          title: 'Surveyor'
        });
      } else {
        if (id >= 0) {
          var question = questions[id].question;
          var answers = questions[id].answers.split(',');
          var qid = questions[id].id.toString();
          res.render('askme', {
            title: 'Surveyor',
            question: question,
            answers: answers,
            qid: qid
          });
        } else {
          res.render('askme_none', {
            title: 'Surveyor'
          });
        }
      }
    });
  });
  guest_name = null;
}

function askme_common(req, res) {
  if (req.param('answer')!==undefined&&req.param('question')!==undefined) {
    if (req.param('answer').length&&req.param('question').length) {
      answer = req.param('answer');
      QuestionId = req.param('question');
      GuestId = guest_name.toString();
      models.Answer.create({
        answer: answer,
        QuestionId: QuestionId,
        GuestId: GuestId
      }).then(function() {
        askme_final_render(req, res);
      });
    } else {
      askme_final_render(req, res);
    }
  } else {
    askme_final_render(req, res);
  }
}

router.get('/', function(req, res) {
  if (req.cookies.guest_name!==undefined) {
    if (req.cookies.guest_name.length)
      guest_name = req.cookies.guest_name;
  }
  if (guest_name == null || guest_name.length < 1) {
    res.redirect('/');
  } else {
    console.log("Returning user!");
    askme_guest_id_bootstrap_and_continue(req, res);
  }
});

router.post('/', function(req, res) {
  if (req.param('email')!==undefined) {
    if (req.param('email').length) {
      guest_name = req.param('email');
      res.cookie('guest_name',guest_name);
    }
    console.log("First-time user!");
  } else {
    if (req.cookies.guest_name!==undefined) {
      if (req.cookies.guest_name.length)
        guest_name = req.cookies.guest_name;
    }
    console.log("Returning user!");
  }
  if (guest_name == null || guest_name.length < 1) {
    res.redirect('/');
  } else {
    askme_guest_id_bootstrap_and_continue(req, res);
  }
});

module.exports = router;
