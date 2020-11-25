
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

//=========Login =========//

login({ appState: require(appStateFile) }, (error, api) => {
	console.log(error);
	//if (error) return logger(error.error, 2);
	writeFileSync(appStateFile, JSON.stringify(api.getAppState(), null, "\t"));
	api.setOptions(options);
	api.listenMqtt(require("./includes/listen")({ api }));
});

//THIZ BOT WAS MADE BY ME(CATALIZCS) AND MY BROTHER SPERMLORD - DO NOT STEAL MY CODE (つ ͡ ° ͜ʖ ͡° )つ ✄ ╰⋃╯