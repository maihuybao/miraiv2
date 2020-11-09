
//=========Call Variable =========//

const login = require("./includes/login");
const { writeFileSync, readFileSync, existsSync } = require("fs");
const { resolve } = require("path");
const logger = require("./utils/log.js");
//const appStateFile = resolve(__dirname, './appstate.json');
const __GLOBAL = new Object({
	systemEvent: new Array()
});
const options = {
	forceLogin: true,
	listenEvents: true,
	logLevel: "error",
	updatePresence: false,
	selfListen: false,
	userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36",
}

let email, pasword, appState, otpKey;
try {
	const config = require("./config.json");
	email = config.EMAIL;
	password = config.PASSWORD;
	otpKey = config.OTPKEY.replace(/\s+/g, '').toLowerCase();
} catch (error) {
	email = process.env.EMAIL;
	password = process.env.PASSWORD;
	otpKey = process.env.OTPKEY.replace(/\s+/g, '').toLowerCase();
}

if (!existsSync("./appstate.json")) {
	writeFileSync('./appstate.json', '[]');
	logger("Không tìm thấy appstate, tạo file appstate mới!", 2);
}

//=========Login =========//

login({ email, password, otpKey }, (error, api) => {
	require('npmlog').info = () => {};
	if (error) return logger(error, 2);
	if (api == undefined) { 
		logger("Không thể đăng nhập", 2);
		process.exit(1);
	}
	writeFileSync("./appstate.json", JSON.stringify(api.getAppState()));
	api.setOptions(options);
	api.listenMqtt(require("./listen")({ api, __GLOBAL }));
});


//THIZ BOT WAS MADE BY ME(CATALIZCS) AND MY BROTHER SPERMLORD - DO NOT STEAL MY CODE (つ ͡ ° ͜ʖ ͡° )つ ✄ ╰⋃╯