/*
  Provides assistance with using the bot
 */

// Import command info
const commandInfo = require('./../strings.json').commands;

// Format the info for a single command
function formatCommandInfo(command) {
  // Pull out the description and usage
  const { description, usage } = commandInfo[command];

  // Default command info
  let str = `**${command}**\n\t${description}`;

  // Add usage info if necessary
  if (usage) {
    str += `\n\t\`${usage}\``;
  }

  return str;
}

// Generate list of commands
const commandList = Object.keys(commandInfo).sort();

// Format and combine info for individual commands
const cumulativeInfo = commandList.map(formatCommandInfo).join('\n');

module.exports = (command) => {
  if (command) {
    if (commandInfo[command]) {
      return formatCommandInfo(command);
    }
    return null;
  }
  return cumulativeInfo;
};
