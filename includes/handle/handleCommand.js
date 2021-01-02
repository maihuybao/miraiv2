const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const logger = require("../../utils/log.js");
const moment = require("moment-timezone");

module.exports = function({ api, __GLOBAL, client, models, User, Thread, Currency, utils }) {
	return async function({ event }) {
		let { body: contentMessage, senderID, threadID, messageID } = event;
		senderID = parseInt(senderID);
		if (client.userBanned.has(senderID) || client.threadBanned.has(threadID)) return;
		let threadSetting = client.threadSetting.get(event.threadID);
		const prefixRegex = new RegExp(`^(<@!?${senderID}>|${escapeRegex((threadSetting) ? threadSetting.PREFIX : __GLOBAL.settings.PREFIX)})\\s*`);
		if (!prefixRegex.test(contentMessage)) return;
		let timeStart = Date.now();

		//=========Get command user use=========//

		const [matchedPrefix] = contentMessage.match(prefixRegex);
		const args = contentMessage.slice(matchedPrefix.length).trim().split(/ +/);
		let commandName = args.shift().toLowerCase();
		let command = client.commands.get(commandName);
		if (!command) {
			//if (/[\p{L}-]+/ug.test(commandName) && commandName.search(/[\p{L}-]+/ug) == 0) return api.setMessageReaction('❌', event.messageID, (err) => (err) ? logger('Đã có lỗi xảy ra khi thực thi setMessageReaction', 2) : '', true);
			//else return; // Does this fix anything? Yes it does, so please do not delete this line.
			const stringSimilarity = require('string-similarity');
			var allCommandName = [];
			var commandValues = client.commands.values();
			var checker;
			for (const cmd of commandValues) {
				allCommandName.push(cmd.config.name);
			}
			checker = stringSimilarity.findBestMatch(commandName, allCommandName);
			if (checker.bestMatch.rating >= 0.5) command = client.commands.get(checker.bestMatch.target);
			else return api.setMessageReaction('❌', event.messageID, (err) => (err) ? logger('Đã có lỗi xảy ra khi thực thi setMessageReaction', 2) : '', true);
		}

		//========= Check permssion =========//

		if (command.config.hasPermssion == 2 && !__GLOBAL.settings.ADMINBOT.includes(senderID)) return api.sendMessage(`❌ Bạn không đủ quyền hạn người điều hành bot đề sử dụng lệnh ${command.config.name}`, threadID, messageID);
		var threadAdmins = await Thread.getInfo(threadID);
		var adminThread = threadAdmins.adminIDs;
		let find = threadAdmins.adminIDs.find(el => el.id == senderID);
		if (command.config.hasPermssion == 1 && !__GLOBAL.settings.ADMINBOT.includes(senderID) && !find) return api.sendMessage(`❌ Bạn không đủ quyền hạn đề sử dụng lệnh ${command.config.name}`, threadID, messageID);

		//=========Check cooldown=========//

		if (!client.cooldowns.has(command.config.name)) client.cooldowns.set(command.config.name, new Map());
		const now = Date.now();
		const timestamps = client.cooldowns.get(command.config.name);
		const cooldownAmount = (command.config.cooldowns || 1) * 1000;
		if (timestamps.has(senderID)) {
			const expirationTime = timestamps.get(senderID) + cooldownAmount;
			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				return api.sendMessage(`Hãy chờ ${timeLeft.toFixed(1)} giây để có thể tái sử dụng lại lệnh ${command.config.name}.`, threadID, async (err, info) => {
					await new Promise(resolve => setTimeout(resolve, (timeLeft * 1000)));
					api.unsendMessage(info.messageID);
				}, messageID);
			}
		}
		timestamps.set(senderID, now);
		setTimeout(() => timestamps.delete(senderID), cooldownAmount);

		//========= Run command =========//
		try {
			command.run({ api, __GLOBAL, client, event, args, models, User, Thread, Currency, utils });
		}
		catch (error) {
			logger(error + " tại lệnh: " + command.config.name, 2);
			api.sendMessage("Đã có lỗi xảy ra khi thực khi lệnh đó. Lỗi: " + error, threadID);
		}
		if (__GLOBAL.settings.DEVELOP_MODE == "on") {
			var time = new Date();
			logger(`[ ${time.toLocaleString()} ]Command Executed: ${commandName} | User: ${senderID} | Arguments: ${(args) ? args : "none"} | Group: ${threadID} | Process Time: ${(Date.now()) - timeStart}ms`, "[ DEV MODE ]");
		}
	}
}