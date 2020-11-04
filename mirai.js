
//=========Call Variable =========//

const login = require("./includes/login");
const { writeFileSync, existsSync } = require("fs");
const { resolve } = require("path");
const logger = require("./utils/log.js");
const appStateFile = resolve(__dirname, './appstate.json');
const options = {
	forceLogin: true,
	listenEvents: true,
	logLevel: "error",
	updatePresence: false,
	selfListen: false,
	userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36",
}

//=========Login =========//

login({ appState: require(appStateFile) }, (error, api) => {
	if (error) return logger(error, 2);
	writeFileSync(appStateFile, JSON.stringify(api.getAppState(), null, "\t"));
	api.setOptions(options);
	api.listenMqtt(require("./listen")({ api }));
});


//THIZ BOT WAS MADE BY ME(CATALIZCS) AND MY BROTHER SPERMLORD - DO NOT STEAL MY CODE (つ ͡ ° ͜ʖ ͡° )つ ✄ ╰⋃╯