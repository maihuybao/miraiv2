module.exports.config = {
	name: "command",
	version: "1.0.0",
	credits: "CatalizCS",
	hasPermssion: 2,
	description: "Quản lý module command",
	commandCategory: "System",
	usages: "command [exec] args",
	cooldowns: 5,
	dependencies: ["fs-extra"],
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
	const { writeFileSync } = require("fs-extra");
	let config = require(`./../../${client.globalConfig}`);
	try{ client.commands.delete(nameOfModule) } catch(e) { return api.sendMessage(`Không thể reload module của bạn, lỗi: ${e}`, event.threadID) };
	delete require.cache[require.resolve(`./${nameOfModule}.js`)];
	const command = require(join(__dirname, `${nameOfModule}`));
	try {
		if (client.commands.has(command)) throw new Error('Bị trùng!');
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
            } catch (error) {
                console.log(error);
            }
        }
		client.commands.set(command.config.name, command);
		writeFileSync(`../../${client.globalConfig}`, JSON.stringify(config, null, 4));
		return api.sendMessage(`Loaded command ${command.config.name}!`, event.threadID);
	}
	catch (error) {
		return api.sendMessage(`Không thể load module command ${nameOfModule} với lỗi: ${error.message}`, event.threadID);
	}
}

function unloadModule({ nameOfModule, event, api, client }) {
	try{
		client.commands.delete(nameOfModule);
		return api.sendMessage(`Disabled command ${nameOfModule}!`, event.threadID);
	}
	catch(e) {
		return api.sendMessage(`Cant disable module command ${nameOfModule} with error: ${error}`, event.threadID);
	}
}

//reload config
function reloadConfig({ event, api, __GLOBAL, client }) {
	delete require.cache[require.resolve(`../../${client.globalConfig}`)];
	const config = require(`../../${client.globalConfig}`);
	try {
		for (let [name, value] of Object.entries(config)) __GLOBAL.settings[name] = value;
		return api.sendMessage("Config Reloaded!", event.threadID, event.messageID);
	}
	catch (error) {
		return api.sendMessage("Không thể reload config", event.threadID, event.messageID);
	}
}

module.exports.run = function({ api, event, args, client, __GLOBAL, utils }) {
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
	else if (args[0] == "load") loadModule({ nameOfModule: args[1], event, api, client, __GLOBAL });
	else if (args[0] == "unload") unloadModule({ nameOfModule: args[1], event, api, client, args });
	else if (args[0] == "reloadconfig") reloadConfig({ event, api, client, __GLOBAL, client });
	else return utils.throwError("command", event.threadID, event.messageID);
}