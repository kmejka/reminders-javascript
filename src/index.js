var restify = require('restify');
var remindersDao = require('./remindersDao');
var Logger = require('bunyan');
var log = new Logger({name: 'remindersEndpoint', streams: [{stream: process.stdout, level: 'debug'}, {path: 'service.log', level: 'info'}]});

var server = restify.createServer({
    name: 'Reminders service',
    log: log
});

server.pre(restify.pre.userAgentConnection());

server.pre(function(req, res, next) {
    req.log.info({request: req}, 'received request');
    next();
});

server.on('after', function(req, res, route) {
    req.log.info({response: res}, 'returning response');
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.bodyParser());


server.get('/', function (req, res, next) {
    
    res.send('Reminders service');
    next();
});

//is this a proper endpoint for such a service?
server.get('/users/', function(req, res, next) {
    res.status(503);
    res.send('Not implemented yet');
    next();
});

server.get('/users/:userId/reminders', function(req, res, next) {
    
    var userId = req.params.userId;
    remindersDao.getRemindersForUser(userId, function(reminders) {
        if (reminders !== undefined) {
            res.send(200, reminders);
        } else {
            res.send(404);
        }
    });
    next();
});

server.get('/users/:userId/reminders/:reminderId', function(req, res, next) {

    var userId = req.params.userId;
    var reminderId = req.params.reminderId;
    remindersDao.getReminderById(userId, reminderId, function(reminder) {
        if (reminder !== undefined) {
            res.send(200, reminder);
        } else {
            res.send(404);
        }
    });
    next();
});

server.post('/users/:userId/reminders', function(req, res, next) {

    if (!req.is('json')) {
        return next(new restify.InvalidContentError("Application only accepts 'application/json' content-type"));
    }
    if (!req.body) {
        return next(new restify.InvalidContentError("You need to specify the reminder which is to be created"));
    }

    var userId = req.params.userId;
    remindersDao.addReminderForUser(userId, req.body, function(err, reminder) {
        if (err) {
            return next(new restify.BadRequestError(err));
        }
        res.header('Location', "/users/"+userId+"/reminders/"+reminder.id);
        res.send(201);
    });
    next();
});


server.listen('8080', function() {
    var host = server.address().address;
    var port = server.address().port;
    log.info("server started at host: %s, port: %s", host, port);
});

