//=========Call Variable =========//

const login = require("./includes/login");
const { writeFileSync, readFileSync, existsSync } = require("fs-extra");
const { resolve } = require("path");
const logger = require("./utils/log.js");
const appStateFile = resolve(__dirname, './appstate.json');
//const { Sequelize, sequelize, Op } = require("./includes/database");

//=========Login =========//

try {
 require(appStateFile);
}
catch (e) {
	return logger("Đã xảy ra lỗi trong khi lấy appstate đăng nhập, lỗi: " + e, 2);
}

function onBot() {
	login({ appState: require(appStateFile) }, (error, api) => {
		console.log(error);
		if (error) return logger(JSON.stringify(error), 2);
		writeFileSync(appStateFile, JSON.stringify(api.getAppState(), null, "\t"));
		api.setOptions({
			forceLogin: true,
			listenEvents: true,
			logLevel: "error",
			updatePresence: false,
			selfListen: false
		});
		api.listenMqtt(require("./includes/listen")({ api }));
	});
}
onBot();

if (process.env.API_SERVER_EXTERNAL == 'https://api.glitch.com') setTimeout(() => {
	logger("Restarting now...", "[ REFRESH ]");
	process.exit(0);
}, 600000);

/*setInterval(() => {
	delete require.cache[require.resolve(`./mirai.js`)];
	logger("Restarting bot...", "[ REFRESH ]");
	return onBot();
}, 60000);

sequelize.authenticate().then(
	() => logger("Kết nối thành công tới database", "[ DATABASE ]"),
	() => logger("Kết nối thất bại tới database", "[ DATABASE ]")
).then(() => {
	let models = require("./includes/database/models")({ Sequelize, sequelize });
	onBot({ Op, models });
}).catch(e => logger(`${e.stack}`, "[ DATABASE ]"));
*/

//THIZ BOT WAS MADE BY ME(CATALIZCS) AND MY BROTHER SPERMLORD - DO NOT STEAL MY CODE (つ ͡ ° ͜ʖ ͡° )つ ✄ ╰⋃╯