/*
  help command
 */

// Import responses and assistance module
const responses = require('./../strings.json').commands.help.responses;
const assistance = require('./../modules/assistance');

module.exports = (msg, suffix) => msg.channel.send(responses.heading +
  (assistance(suffix) || responses.error));
