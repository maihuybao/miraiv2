//=========Call Variable=========//

let needReload;
const logger = require("../utils/log.js");
const moment = require("moment-timezone");
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const { readdirSync, accessSync, existsSync, readFileSync } = require("fs-extra");
const { join } = require("path");
const { resolve } = require("path");
const { execSync, exec } = require('child_process');
const node_modules = '../node_modules/';

const client = new Object({
	commands: new Map(),
	events: new Map(),
	cooldowns: new Map(),
	commandArray: new Array(),
	handleReply: new Array()
});

const __GLOBAL = new Object({
	settings: new Array()
})

//========= Do something in here o.o =========//

//========= Get all command files =========//

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

try {
	for (let i of client.commands.values()) {
		client.commandArray.push(i.config.name);
	}
}
catch (error) {
	logger("Đã xảy ra lỗi trong quá trình đẩy lệnh!", 2); //tôi còn đéo biết tôi đang làm gì nữa
}

//========= set variable =========//

const config = require("../config.json");
if (!config || config.length == 0) return logger("Không tìm thấy file config của bot!!", 2);

try{
	for (let [name, value] of Object.entries(config)) {
		__GLOBAL.settings[name] = value;
	}
	logger("Config Loaded!");
}
catch (error) {
	return logger("Không thể load config!", 2);
}

//========= Handle Events =========//
module.exports = function({ api }) {
	const funcs = require("../utils/funcs.js")({ api });
	logger("Bot started!", "[ SYSTEM ]");
	logger("This bot was made by Catalizcs(roxtigger2003) and SpermLord");
	return async (error, event) => {
		if (error) return logger(JSON.stringify(error), 2);

		const handleCommand = require("./handle/handleCommand")({ api, __GLOBAL, client });
		const handleReply = require("./handle/handleReply")({ api, __GLOBAL, client });
		const handleEvent = require("./handle/handleEvent")({ api, __GLOBAL, client });

		switch (event.type) {
			case "message":
			case "message_reply": 
				handleCommand({ event })
				handleReply({ event })
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