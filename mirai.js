
//=========Call Variable =========//

require('npmlog').info = () => {};
const login = require("./includes/login");
const { writeFileSync, readFileSync, existsSync } = require("fs");
const { resolve } = require("path");
const logger = require("./utils/log.js");
const appStateFile = resolve(__dirname, './appstate.json');
const __GLOBAL = new Object({
	systemEvent: new Array(),
	settings: new Array()
});
const options = {
	forceLogin: true,
	listenEvents: true,
	logLevel: "error",
	updatePresence: false,
	selfListen: false,
	userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36"
}

const config = require("./config.json");
if (!config || config.length == 0) 
__GLOBAL.settings.email = config.EMAIL;
__GLOBAL.settings.password = config.PASSWORD;
__GLOBAL.settings.otpKey = config.OTPKEY.replace(/\s+/g, '').toLowerCase();
__GLOBAL.settings.PREFIX = config.PREFIX;
__GLOBAL.settings.BOTNAME = config.BOTNAME;
__GLOBAL.settings.ADMINBOT = config.ADMINBOT.split(' ').map(e => parseInt(e));
__GLOBAL.settings.SAUCENAO_API = config.SAUCENAO_API;
__GLOBAL.settings.YOUTUBE_API = config.YOUTUBE_API;
__GLOBAL.settings.SOUNDCLOUD_API = config.SOUNDCLOUD_API;
__GLOBAL.settings.OPEN_WEATHER = config.OPEN_WEATHER;

if (!existsSync("./appstate.json")) {
	writeFileSync('./appstate.json', '[]');
	logger("Không tìm thấy appstate, tạo file appstate mới!", 2);
}

//=========Login =========//

login({ appState: require(appStateFile) }, (error, api) => {
	if (error) return logger(error, 2);
	writeFileSync(appStateFile, JSON.stringify(api.getAppState(), null, "\t"));
	api.setOptions(options);
	api.listenMqtt(require("./includes/listen")({ api, __GLOBAL }));
});

//THIZ BOT WAS MADE BY ME(CATALIZCS) AND MY BROTHER SPERMLORD - DO NOT STEAL MY CODE (つ ͡ ° ͜ʖ ͡° )つ ✄ ╰⋃╯