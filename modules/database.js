/*
  Interact with RethinkDB store
 */

// Import RethinkDB driver, bluebird for promises, and winston for logging
const driver = require('rethinkdbdash');
const Promise = require('bluebird');
const winston = require('winston');

module.exports = class {
  // Connect to DB
  constructor() {
    this.r = driver({ db: 'tsqb' });
  }

  // Default DB tables (guilds and tickets)
  init() {
    return this.r.tableCreate('guilds').run()
    .then(() => winston.info('Created guilds table'))
    .catch(() => winston.warn('Guilds table already exists'))
    .finally(() => this.r.tableCreate('tickets').run())
    .then(() => winston.info('Created tickets table'))
    .catch(() => winston.warn('Tickets table already exists'));
  }

  // Insert data for a new guild
  createGuild(id) {
    return this.r.table('guilds').insert({ id, log_channel_id: null, mod_role_id: null }).run();
  }

  // Call createGuild() if necessary
  autoCreateGuild(id) {
    return new Promise((resolve, reject) => {
      this.r.table('guilds').get(id).run()
      .then((document) => {
        if (document) {
          resolve();
        } else {
          this.createGuild(id)
          .then(() => resolve())
          .catch(reject);
        }
      })
      .catch(reject);
    });
  }

  // Fetch guild's ticket log channel
  getGuildChannel(id) {
    return this.r.table('guilds').get(id).getField('log_channel_id').run();
  }

  // Set guild's ticket log channel
  setGuildChannel(id, channelId) {
    return this.r.table('guilds').get(id).update({ log_channel_id: channelId }).run();
  }

  // Fetch guild's moderator role
  getGuildRole(id) {
    return this.r.table('guilds').get(id).getField('mod_role_id').run();
  }

  // Set guild's moderator role
  setGuildRole(id, roleId) {
    return this.r.table('guilds').get(id).update({ mod_role_id: roleId }).run();
  }

  // Delete data for a guild
  deleteGuild(id) {
    return this.r.table('guilds').get(id).delete().run();
  }

  // Count guild's tickets
  countGuildTickets(id) {
    return this.r.table('tickets').filter({ guild_id: id }).count().run();
  }

  // Fetch ticket info
  getTicket(id) {
    return this.r.table('tickets').get(id).run();
  }

  // Fetch n most recent tickets
  getRecentTickets(n) {
    return this.r.table('tickets').orderBy('timestamp').limit(n).run();
  }

  // Create user support ticket
  createTicket(guildId, userId, timestamp, description) {
    return this.r.table('tickets').insert({ guild_id: guildId, user_id: userId, timestamp, description, message_id: null }).run();
  }

  // Get ticket's corresponding log message
  getTicketMessage(id) {
    return this.r.table('tickets').get(id).getField('message_id').run();
  }

  // Set ticket's corresponding log message
  setTicketMessage(id, msgId) {
    return this.r.table('tickets').get(id).update({ message_id: msgId }).run();
  }

  // Delete ticket (it has been closed)
  deleteTicket(id) {
    return this.r.table('tickets').get(id).delete().run();
  }

  // Delete ticket by message ID
  deleteTicketByMessage(msgId) {
    return this.r.table('tickets').filter(this.r.row('message_id').eq(msgId)).delete().run();
  }
};
