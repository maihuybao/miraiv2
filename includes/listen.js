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
const semver = require('semver');
const axios = require("axios");
/*const threadInfo = require('./../models/threadInfo');
const userInfo = require('./../models/userInfo');
const mongoose = require('mongoose');
*/

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
		logger(`Không thể load module command ${file} với lỗi: ${error.message}`, "[ LOADER ]");
	}
}

if (needReload >= 1) {
	try {
		logger("Tiến hành restart bot để có thể áp dụng các gói bổ trợ mới!", "[ LOADER ]");
		if (process.env.API_SERVER_EXTERNAL == 'https://api.glitch.com') return process.exit(1);
		else return exec("pm2 reload 0");
	}
	catch (e) {
		return logger("Đã xảy ra lỗi khi đang thực hiện restart cho bạn, buộc bạn phải restart bằng tay!", "[ LOADER ]");
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
		logger(`Không thể load module event ${file} với lỗi: ${error.message}`, "[ LOADER ]");
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

/*try {
	mongoose.set('useFindAndModify', false);
	if (!__GLOBAL.settings.MONGODB_URL) throw new Error("Địa chỉ kết nối tới database không được để trống");
	
	mongoose.connect(__GLOBAL.settings.MONGODB_URL, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
		autoIndex: false,
		poolSize: 5,
		connectTimeoutMS: 10000,
		family: 4
	});
	mongoose.connection.on("connected", () => {
		logger("Kết nối thành công tới database!", "[ DATABASE ]");
		client.hasConnectedToDB.set(true);
		
	});
	mongoose.connection.on("err", err => {
		logger(`Đã xảy ra sự cố khi kết nối tới database: \n ${err.stack}`, "[ DATABASE ]");
		client.hasConnectedToDB.set(false);
	});
	if (client.hasConnectedToDB.has(true)) {
		(async () => {
			try {
				logger("Khởi tạo các biến môi trường!", "[ DATABASE ]");
				const threadBanned = await threadInfo.find({ banned: true });
				const userBanned = await userInfo.find({ banned: true });
				const threadSettings = await threadInfo.find({ enableCustom: true });
				threadBanned.forEach((result) => client.threadBanned.set(result.threadID, (result.time2unban) ? result.time2unban : ''));
				userBanned.forEach((result) => client.userBanned.set(result.userID, (result.time2unban) ? result.time2unban : ''));
				threadSettings.forEach((result) => client.threadSetting.set(result.threadID, (result.otherInfo) ? result.otherInfo : ''));
				logger("khởi tạo các biến môi trường thành công!", "[ DATABASE ]");
			}
			catch (e) {
				logger("Không thể khởi tạo các biến môi trường, Lỗi: " + e, "[ DATABASE ]");
			}
		})();
	}
}
catch (error) {
	logger(`Không thể kết nối tới database, lỗi: ${error}!`, "[ DATABASE ]");
}
*/

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