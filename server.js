/*jshint esversion: 6 */

var express = require('express');
var app = express();
var parser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

app.use(express.static(__dirname))
   .use(parser.json())
   .use(parser.urlencoded({extended: false}));

mongoose.Promise = Promise;
var dbUrl = 'mongodb://user:Password1@ds151970.mlab.com:51970/learning-node';
const Message = mongoose.model('Message', {
    name: String,
    message: String
});

app.get('/messages',async (req, res) => {
    var messages = await Message.find({});
    res.send(messages);
});

app.get('/messages/:user',async (req, res) => {
    var user = req.params.user;
    var messages = await Message.find({name: user});
    res.send(messages);
});

app.post('/messages', async (req, res) => {
    console.log('post');
    try {
        var message = new Message(req.body);
        var savedMessage = await message.save();

        console.log('saved');
        var censored = await Message.findOne({message: 'badword'});
        if (censored) {
            await Message.remove({_id: censored.id});
        } else {
            io.emit('message', req.body);
        }
    } catch(error) {
        res.sendStatus(500);
        return console.error(error);
    } finally {
        console.info('message post called');
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');
});

mongoose.connect(dbUrl, (err) => {
    if (!err) {
        console.error('mongo db connection succesfull');
    } else {
        console.error('mongo db connection failure: ', err);
        mongoose.connection;
    }
});

var server =  http.listen(3000, () => {
    console.log('server is listening to port:', server.address().port);
});