/*
  Generate OAuth2 add-bot link
 */

// Import client ID from configs
const clientId = require('./../config').clientId;

// Calculate permissions constant
const permissions = 0x400 | 0x800; // eslint-disable-line no-bitwise

// Invite url
const url = `https://discordapp.com/api/oauth2/authorize?client_id=${clientId}&scope=bot&permissions=${permissions}`;
module.exports = url;
