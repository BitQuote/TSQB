/*
  Verify a member as a mod
 */

// Import bluebird for promises and winston for logging
const Promise = require('bluebird');
const winston = require('winston');

module.exports = (member, guild, db) => new Promise((resolve) => {
  if (member.id === guild.ownerID) {
    resolve(true);
  } else {
    // Resolve false if there's an error
    const handleError = (err) => {
      winston.error(err);
      resolve(false);
    };

    // Check if user has mod role
    db.autoCreateGuild(guild.id)
    .then(() => {
      db.getGuildRole(guild.id)
      .then((modRoleId) => {
        if (modRoleId && member.roles.has(modRoleId)) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(handleError);
    })
    .catch(handleError);
  }
});
