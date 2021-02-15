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
};

module.exports.event = async function({ api, event, Currencies, Users, client }) {
	let {threadID, senderID } = event;
	let data = (await Currencies.getData(senderID));
	if (!data) return;
	let exp = parseInt(data["exp"]);
	exp++
	await Currencies.setData(senderID, options = { exp });

	let countMess = (await Currencies.getData(senderID)).exp;
	let clientData = client.threadSetting.get(event.threadID) || {};
	const { createReadStream, existsSync, mkdirSync } = require("fs-extra");
	if (typeof countMess == "undefined" || clientData.hasOwnProperty("rankup") && clientData.rankup == false) return;
	let curLevel = Math.floor((Math.sqrt(1 + (4 * countMess / 3) + 1) / 2));
	let level = Math.floor((Math.sqrt(1 + (4 * (countMess + 1) / 3) + 1) / 2));
 	if (level > curLevel) {
		if (level == 1) return;
		let name = (await Users.getInfo(senderID)).name;
		let msg, formPush;
		(typeof clientData.customRankup == "undefined") ? msg = "Trình độ chém gió của {name} đã đạt tới level {level}" : msg = clientData.customRankup;
		msg = msg
		.replace(/\{name}/g, name)
		.replace(/\{level}/g, level);
		let dirGif = __dirname + "/cache/rankup/";
		if (existsSync(dirGif)) mkdirSync(dirGif, { recursive: true })
		if (existsSync(dirGif + `${event.threadID}.gif`)) formPush = { body: msg, attachment: createReadStream(dirGif + `${event.threadID}.gif`), mentions: [{ tag: name, id: senderID }] }
		else formPush = { body: msg, mentions: [{ tag: name, id: senderID }] }
		return api.sendMessage(formPush, threadID);
 	}
}
module.exports.run = async function({ api, event, args, Threads, client, utils }) {
	let settings = (await Threads.getData(event.threadID)).settings;
	switch (args[0]) {
		case "off":
			settings["rankup"] = false;
		break;
		case "on":
			settings["rankup"] = true;
		break;
		default:
		return  utils.throwError("rankup", event.threadID, event.messageID);
	}
	await Threads.setData(event.threadID, options = { settings });
	client.threadSetting.set(event.threadID, settings);
	return api.sendMessage(`Đã ${(settings["rankup"] == true) ? "bật" : "tắt"} thành công thông báo rankup!`, event.threadID);
}