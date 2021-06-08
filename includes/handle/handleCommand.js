module.exports = function({ api, models, Users, Threads, Currencies }) {
	const stringSimilarity = require('string-similarity');
	const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const logger = require("../../utils/log.js");

	return async function({ event }) {
		const dateNow = Date.now();

		const { allowInbox, PREFIX, ADMINBOT, DeveloperMode } = global.config;
		const { userBanned, threadBanned, threadInfo, threadData } = global.data;
		const { commands, cooldowns } = global.client;

		var { body: contentMessage, senderID, threadID } = event;

		senderID = parseInt(senderID);
		threadID = parseInt(threadID);

		if (userBanned.has(senderID) || threadBanned.has(threadID) || allowInbox == false && senderID == threadID) return;
		const threadSetting = threadData.get(parseInt(threadID)) || {};
		const prefixRegex = new RegExp(`^(<@!?${senderID}>|${escapeRegex((threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : PREFIX )})\\s*`);
		if (!prefixRegex.test(contentMessage)) return;

		//////////////////////////////////////////
		//=========Get command user use=========//
		//////////////////////////////////////////

		const [matchedPrefix] = contentMessage.match(prefixRegex);
		const args = contentMessage.slice(matchedPrefix.length).trim().split(/\s+/);
		const commandName = args.shift().toLowerCase();
		var command = commands.get(commandName);
		if (!command) {
			var allCommandName = [];
			const commandValues = commands.keys();
			for (const cmd of commandValues) allCommandName.push(cmd);
			const checker = stringSimilarity.findBestMatch(commandName, allCommandName);
			if (checker.bestMatch.rating >= 0.5) command = commands.get(checker.bestMatch.target);
			else return api.sendMessage(`Lệnh bạn sử dụng không tồn tại, có phải là lệnh "${checker.bestMatch.target}" hay không?`, threadID);
		}
		
		////////////////////////////////////////
		//========= Check threadInfo =========//
		////////////////////////////////////////
		
		var thread = (threadInfo.get(threadID) || await Threads.getInfo(threadID));
		if(Object.keys(threadInfo).length == 0) {
			try {
				const threadinfo = await api.getThreadInfo(threadID);
				await Threads.setData(threadID, { threadInfo: threadinfo });
				threadInfo.set(threadID, threadInfo);
				thread = threadinfo;
			}
			catch (e) {
				logger("Không thể lấy thông tin của nhóm!" + JSON.stringify(e), "error");
			}
		}

		////////////////////////////////////////
		//========= Check permssion =========//
		///////////////////////////////////////

		var permssion = 0;
		const find = thread.adminIDs.find(el => el.id.toString() == senderID.toString());
		
		if (ADMINBOT.includes(senderID.toString())) permssion = 2;
		else if (!ADMINBOT.includes(senderID.toString()) && find) permssion = 1;

		if (command.config.hasPermssion > permssion) return api.sendMessage(`Bạn không đủ quyền hạn để có thể sử dụng lệnh "${command.config.name}"`, threadID, messageID);

		//////////////////////////////////////
		//========= Check cooldown =========//
		//////////////////////////////////////

		if (!cooldowns.has(command.config.name)) cooldowns.set(command.config.name, new Map());
		const timestamps = cooldowns.get(command.config.name);
		const cooldownAmount = (command.config.cooldowns || 1) * 1000;
		if (timestamps.has(senderID)) {
			const expirationTime = timestamps.get(senderID) + cooldownAmount;
			if (dateNow < expirationTime) return api.setMessageReaction('⏱', event.messageID, (err) => (err) ? logger('Đã có lỗi xảy ra khi thực thi setMessageReaction', 2) : '', true);
		}

		///////////////////////////////////
		//========= Run command =========//
		///////////////////////////////////

		try {
			command.run({ api, event, args, models, Users, Threads, Currencies, permssion });
			timestamps.set(senderID, dateNow);
			
			if (DeveloperMode == true) {
				const moment = require("moment-timezone");
				const time = moment.tz("Asia/Ho_Chi_minh").format("HH:MM:ss L");
				logger(`[ ${time} ] Command Executed: ${commandName} | User: ${senderID} | Arguments: ${args.join(" ")} | Group: ${threadID} | Process Time: ${(Date.now()) - dateNow}ms`, "[ DEV MODE ]");
			}
			return;
		}
		catch (error) {
			logger(error + " tại lệnh: " + command.config.name, "error");
			console.log(error.stack);
			return api.sendMessage("Đã có lỗi xảy ra khi thực khi lệnh đó. Lỗi: " + error, threadID);
		}
	};
};