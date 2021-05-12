module.exports = function({ api, global, client, models, Users, Threads, Currencies, utils }) {
	const stringSimilarity = require('string-similarity');
	const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const logger = require("../../utils/log.js");
	return async function({ event }) {
		const dateNow = Date.now();
		var { body: contentMessage, senderID, threadID } = event;
		senderID = senderID.toString();
		threadID = threadID.toString();

		if (client.userBanned.has(senderID) || client.threadBanned.has(threadID) || global.config.allowInbox == false && senderID == threadID) return;
		const threadSetting = client.threadSetting.get(threadID.toString()) || {};
		const prefixRegex = new RegExp(`^(<@!?${senderID}>|${escapeRegex((threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX )})\\s*`);
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
			const checker = stringSimilarity.findBestMatch(commandName, allCommandName);
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
				client.threadInfo.set(threadID, threadInfo);
			}
			catch {
				logger("Không thể lấy thông tin của nhóm!", "error");
			}
		}

		//////////////////////////////////////
		//========= Check userInfo =========//
		//////////////////////////////////////

		if (!client.nameUser.has(senderID) || client.nameUser.get(senderID)) {
			try{
				const name = await Users.getNameUser(senderID);
				await Users.setData(senderID, { name });
				client.nameUser.set(senderID, name);
			}
			catch (e) {
				logger("Không thể lấy thông tin của người dùng", "error");
			}
		}

		////////////////////////////////////////
		//========= Check permssion =========//
		///////////////////////////////////////

		var permssion = 0;
		const find = threadInfo.adminIDs.find(el => el.id == senderID);
		
		if (global.config.ADMINBOT.includes(senderID)) permssion = 2;
		else if (!global.config.ADMINBOT.includes(senderID) && find) permssion = 1;

		if (command.config.hasPermssion > permssion) return api.sendMessage(`Bạn không đủ quyền hạn để có thể sử dụng lệnh "${command.config.name}"`, event.threadID, event.messageID);

		//////////////////////////////////////
		//========= Check cooldown =========//
		//////////////////////////////////////

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
			command.run({ api, global, client, event, args, models, Users, Threads, Currencies, utils, permssion });
			timestamps.set(senderID, dateNow);
			
			if (global.config.DeveloperMode == true) {
				const moment = require("moment-timezone");
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