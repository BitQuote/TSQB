/*
  ping command
 */

// String format for templating
const format = require('string-format');

// Import response and uptime
const uptime = require('./../modules/uptime');
const responseTemplate = require('./../strings.json').commands.ping.responses.default;

module.exports = msg => msg.channel.send(format(
  responseTemplate, uptime(), msg.client.guilds.size));
