module.exports.config = {
	name: "join",
	eventType: ["log:subscribe"],
	version: "1.0.0",
	credits: "Mirai Team",
	description: "Thông báo bot hoặc người vào nhóm",
	dependencies: {
		"fs-extra": ""
	}
};

module.exports.run = async function({ api, event, Threads, Users }) {
	const { threadID } = event;
	if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
		api.changeNickname(`[ ${global.config.PREFIX} ] • ${(!global.config.BOTNAME) ? "Made by CatalizCS and SpermLord" : global.config.BOTNAME}`, threadID, api.getCurrentUserID());
		return api.sendMessage(`Connected successfully! This bot was made by CatalizCS and SpermLord\nThank you for using our products, have fun UwU <3`, threadID);
	}
	else {
		try {
			const { createReadStream, existsSync, mkdirSync } = global.nodemodule["fs-extra"];
			let threadInfo = await api.getThreadInfo(threadID),
				threadName = threadInfo.threadName,
				settings = global.data.threadData.get(threadID) || {},
				dirGif = __dirname + `/cache/joinGif/`,
				msg, formPush;
			var mentions = [], nameArray = [], memLength = [];
			for (var i = 0; i < event.logMessageData.addedParticipants.length; i++) {
				let id = event.logMessageData.addedParticipants[i].userFbId;
				let userName = event.logMessageData.addedParticipants[i].fullName;
				nameArray.push(userName);
				mentions.push({ tag: userName, id });
				memLength.push(threadInfo.participantIDs.length - i);
			}
			memLength.sort((a, b) => a - b);

			await Threads.createData(parseInt(threadID), { data: {}, threadInfo	 });
			global.data.allThreadID.push(parseInt(threadID));
			
			(typeof settings.customJoin == "undefined") ? msg = "Welcome aboard {name}.\nChào mừng đã đến với {threadName}.\n{type} là thành viên thứ {soThanhVien} của nhóm 🥳" : msg = settings.customJoin;
			msg = msg
			.replace(/\{name}/g, nameArray.join(', '))
			.replace(/\{type}/g, (memLength.length > 1) ?  'các bạn' : 'bạn')
			.replace(/\{soThanhVien}/g, memLength.join(', '))
			.replace(/\{threadName}/g, threadName);
			if (existsSync(dirGif)) mkdirSync(dirGif, { recursive: true });
			if (existsSync(dirGif + `${threadID}.gif`)) formPush = { body: msg, attachment: createReadStream(dirGif + `${threadID}.gif`), mentions }
			else formPush = { body: msg, mentions }
			return api.sendMessage(formPush, threadID);
		} catch (e) { return console.log(e) };
	}
}