//=========Call Variable=========//

const logger = require("../utils/log.js");
const moment = require("moment-timezone");
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const client = new Object();
const { readdirSync } = require("fs");
const { join } = require("path");
client.commands = new Map();
client.events = new Map();
//client.replys = new Map();
//client.reactions = new Map();
const cooldowns = new Map();


//========= Do something in here o.o =========//

//========= Get all files command can use=========//

const commandFiles = readdirSync(join(__dirname, "../commands")).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
	const command = require(join(__dirname, "../commands", `${file}`));
	// File already registered, skip!
	if (client.commands.has(command)) throw new Error('Bị trùng!');
	try {
		if (!command.config || !command.run) throw new Error(`Sai format!`);
		client.commands.set(command.config.name, command);
		logger(`${command.config.name} Loaded!`, "[ MODULE ]");
	} catch (error) {
		logger(`Không thể load module: ${file} Với lỗi: ${error.message}`, "[ MODULE ]");
	}
}

const eventFiles = readdirSync(join(__dirname, "../events")).filter((file) => file.endsWith(".js"));
for (const file of eventFiles) {
	const event = require(join(__dirname, "../events", `${eventFiles}`));
	// File already registered, skip!
	if (client.events.has(event)) throw new Error('Bị trùng!');
	try {
		if (!event.config || !event.run) throw new Error(`Sai format!`);
		client.events.set(event.config.name, event);
		logger(`${event.config.name} Loaded!`, "[ EVENT MODULE ]");
	} catch (error) {
		logger(`Không thể load module: ${file} Với lỗi: ${error.message}`, "[ EVENT MODULE ]");
	}
}

//========= return module listen=========//

module.exports = function({ api, __GLOBAL, eventCallback }) {
	const funcs = require("../utils/funcs.js")({ api, __GLOBAL });
	
	logger("Bot started!", "[ SYSTEM ]");
	logger("This bot was made by Catalizcs(roxtigger2003) and SpermLord");
	return async (error, event) => {
		(eventCallback) ? event = evetnCallBack : "";
		if (error) return logger(error, 2);
		switch (event.type) {
			case "message":
			case "message_reply": 
				let { body: contentMessage, senderID, threadID, messageID } = event;
				const prefixRegex = new RegExp(`^(<@!?${senderID}>|${escapeRegex(__GLOBAL.settings.PREFIX)})\\s*`);
				if (!prefixRegex.test(contentMessage)) return;
				
				//=========Get command user use=========//
				
				const [matchedPrefix] = contentMessage.match(prefixRegex);
				const args = contentMessage.slice(matchedPrefix.length).trim().split(/ +/);
				const commandName = args.shift().toLowerCase();
				const command = client.commands.get(commandName);
				if (!command) return api.setMessageReaction(":dislike:", event.messageID);
				
				//=========Check cooldown=========//
				
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
				//=========check permssion=========//
				if (command.config.hasPermssion == 2 && !__GLOBAL.settings.ADMINBOT.includes(senderID)) return api.sendMessage(`❌ Bạn không đủ quyền hạn người điều hành bot đề sử dụng lệnh ${command.config.name}`, event.threadID, event.messageID);
				var threadAdmins = await funcs.getThreadInfo(threadID);
				var adminThread = threadAdmins.adminIDs;
				let find = threadAdmins.adminIDs.find(el => el.id == event.senderID);
				if (command.config.hasPermssion == 1 && !__GLOBAL.settings.ADMINBOT.includes(senderID) && !find) return api.sendMessage(`❌ Bạn không đủ quyền hạn đề sử dụng lệnh ${command.config.name}`, event.threadID, event.messageID);
				//=========run command=========//
				
				try {
					command.run({ api, event, args, client, __GLOBAL });
				} catch (error) {
					logger(error + " at command: " + command.config.name, 2);
					api.sendMessage("There was an error executing that command. Error: " + error.message, event.othreadID);
				}
				break;
			case "event":
				for (let [key, value] of client.events.entries()) {
					if (value.config.eventType.indexOf(event.logMessageType) !== -1) {
						const eventRun = client.events.get(key);
						try {
							eventRun.run({ api, event, client, __GLOBAL });
						} catch (error) {
							logger(error + " at event: " + eventRun.config.name , 2);
						}
						return;
					};
				}
				break;
			default:
				return;
				break;
			
		}
	};
}
//THIZ BOT WAS MADE BY ME(CATALIZCS) AND MY BROTHER SPERMLORD - DO NOT STEAL MY CODE (つ ͡ ° ͜ʖ ͡° )つ ✄ ╰⋃╯