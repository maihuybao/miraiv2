module.exports.config = {
	name: "module",
	version: "1.0.0",
	credits: "CatalizCS",
	hasPermssion: 2,
	description: "Quản lý module",
	commandCategory: "system",
	usages: "module [exec] args",
	cooldowns: 5,
	dependencies: ["path","child_process","request","fs-extra","unzip"],
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
async function enableModule({ nameOfModule, event, api, client, __GLOBAL }) {
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

function disableModule({ nameOfModule, event, api, client, args }) {
	try{
		client.commands.delete(nameOfModule);
		return api.sendMessage(`Disabled command ${nameOfModule}!`, event.threadID);
	}
	catch(e) {
		return api.sendMessage(`Cant disable module command ${nameOfModule} with error: ${error}`, event.threadID);
	}
}

//Import module
async function fetchModule({ url, event, api, client, __GLOBAL }) {
	const { readdirSync, createReadStream, createWriteStream, unlinkSync, rename } = require("fs-extra");
	const request = require("request");
	const unzip = require("unzip");
	const { join } = require("path");
	const regex = /^https?:\/\/(?:[a-z\-]+\.)+[a-z]{2,6}(?:\/[^\/#?]+)+\.(?:zip)$/;
	if (!regex.test(url)) return api.sendMessage("Url module của bạn không phải ở dạng .zip!", event.threadID, event.messageID);
	return require(url).pipe(createWriteStream(__dirname + `/cache/tempModule.${url.substring(url.lastIndexOf(".") + 1)}`)).on("close", () => {
		createReadStream(__dirname + `/cache/tempModule.${url.substring(url.lastIndexOf(".") + 1)}`).pipe(unzip.Extract({ path: 'path' }));
		const files = readdirSync(join(__dirname, "cache/tempModule")).filter((file) => file.endsWith(".js") && !file.includes('example'));
		for (const file of files) {
			const currentPath = join(__dirname, "cache/tempModule", `${file}.js`);
			const destinationPath = join(__dirname, `${file}.js`);
			rename(currentPath, destinationPath, function (err) {
				if (err) return api.sendMessage("cant move your module!", event.threadID);
				enableModule({nameOfModule: file, event, api, client});
			})
		}
		unlinkSync(__dirname + "/cache/tempModule");
		unlinkSync(__dirname + `/cache/tempModule.${url.substring(url.lastIndexOf(".") + 1)}`);
		return api.sendMessage("Module của bạn đã được cài đặt thành công!", event.threadID);
	});
}

//reload config
function reloadConfig({ event, api, client, __GLOBAL }) {
	delete require.cache[require.resolve(`../config.js`)];
	const config = require("../config.json");
	try {
		for (let [name, value] of Object.entries(config)) {
			__GLOBAL.settings[name] = value;
		}
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
		return api.sendMessage("Hiện tại đang có " + client.commands.size + " module đang chạy!" + infoCommand, event.threadID, event.messageID);
	}
	else if (args[0] == "enable") enableModule({nameOfModule: args[1], event, api, client});
	else if (args[0] == "disable") disableModule({nameOfModule: args[1], event, api, client, args});
	else if (args[0] == "reloadconfig") reloadConfig({ event, api, client, __GLOBAL });
	else if (args[0] == "import") fetchModule({ url: args[1], event, api, client, __GLOBAL });
	else return api.sendMessage("Input bạn nhập không tồn tại trong câu lệnh ;w;", event.threadID, event.messageID);
}