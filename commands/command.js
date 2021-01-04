module.exports.config = {
	name: "command",
	version: "1.0.0",
	credits: "CatalizCS",
	hasPermssion: 2,
	description: "Quản lý module",
	commandCategory: "system",
	usages: "command [exec] args",
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
async function loadModule({ nameOfModule, event, api, client, __GLOBAL }) {
	const logger = require("../utils/log.js")
	const { join, resolve } = require("path");
	const { execSync } = require('child_process');
	const node_modules = '../node_modules/';
	try{ client.commands.delete(nameOfModule) } catch(e) { return api.sendMessage(`Không thể reload module của bạn, lỗi: ${e}`, event.threadID) };
	delete require.cache[require.resolve(`./${nameOfModule}.js`)];
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
				if (process.env.API_SERVER_EXTERNAL == 'https://api.glitch.com') execSync('pnpm i ' + command.config.dependencies.join(" "));
				else execSync('npm install -s ' + command.config.dependencies.join(" "));
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

function unloadModule({ nameOfModule, event, api, client, args }) {
	try{
		client.commands.delete(nameOfModule);
		return api.sendMessage(`Disabled command ${nameOfModule}!`, event.threadID);
	}
	catch(e) {
		return api.sendMessage(`Cant disable module command ${nameOfModule} with error: ${error}`, event.threadID);
	}
}

//reload config
function reloadConfig({ event, api, client, __GLOBAL, utils }) {
	delete require.cache[require.resolve(`../config.js`)];
	const config = require("../config.json");
	try {
		for (let [name, value] of Object.entries(config)) __GLOBAL.settings[name] = value;
		return api.sendMessage("Config Reloaded!", event.threadID, event.messageID);
	}
	catch (error) {
		return logger("Không thể load config!", "[ LOADER ]");
	}
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
		return api.sendMessage("Hiện tại đang có " + client.commands.size + " module có thể sử dụng!" + infoCommand, event.threadID, event.messageID);
	}
	else if (args[0] == "load") loadModule({nameOfModule: args[1], event, api, client});
	else if (args[0] == "unload") unloadModule({nameOfModule: args[1], event, api, client, args});
	else if (args[0] == "reloadconfig") reloadConfig({ event, api, client, __GLOBAL });
	else return utils.throwError("command", event.threadID, event.messageID);
}