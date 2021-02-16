module.exports.config = {
	name: "event",
	version: "1.0.0",
	credits: "CatalizCS",
	hasPermssion: 2,
	description: "Quản lý module event",
	commandCategory: "System",
	usages: "event [exec] args",
	dependencies: ["fs"],
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
	const { join } = require("path");
	const { execSync } = require('child_process');
	const { writeFileSync } = require("fs");
	let config = require(`../../${client.globalConfig}`);
	try{ client.events.delete(nameOfModule) } catch(e) { return api.sendMessage(`Không thể reload module của bạn, lỗi: ${e}`, event.threadID) };
	delete require.cache[require.resolve(`../events/${nameOfModule}.js`)];
	const command = require(join(__dirname, `../events/${nameOfModule}`));
	try {
		if (client.events.has(command)) throw new Error('Bị trùng!');
		if (!command.config || !command.run) throw new Error(`Sai format!`);
		if (command.config.dependencies) {
			try {
				for (let i of command.config.dependencies) require.resolve(i);
			}
			catch (e) {
				execSync('npm install -s ' + command.config.dependencies.join(" "));
				api.sendMessage(`Đã cài đặt thành công toàn bộ gói phụ trợ cho module ${command.config.name}`, event.threadID);
			}
		}
		if (command.config.envConfig) {
            try {
                for (const [key, value] of Object.entries(command.config.envConfig)) {
                    if (typeof __GLOBAL[command.config.name] == "undefined") __GLOBAL[command.config.name] = new Object();
                    if (typeof config[command.config.name] == "undefined") config[command.config.name] = new Object();
                    if (typeof config[command.config.name][key] !== "undefined") __GLOBAL[command.config.name][key] = config[command.config.name][key]
                    else __GLOBAL[command.config.name][key] = value || "";
                    if (typeof config[command.config.name][key] == "undefined") config[command.config.name][key] = value || "";
                }
                logger(`Loaded config event module ${event.config.name}`, "[ LOADER ]")
            } catch (error) {
                logger(`Không thể tải config event module ${event.config.name}`, "[ LOADER ]");
            }
        }s
		client.events.set(command.config.name, command);
		writeFileSync(`../../${client.globalConfig}`, JSON.stringify(config, null, 4));
		return api.sendMessage(`Loaded evenr ${command.config.name}!`, event.threadID);
	}
	catch (error) {
		return api.sendMessage(`Không thể load module command ${nameOfModule} với lỗi: ${error.message}`, event.threadID);
	}
}

function unloadModule({ nameOfModule, event, api, client }) {
	try{
		client.events.delete(nameOfModule);
		return api.sendMessage(`Unloaded command ${nameOfModule}!`, event.threadID);
	}
	catch(e) {
		return api.sendMessage(`Cant unload module command ${nameOfModule} with error: ${error}`, event.threadID);
	}
}

module.exports.run = function({ api, event, args, client, __GLOBAL, utils }) {
	if (args[0] == "all") {
		let commands = client.events.values();
		let infoCommand = "";
		for (const cmd of commands) {
			if (cmd.config.name && cmd.config.version && cmd.config.credits) {
				infoCommand += `\n - ${cmd.config.name} version ${cmd.config.version} by ${cmd.config.credits}`;
			};
		}
		return api.sendMessage("Hiện tại đang có " + client.events.size + " module có thể sử dụng!" + infoCommand, event.threadID, event.messageID);
	}
	else if (args[0] == "load") loadModule({ nameOfModule: args[1], event, api, client, __GLOBAL });
	else if (args[0] == "unload") unloadModule({ nameOfModule: args[1], event, api, client, args });
	else if (args[0] == "reloadconfig") reloadConfig({ event, api, client, __GLOBAL });
	else return utils.throwError("event", event.threadID, event.messageID);
}