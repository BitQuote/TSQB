/*
  Identify and parse bot commands
 */

const prefix = require('./prefix');

// Verify command
function verifyCommand(name, cmds) {
  return cmds.includes(name);
}

module.exports = (content, cmds, bot) => {
  // Remove excess spaces from string
  const str = content.trim();

  // Define data structure
  const data = {
    isCommand: false,
  };

  // What a command should start with
  const beginning = prefix(bot);

  // Check if it's a command
  if (str.startsWith(beginning) && str.length > beginning.length) {
    // Split the string by spaces
    const cmdArgs = str.split(' ');

    // Set data values
    data.isCommand = true;
    data.name = cmdArgs[1].trim();
    data.isValid = verifyCommand(data.name, cmds);
    data.suffix = cmdArgs.slice(2).join(' ').trim();
  }

  return data;
};
