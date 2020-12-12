module.exports.config = {
	name: "setname",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "Thọ",
	description: "Đổi biệt danh trong nhóm của bạn hoặc của người bạn tag",
	commandCategory: "general",
	usages: "setname [name]",
	cooldowns: 3,
	dependencies: []
};

module.exports.run = async function({ api, event, args }) {
  var name = args.join(" ")
var mention = Object.keys(event.mentions)[0];
         if (!mention) return api.changeNickname(`${name}`, event.threadID, event.senderID);
         if (name.indexOf("@") !== -1) return api.changeNickname(`${name.replace(event.mentions[mention], "")}`, event.threadID, mention);
		  }