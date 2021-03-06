module.exports.config = {
	name: "event",
	version: "1.0.1",
	credits: "CatalizCS",
	hasPermssion: 2,
	description: "Quản lý module event",
	commandCategory: "system",
	usages: "event [exec] args",
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

const load = async ({ name, event, api, client, __GLOBAL, loadAll }) => {
	const logger = require(process.cwd() + "/utils/log.js"),
			{ join } = require("path"),
			{ execSync } = require("child_process"),
			{ writeFileSync } = require("fs-extra");
	
	var configValue = require(client.dirConfig);

	try {
		require.resolve(__dirname + `/../events/${name}.js`)
	}
	catch {
		return api.sendMessage(`Không tìm thấy module: ${name}.js`, event.threadID, event.messageID);
	}

	client.events.delete(name);
	delete require.cache[require.resolve(__dirname + `/../events/${name}.js`)];
	
	try {
		const events = require(join(__dirname, "/../events/", `${name}`));
		if (!events.config || !events.run || !events.config.commandCategory) throw new Error(`Sai format!`);
		if (client.events.has(command.events.name)) throw new Error('Bị trùng!');
		if (events.config.dependencies) {
			try {
				for (const i of events.config.dependencies) require.resolve(i);
			}
			catch (e) {
				logger.loader(`Không tìm thấy gói phụ trợ cho module ${events.config.name}, tiến hành cài đặt: ${events.config.dependencies.join(", ")}!`, "warm");
				execSync('npm install -s ' + events.config.dependencies.join(" "));
				delete require.cache[require.resolve(`../events/${file}`)];
				logger.loader(`Đã cài đặt thành công toàn bộ gói phụ trợ cho module ${events.config.name}`);
			}
		}
		if (events.config.envConfig) {
			try {
				for (const [key, value] of Object.entries(events.config.envConfig)) {
					if (typeof __GLOBAL[events.config.name] == "undefined") __GLOBAL[events.config.name] = new Object();
					if (typeof configValue[events.config.name] == "undefined") configValue[events.config.name] = new Object();
					if (typeof configValue[events.config.name][key] !== "undefined") __GLOBAL[events.config.name][key] = configValue[events.config.name][key]
					else __GLOBAL[events.config.name][key] = value || "";
					if (typeof configValue[events.config.name][key] == "undefined") configValue[events.config.name][key] = value || "";
				}
				logger.loader(`Loaded config module ${events.config.name}`)
			} catch (error) {
				console.log(error);
				logger.loader(`Không thể tải config module ${events.config.name}`, "error");
			}
		}
		if (events.onLoad) try {
			events.onLoad({ __GLOBAL, client, configValue });
		}
		catch (error) {
			logger.loader(`Không thể chạy setup module: ${events} với lỗi: ${error.name} - ${error.message}`, "error");
		}
		client.events.set(events.config.name, events);
		writeFileSync(client.dirConfig, JSON.stringify(configValue, null, 4));
		logger.loader(`Loaded module ${events.config.name}`);
		if (loadAll) return
		else return api.sendMessage(`Loaded event ${events.config.name}!`, event.threadID);
	}
	catch (error) {
		logger.loader(`Không thể load module event ${name} với lỗi: ${error.name}:${error.message}`, "error");
		if (loadAll) return
		else return api.sendMessage(`Không thể load module event ${name} với lỗi: ${error.name}:${error.message}`, event.threadID);
	}
}

const unload = async ({ name, event, api, client }) => {
	client.events.delete(name);
	return api.sendMessage(`Đã unload event: ${name}`, event.threadID, event.messageID);
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
	let content = args.slice(1, args.length);

	const log = api.sendMessage;
	switch (args[0]) {
		case "all": {
			let commands = client.commands.values();
			let infoCommand = "";
			for (const cmd of commands) {
				if (cmd.config.name && cmd.config.version && cmd.config.credits) {
					infoCommand += `\n - ${cmd.config.name} version ${cmd.config.version} by ${cmd.config.credits}`;
				};
			}
			api.sendMessage("Hiện tại đang có " + client.events.size + " event module có thể sử dụng!" + infoCommand, event.threadID, event.messageID);
		}
		break;
		case "load": {
			const events = content;
			if (events.length == 0) return api.sendMessage("không được để trống", event.threadID, event.messageID);
			for (const name of events) {
				load({ name, event, api, client, __GLOBAL });
				await new Promise(resolve => setTimeout(resolve, 1 * 1000));
			}
		}
		break;
		case "loadAll": {
			const eventFiles = readdirSync(__dirname).filter((file) => file.endsWith(".js") && !file.includes('example')).map((nameModule) => nameModule.replace(/.js/gi, ""));;
			client.events.clear();
			for (const name of eventFiles) {
				load({ name, event, api, client, __GLOBAL, loadAll: true });
				await new Promise(resolve => setTimeout(resolve, 100));
			}
			api.sendMessage("loadAll success", event.threadID, event.messageID);
		}
		break;
		case "unload": {
			const events = content;
			if (events.length == 0) return api.sendMessage("không được để trống", event.threadID, event.messageID);
			for (const name of events) {
				unload({ name, event, api, client, __GLOBAL });
				await new Promise(resolve => setTimeout(resolve, 1 * 1000));

			}
		}
		break;
		case "unloadAll": {
			client.events.clear();
			load({ name: "event", event, api, client, __GLOBAL, loadAll: true });
			api.sendMessage("unloadAll success", event.threadID, event.messageID);
		}
		break;
		default:
			utils.throwError("event", event.threadID, event.messageID);
			break;
	}
}