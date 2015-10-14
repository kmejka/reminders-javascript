var uuid = require('node-uuid');
var utils = require('./utils');
var Logger = require('bunyan');
var log = new Logger({name: 'reminderService', streams: [{stream: process.stdout, level: 'debug'}, {path: 'service.log', level: 'info'}]});

var dataStore = {};

function getAllUsers() {
    return;
}

function returnAll() {
    return;
}

function getReminderById(userId, reminderId, callback) {
    log.info("filtering reminders for user: %s, reminderId: %s", userId, reminderId);
    log.debug("dataStore", dataStore);

    if (dataStore.hasOwnProperty(userId)) {
        var reminders = dataStore[userId].filter(function(item) {
                return item.id === reminderId;
            });
        log.debug("reminders after filtering:", reminders);
        callback(utils.findFirst(reminders));
    } else {
        callback();
    }
}

function getRemindersForUser(userId, callback) {
    log.info("filtering reminders for user: %s", userId);
    log.debug("dataStore", dataStore);

    if (dataStore.hasOwnProperty(userId)) {
        callback(dataStore[userId]);
    } else {
        callback();
    } 
}

function addReminderForUser(userId, reminder, callback) {
    log.info("storing reminder for user: %s, reminder:", userId, reminder);
    log.debug("dataStore", dataStore);

    if (!reminder.hasOwnProperty("title")) {
        callback("Reminder has no title set", null);
    }
    reminder.id = uuid.v4();

    if (dataStore.hasOwnProperty(userId)) {
        dataStore[userId].push(reminder);
        callback(null, reminder);
    } else {
        dataStore[userId] = [reminder];
        callback(null, reminder);
    }

}

exports.getReminderById = getReminderById;
exports.getRemindersForUser = getRemindersForUser;
exports.addReminderForUser = addReminderForUser;
