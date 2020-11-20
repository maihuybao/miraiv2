module.exports.config = {
	name: "module",
	version: "1.0.0",
	credits: "CatalizCS",
	hasPermssion: 2,
	description: "Quản lý module",
	commandCategory: "system",
	usages: "module [exec] args",
	cooldowns: 5,
	info: [
		{
			key: 'exec',
			prompt: 'Lựa chọn lệnh cần thực thi',
			type: 'Văn Bản',
			example: 'all'
		}
	]
};

//Reload module
function reloadModule() {}

//Import module
function importModule(url) {}

module.exports.run = function({ api, event, args, client, __GLOBAL }) {
	if (args[0] == "all") {
		let commands = client.commands.values();
		let infoCommand = "";
		for (const cmd of commands) {
			if (cmd.config.name && cmd.config.version && cmd.config.credits) {
				infoCommand += `\n - ${cmd.config.name} version ${cmd.config.version} by ${cmd.config.credits}`;
			};
		}
		return api.sendMessage("Hiện tại đang có " + client.commands.size + " module đang chạy!" + infoCommand, event.threadID, event.messageID);
	}
	else if (args[0] == "reload") {
		//Will do something in here
	}
	else if (args[0] == "import") {
		//Will do something in here
		//Will need to reload it after import
	}
	else return api.sendMessage("Input bạn nhập không tồn tại trong câu lệnh ;w;", event.threadID, event.messageID);
}