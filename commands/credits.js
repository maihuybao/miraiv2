

module.exports.config = {
	name: "credits",
	aliases: [],
	usage: "Credits who make thiz bot",
	commandCategory: "system"
};


module.exports.run = async (api, event, args) => {
	return api.sendMessage("This bot was made by Catalizcs(roxtigger2003)", event.threadID, event.messageID);
}