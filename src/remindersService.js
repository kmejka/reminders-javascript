var uuid = require('node-uuid');
var utils = require('./utils');
// var log //todo!!!
var dataStore = {};

function getAllUsers() {
    return dataStore;
}

function returnAll() {
    return dataStore;
}

function getReminderById(userId, reminderId, callback) {
    console.log(dataStore);

    if (dataStore.hasOwnProperty(userId)) {
        var reminders = dataStore[userId].filter(function(item) {
                return item.id === reminderId;
            });
        callback(utils.findFirst(reminders));
    } else {
        callback();
    }
}

function getRemindersForUser(userId, callback) {
    console.log(dataStore);

    if (dataStore.hasOwnProperty(userId)) {
        callback(dataStore[userId]);
    } else {
        callback();
    } 
}

function addReminderForUser(userId, reminder, callback) {
    console.log(dataStore);

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
