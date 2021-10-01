module.exports.config = {
	name: "rankup",
	version: "0.0.1-beta",
	hasPermssion: 1,
	credits: "CatalizCS",
	description: "Thông báo rankup cho từng nhóm, người dùng",
	commandCategory: "system",
	usages: "rankup",
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

	if (typeof threadData["rankup"] != "undefined" && threadData["rankup"] == false) return;
	if (client.inProcess == true) return;

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
module.exports.run = async function({ api, event, Threads, client }) {
	let settings = (await Threads.getData(event.threadID)).settings;
	if (typeof settings["rankup"] == "undefined" || settings["rankup"] == false) settings["rankup"] = true;
	else settings["rankup"] = false;
	
	await Threads.setData(event.threadID, options = { settings });
	client.threadSetting.set(event.threadID, settings);
	
	return api.sendMessage(`Đã ${(settings["rankup"] == true) ? "bật" : "tắt"} thành công thông báo rankup!`, event.threadID);
}