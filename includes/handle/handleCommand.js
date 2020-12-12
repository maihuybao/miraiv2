const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const logger = require("../../utils/log.js");
const moment = require("moment-timezone");

module.exports = function({ api, __GLOBAL, client }) {
	return async function({ event }) {
		const funcs = require("../../utils/funcs.js")({ api, __GLOBAL });
		let { body: contentMessage, senderID, threadID, messageID } = event;
		senderID = parseInt(senderID);
		if (client.userBanned.has(senderID) || client.threadBanned.has(threadID)) return;
		const prefixRegex = new RegExp(`^(<@!?${senderID}>|${escapeRegex(__GLOBAL.settings.PREFIX)})\\s*`);
		if (!prefixRegex.test(contentMessage)) return;

		//=========Get command user use=========//

		const [matchedPrefix] = contentMessage.match(prefixRegex);
		const args = contentMessage.slice(matchedPrefix.length).trim().split(/ +/);
		const commandName = args.shift().toLowerCase();
		const command = client.commands.get(commandName);
		if (!command) {
			if (/[\p{L}-]+/ug.test(commandName) && commandName.search(/[\p{L}-]+/ug) == 0) return api.setMessageReaction('❌', event.messageID, (err) => (err) ? logger('Đã có lỗi xảy ra khi thực thi setMessageReaction', 2) : '', true);
			else return; // Does this fix anything? Yes it does, so please do not delete this line.
		}

		//=========Check command using database=========//

		//if (command.config.use.hasOwnProperty("database") && )

		//========= Check permssion =========//

		if (command.config.hasPermssion == 2 && !__GLOBAL.settings.ADMINBOT.includes(senderID)) return api.sendMessage(`❌ Bạn không đủ quyền hạn người điều hành bot đề sử dụng lệnh ${command.config.name}`, event.threadID, event.messageID);
		var threadAdmins = await funcs.getThreadInfo(threadID);
		var adminThread = threadAdmins.adminIDs;
		let find = threadAdmins.adminIDs.find(el => el.id == event.senderID);
		if (command.config.hasPermssion == 1 && !__GLOBAL.settings.ADMINBOT.includes(senderID) && !find) return api.sendMessage(`❌ Bạn không đủ quyền hạn đề sử dụng lệnh ${command.config.name}`, event.threadID, event.messageID);

		//=========Check cooldown=========//

		if (!client.cooldowns.has(command.config.name)) client.cooldowns.set(command.config.name, new Map());
		const now = Date.now();
		const timestamps = client.cooldowns.get(command.config.name);
		const cooldownAmount = (command.config.cooldowns || 1) * 1000;
		if (timestamps.has(threadID)) {
			const expirationTime = timestamps.get(threadID) + cooldownAmount;
			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				return api.sendMessage(`Hãy chờ ${timeLeft.toFixed(1)} giây để có thể tái sử dụng lại lệnh ${command.config.name}.`, event.threadID, async (err, info) => {
					await new Promise(resolve => setTimeout(resolve, (timeLeft * 1000)));
					api.unsendMessage(info.messageID);
				}, event.messageID);
			}
		}
		timestamps.set(threadID, now);
		setTimeout(() => timestamps.delete(threadID), cooldownAmount);

		//========= Run command =========//
	
		try {
			if (__GLOBAL.settings.DEVELOP_MODE == "on") logger(`Command Executed: ${commandName} | User: ${senderID} | Arguments: ${args} | Group: ${threadID}`, "[ DEV MODE ]")
			command.run({ api, event, args, client, __GLOBAL });
		}
		catch (error) {
			logger(error + " tại lệnh: " + command.config.name, 2);
			api.sendMessage("Đã có lỗi xảy ra khi thực khi lệnh đó. Lỗi: " + error, event.threadID);
		}
	}
}