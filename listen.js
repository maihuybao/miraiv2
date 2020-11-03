//=========Const Variable =========//

const logger = require("./utils/log.js");
const moment = require("moment-timezone");
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const client = new Object();
const { readdirSync } = require("fs");
const { join } = require("path");
client.commands = new Map();
const cooldowns = new Map();
//client.description = new Map();
//client.commandCategory = new Map();
//client.args = new Map();
//client.usages = new Map();
//client.cooldowns = new Map();
//client.devCommands = new Map();

let PREFIX, BOTNAME;
try {
	const config = require("./config.json");
	PREFIX = config.PREFIX;
	BOTNAME = config.BOTNAME
} catch (error) {
	PREFIX = process.env.PREFIX;
	BOTNAME = process.env.BOTNAME;
}

//========= Do something in here o.o =========//

//========= Get all files command can use =========//

const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
	const command = require(join(__dirname, "commands", `${file}`));
	//if (!command.config || !command.run) logger(`File ${file} rất có thể đã bị lỗi và không thể load được!`, "[ MODULE ]")
	//else {
	try {
		client.commands.set(command.config.name, command);
		//client.description.set(command.config.name, command.config.description);
		//client.usages.set(command.config.name, command.config.usages);
		//client.commandCategory.set(command.config.name, command.config.commandCategory);
		//client.args.set(command.config.name, command.config.args);
		logger(`${command.config.name} Loaded!`, "[ MODULE ]");
	} catch (error) {
		logger(`Không thể load module: ${file} Với lỗi: ${error.message}`, "[ MODULE ]");
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
	return async (error, event) => {
		if (error) return logger(error, 2);
		if (event.type == "message" || event.type == "message_reply") {
			let { body: contentMessage, senderID, threadID, messageID } = event;
			const prefixRegex = new RegExp(`^(<@!?${senderID}>|${escapeRegex(PREFIX)})\\s*`);
			if (!prefixRegex.test(contentMessage)) return;
			const [, matchedPrefix] = contentMessage.match(prefixRegex);
			const args = contentMessage.slice(matchedPrefix.length).trim().split(/ +/);
			const commandName = args.shift().toLowerCase();
			const command = client.commands.get(commandName);
			if (!command) return api.sendMessage("Không tìm thấy lệnh mà bạn vừa nhập!", event.threadID, event.messageID);
			if (!cooldowns.has(command.config.name)) cooldowns.set(command.config.name, new Map());
			const now = Date.now();
			const timestamps = cooldowns.get(command.config.name);
			const cooldownAmount = (command.config.cooldowns || 1) * 1000;
			if (timestamps.has(senderID)) {
				const expirationTime = timestamps.get(senderID) + cooldownAmount;
				if (now < expirationTime) {
					const timeLeft = (expirationTime - now) / 1000;
					return api.sendMessage(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the ${command.config.name} command.`, event.threadID, async (err, info) => {
						await new Promise(resolve => setTimeout(resolve, (timeLeft * 1000)));
						api.unsendMessage(info.messageID);
					}, event.messageID);
				}
			}
			timestamps.set(senderID, now);
			setTimeout(() => timestamps.delete(senderID), cooldownAmount);
			
			try {
				command.run(api, event, args, client);
			} catch (error) {
				logger(error, 2);
				api.sendMessage("There was an error executing that command. Error: " + error.message, event.threadID);
			}
		}
		if (event.type == "event") {
			let threadInfo = await api.getThreadInfo(event.threadID);
			let threadName = threadInfo.threadName;
			switch (event.logMessageType) {
				case "log:subscribe":
					if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
						api.changeNickname(`[ ${PREFIX} ] • ${(!BOTNAME) ? "This bot was made by CatalizCS" : BOTNAME}`, event.threadID, api.getCurrentUserID());
						api.sendMessage(`Im connected sucess! thiz bot was made by me(CatalizCS)\nThank you for using our products, have fun UwU <3`, event.threadID);
						let deleteMe = event.logMessageData.addedParticipants.find(i => i.userFbId == api.getCurrentUserID());
						event.logMessageData.addedParticipants.splice(deleteMe, 1);
						await new Promise(resolve => setTimeout(resolve, 500));
					} else {
					var mentions = [], nameArray = [], memLength = [];
					for (var i = 0; i < event.logMessageData.addedParticipants.length; i++) {
						let id = event.logMessageData.addedParticipants[i].userFbId;
						let userName = event.logMessageData.addedParticipants[i].fullName;
						nameArray.push(userName);
						mentions.push({ tag: userName, id });
						memLength.push(threadInfo.participantIDs.length - i);
					}
					memLength.sort((a, b) => a - b);
					var body = `Welcome aboard ${nameArray.join(', ')}.\nChào mừng ${(memLength.length > 1) ?  'các bạn' : 'bạn'} đã đến với ${threadName}.\n${(memLength.length > 1) ?  'Các bạn' : 'Bạn'} là thành viên thứ ${memLength.join(', ')} của nhóm 🥳`;
					api.sendMessage({ body, mentions }, event.threadID);
					break;
				}
			}
		}
		/*switch (event.type) {
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
				break;
			default:
				return;
				break; 
		}*/
	};
}