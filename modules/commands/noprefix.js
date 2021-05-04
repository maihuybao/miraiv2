module.exports.config = {
name: "noprefix",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "BerVer",
	description: "Chào",
	commandCategory: "general",
	usages: "hi",
	cooldowns: 5,
};
module.exports.event = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	var out = (msg) => api.sendMessage(msg, event.threadID, event.messageID);
	if (event.body=="hi" || (event.body=="Hi")) {
		return out("Xin chào, \n Chúc bạn ngày mới tốt lành \n\rBerBot")
	}
	if (event.body=="prefix" || (event.body=="Prefix")) {
		return out(`Xin chào, \nPrefix của BerBot là : ${__GLOBAL.settings.BOTNAME}\n\rBerBot`)
	}
}
	module.exports.run = function({ api, event, client, __GLOBAL }) {

}
