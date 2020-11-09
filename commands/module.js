module.exports.config = {
	name: "module",
	version: "1.0.0",
	credits: "CatalizCS",
	hasPermssion: 3,
	credits: "CatalizCS",
	description: "manager modules",
	commandCategory: "system",
	usages: "module choose args",
	cooldowns: 5,
	info: [
		{
			key: 'choose',
			prompt: 'idk man.',
			type: 'Văn Bản',
			example: 'all'
		}
	]
};

//reload module
function reloadModule() {}

//import module
function importModule(url) {}

module.exports.run = function(api, event, args, client, __GLOBAL) {
	if (args[0] == "all") {
		let commands = client.commands.values();
		let infoCommand = "";
		for (const cmd of commands) {
			if (cmd.config.name && cmd.config.version && cmd.config.credits) {
				infoCommand += `\n - ${cmd.config.name} version ${cmd.config.version} made by ${cmd.config.credits}`;
			};
		}
		return api.sendMessage("Hiện tại đang có " + client.commands.size + " module được load!" + infoCommand, event.threadID, event.messageID);
	}
	else if (args[0] == "reload") {
		//will do something in here
	}
	else if (args[0] == "import") {
		//will do something in here
	}
	else return api.sendMessage("Input bạn nhập không tồn tại trong câu lệnh ;w;", event.threadID, event.messageID);
}