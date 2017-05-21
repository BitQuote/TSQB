/*
  Sends messages sequentially
 */

// Winston for logging
const winston = require('winston');

// Recursive function to send array element
function sendMessage(arr, channel, i) {
  if (i < arr.length) {
    channel.send(arr[i])
    .catch(winston.error)
    .then(() => sendMessage(arr, channel, i + 1));
  }
}

module.exports = (arr, channel) => sendMessage(arr, channel, 0);
