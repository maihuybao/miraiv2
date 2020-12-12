//=========Call Variable=========//

let needReload;
const logger = require("../utils/log.js");
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const { readdirSync, accessSync, existsSync, readFileSync } = require("fs-extra");
const { join } = require("path");
const { resolve } = require("path");
const { execSync, exec } = require('child_process');
const node_modules = '../node_modules/';
const semver = require('semver');
const axios = require("axios");

const client = new Object({
	commands: new Map(),
	events: new Map(),
	cooldowns: new Map(),
	handleReply: new Map(),
	handleReaction: new Map(),
	userBanned: new Map(),
	threadBanned: new Map(),
	threadSetting: new Map(),
	hasConnectedToDB: new Boolean()
});

const __GLOBAL = new Object({
	settings: new Array()
})

//========= Do something in here o.o =========//

//========= Check update for you :3 =========//

axios.get('https://raw.githubusercontent.com/catalizcs/miraiv2/master/package.json').then((res) => {
	logger("Đang kiểm tra cập nhật...", "[ CHECK UPDATE ]");
	var local = JSON.parse(fs.readFileSync('../package.json')).version;
	if (semver.lt(local, res.data.version)) {
		logger(`Đã có phiên bản ${res.data.version} để bạn có thể cập nhật!`, "[ CHECK UPDATE ]");
		fs.writeFileSync('../.needUpdate', '');
	}
	else {
		if (fs.existsSync('../.needUpdate')) fs.removeSync('../.needUpdate');
		modules.log('Bạn đang sử dụng bản mới nhất!', "[CHECK UPDATE ]");
	}
}).catch(err => logger("Đã có lỗi xảy ra khi đang kiểm tra cập nhật cho bạn!", "[ CHECK UPDATE ]"));

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
				logger(`Không tìm thấy gói phụ trợ cho module ${command.config.name}, tiến hành cài đặt: ${command.config.dependencies.join(", ")}!`, "[ LOADER ]");
				execSync('npm install -s ' + command.config.dependencies.join(" "));
				delete require.cache[require.resolve(`../commands/${file}`)];
				logger(`Đã cài đặt thành công toàn bộ gói phụ trợ cho module ${command.config.name}`, "[ LOADER ]");
			}
		}
		client.commands.set(command.config.name, command);
		logger(`Loaded command ${command.config.name}!`, "[ LOADER ]");
	}
	catch (error) {
		return logger(`Không thể load module command ${file} với lỗi: ${error.message}`, "[ LOADER ]");
	}
}

//========= Get all event files =========//

const eventFiles = readdirSync(join(__dirname, "../events")).filter((file) => file.endsWith(".js"));
for (const file of eventFiles) {
	const event = require(join(__dirname, "../events", `${file}`));
	try {
		if (client.events.has(event)) throw new Error('Bị trùng!');
		if (!event.config || !event.run) throw new Error(`Sai format!`);
		client.events.set(event.config.name, event);
		logger(`Loaded event ${event.config.name}!`, "[ LOADER ]");
	}
	catch (error) {
		return logger(`Không thể load module event ${file} với lỗi: ${error.message}`, "[ LOADER ]");
	}
}

//========= Set variable =========//

const config = require("../config.json");
if (!config || config.length == 0) return logger("Không tìm thấy file config của bot!!", 2);

try {
	for (let [name, value] of Object.entries(config)) {
		__GLOBAL.settings[name] = value;
	}
	logger("Config Loaded!", "[ LOADER ]");
}
catch (error) {
	return logger("Không thể load config!", "[ LOADER ]");
}
//========= Set userBanned from database =========//



//========= Handle Events =========//

logger("Bot started!", "[ LISTEN ]");
logger("This source code was made by Catalizcs(roxtigger2003) and SpermLord, please do not delete this credits!");


module.exports = function({ api }) {
	return async (error, event) => {
		if (error) return logger(JSON.stringify(error), 2);

		const handleCommand = require("./handle/handleCommand")({ api, __GLOBAL, client });
		const handleReply = require("./handle/handleReply")({ api, __GLOBAL, client });
		const handleReaction = require("./handle/handleReaction")({ api, __GLOBAL, client });
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
			case "message_reaction":
				handleReaction({ event })
			default:
				break;
		}
	};
}
//THIZ BOT WAS MADE BY ME(CATALIZCS) AND MY BROTHER SPERMLORD - DO NOT STEAL MY CODE (つ ͡ ° ͜ʖ ͡° )つ ✄ ╰⋃╯