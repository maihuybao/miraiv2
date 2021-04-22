module.exports.config = {
	name: "rankup",
	version: "0.0.1-beta",
	hasPermssion: 1,
	credits: "CatalizCS",
	description: "Thông báo rankup cho từng nhóm, người dùng",
	commandCategory: "system",
	usages: "rankup on/off",
	dependencies: ["fs-extra"],
	cooldowns: 5,
	envConfig: {
		unsendMessageAfter: 5
	}
};

module.exports.event = async function({ api, event, Currencies, Users, client }) {
	const {threadID, senderID } = event;
	const { createReadStream, existsSync, mkdirSync } = require("fs-extra");

	const threadData = client.threadSetting.get(threadID) || {};

	if (typeof client["rankup"] != "undefined" && threadData["rankup"] == false) return;

	var exp = parseInt((await Currencies.getData(senderID)).exp);
	exp = exp += 1;

	if (isNaN(exp)) return;

	const curLevel = Math.floor((Math.sqrt(1 + (4 * exp / 3) + 1) / 2));
	const level = Math.floor((Math.sqrt(1 + (4 * (exp + 1) / 3) + 1) / 2));

	if (level > curLevel && level != 1) {
		const nameUser = (await Users.getData(senderID)).name || (await Users.getInfo(senderID)).name;
		var messsage = (typeof threadData.customRankup == "undefined") ? msg = "Trình độ chém gió của {name} đã đạt tới level {level}" : msg = threadData.customRankup,
			arrayContent;

		messsage = messsage
			.replace(/\{name}/g, nameUser)
			.replace(/\{level}/g, level);
			
		if (existsSync(__dirname + "/cache/rankup/")) mkdirSync(__dirname + "/cache/rankup/", { recursive: true });
		if (existsSync(__dirname + `/cache/rankup/${event.threadID}.gif`)) arrayContent = { body: messsage, attachment: createReadStream(__dirname + `/cache/rankup/${event.threadID}.gif`), mentions: [{ tag: nameUser, id: senderID }] };
		else arrayContent = { body: messsage, mentions: [{ tag: nameUser, id: senderID }] };
		api.sendMessage(arrayContent, threadID);
	}

	await Currencies.setData(senderID, { exp });
	return;
}
module.exports.run = async function({ api, event, args, Threads, client, utils }) {
	let settings = (await Threads.getData(event.threadID)).settings;
	switch (args[0]) {
		case "off": settings["rankup"] = false;
		break;
		case "on": settings["rankup"] = true;
		break;
		default:
		return utils.throwError("rankup", event.threadID, event.messageID);
	}
	await Threads.setData(event.threadID, options = { settings });
	client.threadSetting.set(event.threadID, settings);
	return api.sendMessage(`Đã ${(settings["rankup"] == true) ? "bật" : "tắt"} thành công thông báo rankup!`, event.threadID);
}