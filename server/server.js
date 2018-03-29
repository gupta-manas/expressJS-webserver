var { mongoose } = require('./db/mongoose-config');
var { Todo } = require('./model/todoModel');
var express = require('express');
var bodyParser = require('body-parser');
var { ObjectID } = require('mongodb');
const _ = require('lodash');

var app = express();
app.use(bodyParser.json());

//Create a TODO
app.post('/todos', (req, res) => {

    var todo1 = new Todo({
        text: req.body.text
    });

    todo1.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    })
});

//Get all TODOs
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos });
    }, (err) => {
        res.status(400).send(err);
    });
});

//Find a particular TODO by Id
app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({ todo });
    }).catch((e) => {
        res.status(404).send();
    })

}, (err) => {
    res.status(400).send(err);
});

//Delete a TODO
app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send(todo);
    }).catch((e) => {
        res.status(404).send();
    })
});

/*Delete all TODOs
Todo.remove({}).then((result) =>{
    console.log(result)
});*/

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({ todo });
    }).catch((e) => {
        res.status(404).send();
    });
});

//Setup the server to run on a specified port number
app.listen(3000, () => {
    console.log('Express server started on port 3000!');
});