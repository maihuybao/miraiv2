//=========Call Variable=========//

const logger = require("./utils/log.js");
const moment = require("moment-timezone");
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const client = new Object();
const { readdirSync } = require("fs");
const { join } = require("path");
client.commands = new Map();
//client.replys = new Map();
//client.reactions = new Map();
const cooldowns = new Map();

//=========Get all vallue need use in config=========//

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

//========= Get all files command can use=========//

const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
	const command = require(join(__dirname, "commands", `${file}`));
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


//========= return module listen=========//

module.exports = function({ api, __GLOBAL }) {
	logger("Bot started!", "[ SYSTEM ]");
	logger("This bot was made by Catalizcs(roxtigger2003) and SpermLord");
	return async (error, event) => {
		if (error) return logger(error, 2);
		if (event.type == "message" || event.type == "message_reply") {
			let { body: contentMessage, senderID, threadID, messageID } = event;
			const prefixRegex = new RegExp(`^(<@!?${senderID}>|${escapeRegex(PREFIX)})\\s*`);
			if (!prefixRegex.test(contentMessage)) return;
			
			//=========Get command user use=========//
			
			const [matchedPrefix] = contentMessage.match(prefixRegex);
			const args = contentMessage.slice(matchedPrefix.length).trim().split(/ +/);
			const commandName = args.shift().toLowerCase();
			const command = client.commands.get(commandName);
			if (!command) return api.sendMessage("Không tìm thấy lệnh mà bạn vừa nhập!", event.threadID, event.messageID);
			
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
			
			//=========run command=========//
			
			try {
				command.run(api, event, args, client, __GLOBAL);
			} catch (error) {
				logger(error, 2);
				api.sendMessage("There was an error executing that command. Error: " + error.message, event.threadID);
			}
		}
		if (event.type == "event") {
			switch (event.logMessageType) {
				case "log:subscribe":
					if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
						api.changeNickname(`[ ${PREFIX} ] • ${(!BOTNAME) ? "This bot was made by CatalizCS" : BOTNAME}`, event.threadID, api.getCurrentUserID());
						api.sendMessage(`Im connected sucess! thiz bot was made by me(CatalizCS)\nThank you for using our products, have fun UwU <3`, event.threadID);
						let deleteMe = event.logMessageData.addedParticipants.find(i => i.userFbId == api.getCurrentUserID());
						event.logMessageData.addedParticipants.splice(deleteMe, 1);
					}
					else {
					let threadInfo = await api.getThreadInfo(event.threadID);
					let threadName = threadInfo.threadName;
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
	};
}
//THIZ BOT WAS MADE BY ME(CATALIZCS) AND MY BROTHER SPERMLORD - DO NOT STEAL MY CODE (つ ͡ ° ͜ʖ ͡° )つ ✄ ╰⋃╯