/*
  New guild handler
 */

// Winston for logging
const winston = require('winston');

// Add guild to DB
module.exports = (guild, db) => db.createGuild(guild.id).then(() => winston.info(`Joined guild ${guild.id}`)).catch(winston.error);
