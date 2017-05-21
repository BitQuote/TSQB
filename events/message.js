/*
  New message handler
 */

// String format for templating, winston for logging, and require-dir to import command files
const format = require('string-format');
const winston = require('winston');
const requireDir = require('require-dir');

// Get all commands from directory
const commands = requireDir('./../commands');
const commandList = Object.keys(commands);

// Function to validate commands
const getCommand = require('./../modules/command');

// Import response and invite link
const inviteLink = require('./../modules/invite');
const pmResponseTemplate = require('./../strings.json').pm;

module.exports = (msg, db) => {
  // Ignore self and system messages
  if (msg.author.id !== msg.client.user.id && !msg.system) {
    // Public messages
    if (msg.guild) {
      // Get command info (might be invalid)
      const cmdInfo = getCommand(msg.content, commandList, msg.client);

      // Run command if it's all good
      if (cmdInfo.isCommand && cmdInfo.isValid) {
        winston.info(`'${msg.cleanContent}' run by @${msg.author.username}`);
        commands[cmdInfo.name](msg, cmdInfo.suffix, db);
      }
    // Private messages
    } else {
      // Reply with invite link
      msg.reply(format(pmResponseTemplate, inviteLink));
    }
  }
};
