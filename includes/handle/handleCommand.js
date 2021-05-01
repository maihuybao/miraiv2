module.exports = function({ api, __GLOBAL, client, models, Users, Threads, Currencies, utils }) {
	const stringSimilarity = require('string-similarity');
	const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const logger = require("../../utils/log.js");
	return async function({ event }) {
		const dateNow = Date.now();
		const { body: contentMessage, senderID, threadID, messageID } = event;
		if (client.userBanned.has(senderID.toString()) || client.threadBanned.has(threadID.toString()) || __GLOBAL.settings.allowInbox == false && senderID == threadID) return;
		var threadSetting = client.threadSetting.get(threadID) || {};
		var prefixRegex = new RegExp(`^(<@!?${senderID}>|${escapeRegex((threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : __GLOBAL.settings.PREFIX )})\\s*`);
		if (!prefixRegex.test(contentMessage)) return;

		//////////////////////////////////////////
		//=========Get command user use=========//
		//////////////////////////////////////////

		const [matchedPrefix] = contentMessage.match(prefixRegex);
		const args = contentMessage.slice(matchedPrefix.length).trim().split(/ +/);
		const commandName = args.shift().toLowerCase();
		const commandBanned = client.commandBanned.get(senderID) || [];
		if (commandBanned.includes(commandName)) return;
		var command = client.commands.get(commandName);
		if (!command) {
			var allCommandName = [];
			const commandValues = client.commands.values();
			for (const cmd of commandValues) allCommandName.push(cmd.config.name);
			const checker = stringSimilarity.findBestMatch(commandName, commandValues);
			if (checker.bestMatch.rating >= 0.5) command = client.commands.get(checker.bestMatch.target);
			else return api.sendMessage(`Lệnh bạn sử dụng không tồn tại, có phải là lệnh "${checker.bestMatch.target}" hay không?`, threadID);
		}

		////////////////////////////////////////
		//========= Check threadInfo =========//
		////////////////////////////////////////
		
		var threadInfo = (client.threadInfo.get(threadID) || await Threads.getInfo(threadID));
		if(Object.keys(threadInfo).length == 0) {
			try {
				threadInfo = await api.getThreadInfo(event.threadID);
				await Threads.setData(threadID, { name: threadInfo.name, threadInfo });
				client.threadInfo.set(threadID.toString(), threadInfo);
			}
			catch {
				logger("Không thể lấy thông tin của nhóm!", "error");
			}
		}

		////////////////////////////////////////
		//========= Check permssion =========//
		///////////////////////////////////////

		var permssion = 0;
		if (command.config.hasPermssion == 2 && !__GLOBAL.settings.ADMINBOT.includes(senderID)) return api.sendMessage(`❌ Bạn không đủ quyền hạn người điều hành bot đề sử dụng lệnh ${command.config.name}`, threadID, messageID);
		else permssion = 2;
		const find = threadInfo.adminIDs.find(el => el.id == senderID);
		if (command.config.hasPermssion == 1 && !__GLOBAL.settings.ADMINBOT.includes(senderID) && !find) return api.sendMessage(`❌ Bạn không đủ quyền hạn đề sử dụng lệnh ${command.config.name}`, threadID, messageID);
		else permssion = 1;

		////////////////////////////////////
		//=========Check cooldown=========//
		////////////////////////////////////

		if (!client.cooldowns.has(command.config.name)) client.cooldowns.set(command.config.name, new Map());
		const timestamps = client.cooldowns.get(command.config.name);
		const cooldownAmount = (command.config.cooldowns || 1) * 1000;
		if (timestamps.has(senderID)) {
			const expirationTime = timestamps.get(senderID) + cooldownAmount;
			if (dateNow < expirationTime) return api.setMessageReaction('⏱', event.messageID, (err) => (err) ? logger('Đã có lỗi xảy ra khi thực thi setMessageReaction', 2) : '', true);
		}

		///////////////////////////////////
		//========= Run command =========//
		///////////////////////////////////

		try {
			command.run({ api, __GLOBAL, client, event, args, models, Users, Threads, Currencies, utils, permssion });
			timestamps.set(senderID, dateNow);
			
			if (__GLOBAL.settings.DeveloperMode == true) {
				const moment = require("moment");
				const time = moment.tz("Asia/Ho_Chi_minh").format("HH:MM:ss L");
				logger(`[ ${time} ] Command Executed: ${commandName} | User: ${senderID} | Arguments: ${args.join(" ")} | Group: ${threadID} | Process Time: ${(Date.now()) - dateNow}ms`, "[ DEV MODE ]");
			}
			return;
		}
		catch (error) {
			logger(error + " tại lệnh: " + command.config.name, "error");
			return api.sendMessage("Đã có lỗi xảy ra khi thực khi lệnh đó. Lỗi: " + error, threadID);
		}
	}
}