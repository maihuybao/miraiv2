//=========Call Variable=========//

const logger = require("../utils/log.js");
const moment = require("moment-timezone");
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const client = new Object();
const { readdirSync, accessSync, existsSync, readFileSync } = require("fs-extra");
const { join } = require("path");
const { resolve } = require("path");
const { execSync, exec } = require('child_process');
const node_modules = '../node_modules/';
client.commands = new Map();
client.events = new Map();
client.cooldowns = new Map();
//client.replys = new Map();
//client.reactions = new Map();

//========= Do something in here o.o =========//

//========= Get all command files =========//
let needReload = "";

const commandFiles = readdirSync(join(__dirname, "../commands")).filter((file) => file.endsWith(".js") && !file.includes('example'));
for (const file of commandFiles) {
	const command = require(join(__dirname, "../commands", `${file}`));
	try {
		if (client.commands.has(command)) throw new Error('Bị trùng!');
		if (!command.config || !command.run) throw new Error(`Sai format!`);
		if (command.config.dependencies) {
			try {
				for (let i of command.config.dependencies) require(i);
			}
			catch (e) {
				logger(`Không tìm thấy gói phụ trợ cho module ${command.config.name}, tiến hành cài đặt: ${command.config.dependencies.join(", ")}!`, "[ INST MODULE ]");
				execSync('npm install -s ' + command.config.dependencies.join(" "));
				logger(`Đã cài đặt thành công toàn bộ gói phụ trợ cho module ${command.config.name}`, "[ INST MODULE ]");
				needReload += 1;
			}
		}
		client.commands.set(command.config.name, command);
		logger(`Loaded ${command.config.name}!`, "[ CMD MODULE ]");
	}
	catch (error) {
		logger(`Không thể load module ${file} với lỗi: ${error.message}`, "[ CMD MODULE ]");
	}
}

if (needReload) {
	logger("Tiến hành restart bot để có thể áp dụng các gói bổ trợ mới!", "[ INST MODULE ]");
	if (process.env.API_SERVER_EXTERNAL == 'https://api.glitch.com') return process.exit(1);
	else return execSync("pm2 reload 0");
}

//========= Get all event files =========//
const eventFiles = readdirSync(join(__dirname, "../events")).filter((file) => file.endsWith(".js"));
for (const file of eventFiles) {
	const event = require(join(__dirname, "../events", `${file}`));
	try {
		if (client.events.has(event)) throw new Error('Bị trùng!');
		if (!event.config || !event.run) throw new Error(`Sai format!`);
		client.events.set(event.config.name, event);
		logger(`Loaded ${event.config.name}!`, "[ EVENT MODULE ]");
	}
	catch (error) {
		logger(`Không thể load module ${file} với lỗi: ${error.message}`, "[ EVENT MODULE ]");
	}
}

//========= Handle Events =========//
module.exports = function({ api, __GLOBAL }) {
	const funcs = require("../utils/funcs.js")({ api, __GLOBAL });
	logger("Bot started!", "[ SYSTEM ]");
	logger("This bot was made by Catalizcs(roxtigger2003) and SpermLord");
	return async (error, event) => {
		if (error) return logger(JSON.stringify(error), 2);

		const handleCommand = require("./handle/handleCommand")({ api, __GLOBAL, client });
		//const handleSetValue = require("./handle/handleSetValue")({ api, __GLOBAL, __client });
		const handleEvent = require("./handle/handleEvent")({ api, __GLOBAL, client });

		switch (event.type) {
			case "message":
			case "message_reply": 
				handleCommand({ event })
				break;
			case "event":
				handleEvent({ event })
				break;
			default:
				break;
		}
	};
}
//THIZ BOT WAS MADE BY ME(CATALIZCS) AND MY BROTHER SPERMLORD - DO NOT STEAL MY CODE (つ ͡ ° ͜ʖ ͡° )つ ✄ ╰⋃╯