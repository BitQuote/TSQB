/*
  done command
 */

// Winston for logging
const winston = require('winston');

// Import responses and mod checker
const responses = require('./../strings.json').commands.done.responses;
const moderator = require('./../modules/moderator');

module.exports = (msg, suffix, db) => {
  // Allow only mods to use this
  moderator(msg.member, msg.guild, db)
  .then((isVerified) => {
    if (isVerified) {
      // Make sure ID is provided
      if (!suffix) {
        msg.reply(responses.args_error);
      } else {
        // Database error response
        const dbError = (err) => {
          winston.error(err);
          msg.channel.send(responses.db_error);
        };

        // Get ticket's corresponding log message
        db.getTicketMessage(suffix)
        .then((msgId) => {
          // Check if log message exists
          if (msgId) {
            // Get guild's log channel
            db.getGuildChannel(msg.guild.id)
            .then((logChannelId) => {
              // Check if log channel exists
              if (logChannelId) {
                const logChannel = msg.guild.channels.get(logChannelId);
                if (logChannel) {
                  // Fetch and delete the message
                  logChannel.fetchMessage(msgId)
                  .then(logMessage => logMessage.delete())
                  .catch(winston.error);
                }
              }
            })
            .catch(winston.error);
          }
        })
        .catch(winston.error);

        // Delete ticket in DB
        db.deleteTicket(suffix)
        .then((res) => {
          if (res.deleted === 1) {
            winston.info(`Deleted ticket ${suffix}`);
            msg.channel.send(responses.success);
          } else {
            msg.channel.send(responses.id_error);
          }
        })
        .catch(dbError);
      }
    }
  });
};
