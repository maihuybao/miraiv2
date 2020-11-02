//=========Const Variable =========//

const logger = require("./utils/log.js");
const moment = require("moment-timezone");
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const client = new Object();
const { readdirSync } = require("fs");
const { join } = require("path");
client.commands = new Map();
client.devCommands = new Map();

let TOKEN, PREFIX;
try {
	const config = require("./config.json");
	PREFIX = config.PREFIX;
} catch (error) {
	TOKEN = process.env.TOKEN;
}

//========= Do something in here o.o =========//

//========= Get all files command can use =========//

const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
	const command = require(join(__dirname, "commands", `${file}`));
	if (!command.config || !command.run) logger(`File ${file} rất có thể đã bị lỗi và không thể load được!`, "[ MODULE ]")
	else {
		client.commands.set(command.config.name, command);
		logger(`${command.config.name} Loaded!`, "[ MODULE ]");
	}
}

/*const devCommandFile = readdirSync(join(__dirname, "commands/developer")).filter((file) => file.endsWith(".js"));
for (const devFile of devCommandFile) {
	const devCommand = require(join(__dirname, "commands/developer", `${devFile}`));
	if (!devCommand.name || !devCommand.execute) logger(`File ${devfile} rất có thể đã bị lỗi và không thể load được!`, "[ DEVELOPER MODULE ]")
	else {
		client.devCommands.set(devCommand.name, devCommand);
		logger(`${devCommand.name} loaded`, "[ DEVELOP MODULE ]");
	}
}
*/

//========= return module listen =========//

module.exports = function({ api }) {
	logger("Starting bot sucess!", "[ SYSTEM ]");
	logger(`${api.getCurrentUserID()}`, "[ UID ]");
	logger("This bot was made by Catalizcs(roxtigger2003)");
	return function(error, event) {
		if (error) return logger(error, 2);
		switch (event.type) {
			case "message":
			case "message_reply":
				let { body: contentMessage, senderID, threadID, messageID } = event;
				const prefixRegex = new RegExp(`^(<@!?${senderID}>|${escapeRegex(PREFIX)})\\s*`);
				if (!prefixRegex.test(contentMessage)) return;
				const [, matchedPrefix] = contentMessage.match(prefixRegex);
				const args = contentMessage.slice(matchedPrefix.length).trim().split(/ +/);
				const commandName = args.shift().toLowerCase();
				const command = client.commands.get(commandName); //|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
				if (!command) return api.sendMessage("Không tìm thấy lệnh mà bạn vừa nhập!", event.threadID, event.messageID);
				try {
					command.run(api, event, args);
				} catch (error) {
					logger(error, 2);
					api.sendMessage("There was an error executing that command.", event.threadID);
				}
				break;
			/*case "message_unsend":
				//handleUnsend({ event });
				break;
			case "event":
				handleEvent({ event });
				break;
			case "message_reaction":
				handleReaction({ event });
				break;*/
			default:
				return;
				break;
		}
	};
}