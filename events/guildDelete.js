/*
  Removed guild handler
 */

 // Winston for logging
 const winston = require('winston');

 // Add guild to DB
 module.exports = (guild, db) => db.deleteGuild(guild.id).then(() => winston.info(`Left guild ${guild.id}`)).catch(winston.error);
