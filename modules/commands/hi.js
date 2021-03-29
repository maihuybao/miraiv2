module.exports.config = {
name: "hi",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "BerVer",
	description: "Chào",
	commandCategory: "general",
	usages: "hi",
	cooldowns: 0,
};
module.exports.event = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	var out = (msg) => api.sendMessage(msg, event.threadID, event.messageID);
	if (event.body.indexOf("hi")==0 || (event.body.indexOf("Hi")==0)) {
		return out("This is BerBot")
	}
}
	module.exports.run = function({ api, event, client, __GLOBAL }) {

}
