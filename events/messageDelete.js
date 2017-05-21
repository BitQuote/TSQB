/*
  Deleted message handler
 */

// Winston for logging
const winston = require('winston');

module.exports = (msg, db) => {
  // Check if author is the bot
  if (msg.author.id === msg.client.user.id) {
    // Get guild's log channel
    db.getGuildChannel(msg.guild.id)
    .then((logChannelId) => {
      // Check if message is in the log channel
      if (logChannelId && msg.channel.id === logChannelId) {
        // Delete corresponding support ticket
        db.deleteTicketByMessage(msg.id)
        .then(res => res.deleted === 1 && winston.info(`Deleted ticket for message ${msg.id}`))
        .catch(winston.error);
      }
    })
    .catch(winston.error);
  }
};
