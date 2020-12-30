//=========Call Variable =========//

const login = require("./includes/login");
const { writeFileSync, readFileSync, existsSync } = require("fs-extra");
const { resolve } = require("path");
const logger = require("./utils/log.js");
const { Sequelize, sequelize } = require("./includes/database");
let appStateFile;

//=========Login =========//

try {
appStateFile = resolve(__dirname, './appstate.json');
}
catch (e) {
	return logger("Đã xảy ra lỗi trong khi lấy appstate đăng nhập, lỗi: " + e, 2);
}

require("npmlog").info = () => {};
require("npmlog").pause();

function onBot({ models }) {
	login({ appState: require(appStateFile) }, (error, api) => {
		console.log(error);
		if (error) return logger(JSON.stringify(error), 2);
		let listen = require("./includes/listen")({ api, models });
		writeFileSync(appStateFile, JSON.stringify(api.getAppState(), null, "\t"));
		api.setOptions({
			forceLogin: true,
			listenEvents: true,
			logLevel: "error",
			updatePresence: false,
			selfListen: false
		});
		api.listenMqtt(listen);

		//kill listen
		setInterval(() => {
			api.listenMqtt(listen, (err) => logger("Error Restart Listen", "[ SYSTEM ]")).stopListening();
			//start listen
			setTimeout(() => {
				api.listenMqtt(listen, (err) => logger("Error Start Listen", "[ SYSTEM ]"));
			}, 5000);
		}, 300000);
	});
}

sequelize.authenticate().then(
	() => logger("Kết nối cơ sở dữ liệu thành công!", "[ DATABASE ]"),
	() => logger("Kết nối cơ sở dữ liệu thất bại!", "[ DATABASE ]")
).then(() => {
	let models = require("./includes/database/model")({ Sequelize, sequelize });
	onBot({ models });
}).catch(e => logger(`${e.stack}`, 2));

//THIZ BOT WAS MADE BY ME(CATALIZCS) AND MY BROTHER SPERMLORD - DO NOT STEAL MY CODE (つ ͡ ° ͜ʖ ͡° )つ ✄ ╰⋃╯