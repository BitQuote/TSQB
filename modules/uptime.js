/*
  Gets pretty-printed process uptime
 */

// Import moment for time parsing
const moment = require('moment');

// Humanize duration in seconds
module.exports = () => moment.duration(process.uptime(), 's').humanize();
