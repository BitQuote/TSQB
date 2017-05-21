/*
  set command
 */

// String format for templating and winston for logging
const format = require('string-format');
const winston = require('winston');

// Import responses and mod checker
const responses = require('./../strings.json').commands.set.responses;
const moderator = require('./../modules/moderator');

module.exports = (msg, suffix, db) => {
  // Allow only mods to use this
  moderator(msg.member, msg.guild, db)
  .then((isVerified) => {
    if (isVerified) {
      // Parse arguments
      const args = suffix.split(' ');

      // Database error response
      const dbError = (err) => {
        winston.error(err);
        msg.channel.send(responses.db_error);
      };

      // Args error response
      const argsError = () => msg.reply(responses.args_error);

      // Set log channel
      if (args[0] === responses.args.log_channel[0]) {
        // Validate channel ID
        const channelId = args[1];

        if (channelId) {
          const channel = msg.guild.channels.get(channelId);

          if (channel && channel.type === 'text') {
            // Set log channel in DB
            db.setGuildChannel(msg.guild.id, channelId)
            .then(() => msg.channel.send(format(responses.success, responses.args.log_channel[1],
              channel.toString())))
            .catch(dbError);
          } else {
            msg.channel.send(format(responses.id_error, responses.args.log_channel[1]));
          }
        } else {
          argsError();
        }
      // Set mod role
      } else if (args[0] === responses.args.mod_role[0]) {
        // Validate role ID
        const roleId = args[1];

        if (roleId) {
          const role = msg.guild.roles.get(roleId);

          if (role && role.id !== msg.guild.id) {
            // Set mod role in DB
            db.setGuildRole(msg.guild.id, roleId)
            .then(() => msg.channel.send(format(responses.success, responses.args.mod_role[1],
              role.name)))
            .catch(dbError);
          } else {
            msg.channel.send(format(responses.id_error, responses.args.mod_role[1]));
          }
        } else {
          argsError();
        }
      // Invalid arguments
      } else {
        argsError();
      }
    }
  });
};
