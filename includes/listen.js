//=========Call Variable=========//

let needReload;
const logger = require("../utils/log.js");
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const { readdirSync, accessSync, existsSync, readFileSync, writeFileSync, removeSync } = require("fs-extra");
const { join } = require("path");
const { resolve } = require("path");
const { execSync } = require('child_process');
const node_modules = '../node_modules/';
const semver = require('semver');
const axios = require("axios");

const client = new Object({
	commands: new Map(),
	events: new Map(),
	cooldowns: new Map(),
	handleReply: new Array(),
	handleReaction: new Array(),
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
		if (event.config.dependencies) {
			try {
				for (let i of event.config.dependencies) require(i);
			}
			catch (e) {
				logger(`Không tìm thấy gói phụ trợ cho module ${event.config.name}, tiến hành cài đặt: ${event.config.dependencies.join(", ")}!`, "[ LOADER ]");
				execSync('npm install -s ' + event.config.dependencies.join(" "));
				delete require.cache[require.resolve(`../event/${file}`)];
				logger(`Đã cài đặt thành công toàn bộ gói phụ trợ cho event module ${event.config.name}`, "[ LOADER ]");
			}
		}
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

module.exports = function({ api, models }) {

	(async () => {
		const thread = models.use("thread");
		const user = models.use("user");
		logger("Khởi tạo biến môi trường", "[ DATABASE ]");
		const threadBanned = (await thread.findAll({ where: { banned: true } })).map(e => e.get({ plain: true }));
		const userBanned = (await user.findAll({ where: { banned: true } })).map(e => e.get({ plain: true }));
		const threadSetting = (await thread.findAll({  })).map(e => e.get({ plain: true }));
		threadBanned.forEach(info => client.threadBanned.set(info.threadID, { reason: info.reasonban, time2unban: info.time2unban }));
		userBanned.forEach(info => client.userBanned.set(info.userID, { reason: info.reasonban, time2unban: info.time2unban }));
		threadSetting.forEach(info => client.threadSetting.set(info.threadID, (info.settings) ? info.settings : { "PREFIX": __GLOBAL.settings.PREFIX }));
		logger("Khởi tạo biến môi trường thành công!", "[ DATABASE ]");
	})();

	return async (error, event) => {
		if (error) return logger(JSON.stringify(error), 2);

		switch (event.type) {
			case "message":
			case "message_reply": 
				require("./handle/handleCommand")({ api, __GLOBAL, client, models })({ event })
				require("./handle/handleReply")({ api, __GLOBAL, client, models })({ event })
				require("./handle/handleCommandEvent")({ api, __GLOBAL, client, models })({ event })
				break;
			case "event":
				require("./handle/handleEvent")({ api, __GLOBAL, client, models })({ event })
				break;
			case "message_reaction":
				require("./handle/handleReaction")({ api, __GLOBAL, client, models })({ event })
			default:
				break;
		}
	};
}
//THIZ BOT WAS MADE BY ME(CATALIZCS) AND MY BROTHER SPERMLORD - DO NOT STEAL MY CODE (つ ͡ ° ͜ʖ ͡° )つ ✄ ╰⋃╯