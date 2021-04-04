module.exports.config = {
	name: "command",
	version: "1.0.2",
	credits: "CatalizCS",
	hasPermssion: 2,
	description: "Quản lý module command",
	commandCategory: "system",
	usages: "command [exec] args",
	cooldowns: 0,
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

const load = async ({ name, event, api, client, __GLOBAL, loadAll }) => {
	const logger = require(process.cwd() + "/utils/log.js"),
			{ join } = require("path"),
			{ execSync } = require("child_process"),
			{ writeFileSync } = require("fs-extra");

	delete require.cache[require.resolve(client.dirConfig)];
	var configValue = require(client.dirConfig);

	try {
		require.resolve(__dirname + `/${name}.js`)
	}
	catch {
		return api.sendMessage(`Không tìm thấy module: ${name}.js`, event.threadID, event.messageID);
	}

	client.commands.delete(name);
	delete require.cache[require.resolve(__dirname + `/${name}.js`)];
	
	try {
		const command = require(join(__dirname, `${name}`));
		if (!command.config || !command.run || !command.config.commandCategory || typeof command.run !== "function") throw new Error(`Module không đúng định dạng!`);
		if (client.commands.has(command.config.name)) throw new Error(`Tên module bị trùng với một module mang cùng tên khác!`);
		if (command.config.dependencies) {
			try {
				for (const i of command.config.dependencies) require.resolve(i);
			}
			catch (e) {
				logger.loader(`Không tìm thấy gói phụ trợ cho module ${command.config.name}, tiến hành cài đặt: ${command.config.dependencies.join(", ")}!`, "warm");
				execSync('npm install -s ' + command.config.dependencies.join(" "));
				delete require.cache[require.resolve(`./${file}`)];
				logger.loader(`Đã cài đặt thành công toàn bộ gói phụ trợ cho module ${command.config.name}`);
			}
		}
		if (command.config.envConfig) {
			try {
				for (const [key, value] of Object.entries(command.config.envConfig)) {
					if (typeof __GLOBAL[command.config.name] == "undefined") __GLOBAL[command.config.name] = new Object();
					if (typeof configValue[command.config.name] == "undefined") configValue[command.config.name] = new Object();
					if (typeof configValue[command.config.name][key] !== "undefined") __GLOBAL[command.config.name][key] = configValue[command.config.name][key]
					else __GLOBAL[command.config.name][key] = value || "";
					if (typeof configValue[command.config.name][key] == "undefined") configValue[command.config.name][key] = value || "";
				}
				logger.loader(`Loaded config module ${command.config.name}`)
			} catch (error) {
				console.log(error);
				logger.loader(`Không thể tải config module ${command.config.name}`, "error");
			}
		}
		if (command.onLoad) try {
			command.onLoad({ __GLOBAL, client, configValue });
		}
		catch (error) {
			logger.loader(`Không thể chạy setup module: ${command} với lỗi: ${error.message}`, "error");
		}
		if (command.event) {
			var registerCommand = client.commandRegister.get("event") || [];
			registerCommand.push(command.config.name);
			client.commandRegister.set("event", registerCommand);
		}
		client.commands.set(command.config.name, command);
		if (__GLOBAL.settings["commandDisabled"].includes(`${name}.js`) || configValue["commandDisabled"].includes(`${name}.js`)) {
			configValue["commandDisabled"].splice(configValue["commandDisabled"].indexOf(`${name}.js`), 1);
			__GLOBAL.settings["commandDisabled"].splice(__GLOBAL.settings["commandDisabled"].indexOf(`${name}.js`), 1);
		}
		writeFileSync(client.dirConfig, JSON.stringify(configValue, null, 4));
		logger.loader(`Loaded module ${command.config.name}`);
		if (loadAll == true) return
		else return api.sendMessage(`Loaded command ${command.config.name}!`, event.threadID);
	}
	catch (error) {
		logger.loader(`Không thể load module command ${name} với lỗi: ${error.name}:${error.message}`, "error");
		if (loadAll == true) return
		else return api.sendMessage(`Không thể load module command ${name} với lỗi: ${error.name}:${error.message}`, event.threadID);
	}
}

const unload = async ({ name, event, api, client, __GLOBAL }) => {
	const { writeFileSync } = require("fs-extra");
	delete require.cache[require.resolve(client.dirConfig)];
	var configValue = require(client.dirConfig);
	client.commands.delete(name);
	configValue["commandDisabled"].push(`${name}.js`);
	__GLOBAL.settings["commandDisabled"].push(`${name}.js`);
	writeFileSync(client.dirConfig, JSON.stringify(configValue, null, 4));
	return api.sendMessage(`Đã unload lệnh: ${name}`, event.threadID, event.messageID);
}

const reloadConfig = ({ __GLOBAL, event, api, client }) => {
	delete require.cache[require.resolve(client.dirConfig)];
	const config = require(client.dirConfig);
	try {
		for (let [name, value] of Object.entries(config)) __GLOBAL.settings[name] = value;
		return api.sendMessage("Config Reloaded!", event.threadID, event.messageID);
	}
	catch (error) {
		return api.sendMessage(`Không thể reload config với lỗi: ${error.name}: ${error.message}`, event.threadID, event.messageID);
	}
}

module.exports.run = async ({ event, api, __GLOBAL, client, args, utils }) => {
	const { readdirSync } = require("fs-extra");
	const content = args.slice(1, args.length);
	switch (args[0]) {
		case "all": {
			let commands = client.commands.values();
			let infoCommand = "";
			for (const cmd of commands) {
				if (cmd.config.name && cmd.config.version && cmd.config.credits) {
					infoCommand += `\n - ${cmd.config.name} version ${cmd.config.version} by ${cmd.config.credits}`;
				};
			}
			api.sendMessage("Hiện tại đang có " + client.commands.size + " module có thể sử dụng!" + infoCommand, event.threadID, event.messageID);
		}
		break;
		case "load": {
			const commands = content;
			if (commands.length == 0) return api.sendMessage("không được để trống", event.threadID, event.messageID);
			for (const name of commands) {
				load({ name, event, api, client, __GLOBAL });
				await new Promise(resolve => setTimeout(resolve, 1 * 1000));
			}
		}
		break;
		case "loadAll": {
			const commandFiles = readdirSync(__dirname).filter((file) => file.endsWith(".js") && !file.includes('example')).map((nameModule) => nameModule.replace(/.js/gi, ""));;
			client.commands.clear();
			for (const name of commandFiles) {
				load({ name, event, api, client, __GLOBAL, loadAll: true });
				await new Promise(resolve => setTimeout(resolve, 100));
			}
			api.sendMessage("loadAll success", event.threadID, event.messageID);
		}
		break;
		case "unload": {
			const commands = content;
			if (commands.length == 0) return api.sendMessage("không được để trống", event.threadID, event.messageID);
			var count = 0;
			for (const name of commands) {
				unload({ name, event, api, client, __GLOBAL });
				count++
				console.log(count);
				await new Promise(resolve => setTimeout(resolve, 1 * 1000));
			}	
		}
		break;
		case "unloadAll": {
			client.commands.clear();
			load({ name: "command", event, api, client, __GLOBAL, loadAll: true });
			api.sendMessage("unloadAll success", event.threadID, event.messageID);
		}
		break;
		default:
			utils.throwError("command", event.threadID, event.messageID);
		break;
	}
}