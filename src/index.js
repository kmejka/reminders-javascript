var restify = require('restify');
var remindersService = require('./remindersService');

var server = restify.createServer();
server.pre(restify.pre.userAgentConnection());
server.use(restify.acceptParser(server.acceptable));
server.use(restify.bodyParser());


server.get('/', function (req, res, next) {
    console.log('Received call for root path with content-type'+req.header('content-type'));
    
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
    console.log('Received get all user reminders with userId: %s', req.params.userId);
    
    var userId = req.params.userId;
    remindersService.getRemindersForUser(userId, function(reminders) {
        if (reminders !== undefined) {
            res.send(200, reminders);
        } else {
            res.send(404);
        }
    });
    next();
});

server.get('/users/:userId/reminders/:reminderId', function(req, res, next) {
    console.log('Received get user specific reminder with userId: %s reminderId: %s', req.params.userId, req.params.reminderId);

    var userId = req.params.userId;
    var reminderId = req.params.reminderId;
    remindersService.getReminderById(userId, reminderId, function(reminder) {
        if (reminder !== undefined) {
            res.send(200, reminder);
        } else {
            res.send(404);
        }
    });
    next();
});

server.post('/users/:userId/reminders', function(req, res, next) {
    console.log('Received post with new reminder with userId: %s body: %s', req.params.userId, req.body);

    if (!req.is('json')) {
        return next(new restify.InvalidContentError("Application only accepts 'application/json' content-type"));
    }
    if (!req.body) {
        return next(new restify.InvalidContentError("You need to specify the reminder which is to be created"));
    }

    var userId = req.params.userId;
    remindersService.addReminderForUser(userId, req.body, function(err, reminder) {
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

    console.log("running at host " + host + " port " + port);
});

