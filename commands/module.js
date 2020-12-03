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
async function enableModule({nameOfModule, event, api, client}) {
	const logger = require("../utils/log.js")
	const { join } = require("path");
	const { resolve } = require("path");
	const { execSync } = require('child_process');
	const node_modules = '../node_modules/';
	try{ client.commands.delete(nameOfModule) } catch(e) { return api.sendMessage(`Không thể reload module của bạn, lỗi: ${e}`, event.threadID) };
	const command = require(join(__dirname, `${nameOfModule}`));
	try {
		if (client.commands.has(command)) throw new Error('Bị trùng!');
		if (!command.config || !command.run) throw new Error(`Sai format!`);
		if (command.config.dependencies) {
			try {
				for (let i of command.config.dependencies) require(i);
			}
			catch (e) {
				api.sendMessage(`Không tìm thấy gói phụ trợ cho module ${command.config.name}, tiến hành cài đặt: ${command.config.dependencies.join(", ")}!`, event.threadID);
				execSync('npm install -s ' + command.config.dependencies.join(" "));
				api.sendMessage(`Đã cài đặt thành công toàn bộ gói phụ trợ cho module ${command.config.name}`, event.threadID);
			}
		}
		client.commands.set(command.config.name, command);
		return api.sendMessage(`Loaded command ${command.config.name}!`, event.threadID);
	}
	catch (error) {
		return api.sendMessage(`Không thể load module command ${nameOfModule} với lỗi: ${error.message}`, event.threadID);
	}
}

function disableModule({nameOfModule, event, api, client}) {
	try{
		client.commands.delete(nameOfModule);
		return api.sendMessage(`Disabled command ${nameOfModule}!`, event.threadID);
	}
	catch(e) {
		return api.sendMessage(`Cant disable module command ${nameOfModule} with error: ${error}`, event.threadID);
	}
}

//Import module
async function importModule(url) {
	const { createWriteStream } = require("fs-extra");
	const request = require("request");
	const regex = /^https?:\/\/(?:[a-z\-]+\.)+[a-z]{2,6}(?:\/[^\/#?]+)+\.(?:zip)$/;
	if (!regex.test(url)) return api.sendMessage("Url module của bạn không phải ở dạng .zip!", event.threadID, event.messageID);
	require(url).pipe(createWriteStream(__dirname + `/cache/tempModule.${url.substring(url.lastIndexOf(".") + 1)}`)).on("close", () => {
		
	});
}

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
	else if (args[0] == "enable") {
		//Will do something in here
		enableModule({nameOfModule: args[1], event, api, client});
	}
	else if (args[0] == "disable") {
		disableModule({nameOfModule: args[1], event, api, client});
	}
	else if (args[0] == "import") {
		//Will do something in here
		//Will need to reload it after import
	}
	else return api.sendMessage("Input bạn nhập không tồn tại trong câu lệnh ;w;", event.threadID, event.messageID);
}