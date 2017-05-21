/*
  ticket command
 */

// String format for templating, moment for pretty dates, and winston for logging
const format = require('string-format');
const moment = require('moment');
const winston = require('winston');

// Import responses, date format, and sequential send
const responses = require('./../strings.json').commands.ticket.responses;
const ticketTemplate = require('./../strings.json').ticket;
const dateFormat = require('./../config.js').dateFormat;
const sendArray = require('./../modules/sequence');

module.exports = (msg, suffix, db) => {
  // Database error response
  const dbError = (err) => {
    winston.error(err);
    msg.channel.send(responses.db_error);
  };

  // Format ticket info
  const formatTicket = (ticket) => {
    const { id, user_id: userId, timestamp, description } = ticket;

    // Try getting the ticket creator
    const member = msg.guild.members.get(userId);

    // Show ticket info
    return format(ticketTemplate, id, member ? member.user.tag : userId,
      moment(timestamp).format(dateFormat), description);
  };

  if (!suffix) {
    // Count support tickets in DB
    db.countGuildTickets(msg.guild.id)
    .then((count) => {
      let info = format(responses.default, count);

      // Determine if log channel exists
      db.autoCreateGuild(msg.guild.id)
      .then(() => {
        db.getGuildChannel(msg.guild.id)
        .then((logChannelId) => {
          // Check if log channel is specified
          if (logChannelId) {
            const logChannel = msg.guild.channels.get(logChannelId);

            // If so, mention it in the summary
            if (logChannel) {
              info += ` ${format(responses.log_channel, logChannel.toString())}`;
            }
          }

          // Send response
          msg.channel.send(info);
        })
        .catch(dbError);
      })
      .catch(dbError);
    })
    .catch(dbError);
  } else if (suffix === 'list') {
    db.getRecentTickets(5)
    .then((tickets) => {
      sendArray(tickets.map(formatTicket), msg.channel);
    })
    .catch(dbError);
  } else {
    // Fetch ticket from DB
    db.getTicket(suffix)
      .then((ticket) => {
        if (ticket) {
          msg.channel.send(formatTicket(ticket));
        } else {
          msg.channel.send(responses.id_error);
        }
      })
      .catch(dbError);
  }
};
