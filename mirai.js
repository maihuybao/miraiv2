//=========Call Variable =========//

const login = require("./includes/login");
const { writeFileSync } = require("fs");
const { join, resolve } = require("path");
const appStateFile = resolve(__dirname, './appstate.json');
const logger = require("./utils/log.js");
const options = {
	forceLogin: true,
	listenEvents: true,
	logLevel: "error",
	updatePresence: false,
	selfListen: false,
	userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36",
}

//=========Login =========//

//if (!appStateFile || appStateFile.length == 0) return logger("Hiện tại bạn chưa có appstate để để khởi động bot!", "[ SYSTEM ]");

login({ appState: require(appStateFile) }, (error, api) => {
	if (error) return logger(error, 2);
	writeFileSync(appStateFile, JSON.stringify(api.getAppState(), null, "\t"));
	api.setOptions(options);
	api.listenMqtt(require("./listen")({ api }));
});
//THIZ BOT WAS MADE BY ME(CATALIZCS) DO NOT STEAL MY CODE (つ ͡ ° ͜ʖ ͡° )つ ✄ ╰⋃╯