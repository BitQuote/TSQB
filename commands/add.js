/*
  add command
 */

// String format for templating, moment for pretty dates, and winston for logging
const format = require('string-format');
const moment = require('moment');
const winston = require('winston');

// Import responses and date format
const responses = require('./../strings.json').commands.add.responses;
const ticketTemplate = require('./../strings.json').ticket;
const dateFormat = require('./../config.js').dateFormat;

module.exports = (msg, suffix, db) => {
  // Make sure description is provided
  if (!suffix) {
    msg.reply(responses.args_error);
  } else {
    // Save creation timestamp
    const timestamp = Date.now();

    // Add ticket to DB
    db.createTicket(msg.guild.id, msg.author.id, timestamp, suffix)
    .then((res) => {
      // Save ticket ID
      const ticketId = res.generated_keys[0];
      winston.info(`Created ticket ${ticketId} for @${msg.author.username} in ${msg.guild.name}`);

      // Success response
      msg.channel.send(format(responses.success, ticketId));

      // Get guild's log channel
      db.autoCreateGuild(msg.guild.id)
      .then(() => {
        db.getGuildChannel(msg.guild.id)
        .then((logChannelId) => {
          // Check if log channel is specified
          if (logChannelId) {
            const logChannel = msg.guild.channels.get(logChannelId);
            if (logChannel) {
              // Post ticket as a message
              logChannel.send(format(ticketTemplate, ticketId, msg.author.tag,
                moment(timestamp).format(dateFormat), suffix))
              .then(ticketMessage => db.setTicketMessage(ticketId, ticketMessage.id)
                .catch(winston.error))
              .catch(winston.error);
            }
          }
        })
        .catch(winston.error);
      })
      .catch(winston.error);
    })
    .catch((err) => {
      winston.error(err);
      msg.channel.send(responses.db_error);
    });
  }
};
