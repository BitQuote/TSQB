/*
  Print command prefix
 */

// Get command prefix setting from config
let prefix = require('./../config').prefix;

module.exports = (bot) => {
  if (prefix === '@mention') {
    prefix = `${bot.user.toString()} `;
  }
  return prefix;
};
