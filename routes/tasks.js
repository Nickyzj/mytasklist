var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');

// var db = mongojs('mongodb://nicky:nicky@ds123370.mlab.com:23370/mytasklist_nicky', ['tasks']);
var databaseUrl = 'mongodb://localhost:27017/mytasklist';
var collections = ['tasks'];
var db = mongojs(databaseUrl, collections);

router.get('/tasks', function(req, res, next) {
    db.tasks.find(function(err, tasks) {
        if (err) {
            res.send(err);
        }
        res.json(tasks);
    });
});

router.get('/task/:id', (req, res, next) => {
    db.tasks.findOne({_id: mongojs.ObjectId(req.params.id)}, function(err, task) {
        if (err) {
            res.send(err);
        }
        res.json(task);
    });
});

router.post('/task', (req, res, next) => {
    var task = req.body;
    if ( !task.title || !(task.isDone + '')) {
        res.status(400);
        res.json({"error": "Bad Data"});
    } else {
        db.tasks.save(task, function(err, task) {
            if (err) {
                res.send(err);
            }
            res.json(task);
        });
    }
});

router.put('/task/:id', function(req, res, next) {
    var task = req.body;
    var updTask = {};

    if (task.isDone) {
        updTask.isDone = task.isDone;
    }
    if (task.title) {
        updTask.title = task.title;
    }

    if (!updTask) {
        res.status(400);
        res.json({"error": "Bad Data"});
    } else {
        db.tasks.update({_id: mongojs.ObjectId(req.params.id)}, updTask, {}, function(err, result) {
            if (err) {
                res.json(err);
            }
            res.json(task);
        });
    }
});

router.delete('/task/:id', (req, res, next) => {
    db.tasks.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, result) {
        if (err) {
            res.json(err);
        }
        res.json({"msg": "Delete success!"});
    });
});

module.exports = router;