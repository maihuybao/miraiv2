//=========Call Variable =========//

const { readdirSync, readFileSync, writeFileSync, existsSync, copySync } = require("fs-extra");
const { join, resolve } = require("path");
const { execSync } = require('child_process');
const semver = require('semver');
const axios = require("axios");
const logger = require("./utils/log.js");
const { Sequelize, sequelize } = require("./includes/database");
const login = require("fca-unofficial");
let appStateFile;

const client = new Object({
	commands: new Map(),
	events: new Map(),
	cooldowns: new Map(),
	handleReply: new Array(),
	handleReaction: new Array(),
	userBanned: new Map(),
	threadBanned: new Map(),
	threadSetting: new Map(),
	globalConfig: ""
});

const __GLOBAL = new Object({
	settings: new Array()
})

//check argv

let argv = process.argv.slice(2);

if (argv.length !== 0) client.globalConfig = argv[0];
else client.globalConfig = "config.json";

if (!existsSync(`./${client.globalConfig}`)) return logger("Không tìm thấy file config của bot!", 2);


//set config to __GLOBAL

 let config = require(`./${client.globalConfig}`);
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

//=========Login =========//

try {
	appStateFile = resolve(__dirname, `./${config.APPSTATEPATH}`);
}
catch (e) {
	return logger("Đã xảy ra lỗi trong khi lấy appstate đăng nhập, lỗi: " + e, 2);
}

require("npmlog").emitLog = () => {};

if (existsSync(resolve('./includes', 'skeleton_data.sqlite')) && !existsSync(resolve('./includes', 'data.sqlite'))) copySync(resolve('./includes', 'skeleton_data.sqlite'), resolve('./includes', 'data.sqlite'));

axios.get('https://raw.githubusercontent.com/catalizcs/miraiv2/master/package.json').then((res) => {
	logger("Đang kiểm tra cập nhật...", "[ CHECK UPDATE ]");
	var local = JSON.parse(readFileSync('./package.json')).version;
	if (semver.lt(local, res.data.version)) logger(`Đã có phiên bản ${res.data.version} để bạn có thể cập nhật!`, "[ CHECK UPDATE ]");
	else logger('Bạn đang sử dụng bản mới nhất!', "[CHECK UPDATE ]");
}).catch(err => logger("Đã có lỗi xảy ra khi đang kiểm tra cập nhật cho bạn!", "[ CHECK UPDATE ]"));

//========= Get all command files =========//

const commandFiles = readdirSync(join(__dirname, "/modules/commands")).filter((file) => file.endsWith(".js") && !file.includes('example'));
for (const file of commandFiles) {
	var command = require(join(__dirname, "/modules/commands", `${file}`));
	try {
		if (!command.config || !command.run || !command.config.commandCategory) throw new Error(`Sai format!`);
		if (client.commands.has(command.config.name)) throw new Error('Bị trùng!');
		if (command.config.dependencies) {
			try {
				for (const i of command.config.dependencies) require.resolve(i);
			}
			catch (e) {
				logger(`Không tìm thấy gói phụ trợ cho module ${command.config.name}, tiến hành cài đặt: ${command.config.dependencies.join(", ")}!`, "[ LOADER ]");
				execSync('npm install -s ' + command.config.dependencies.join(" "));
				delete require.cache[require.resolve(`./modules/commands/${file}`)];
				logger(`Đã cài đặt thành công toàn bộ gói phụ trợ cho module ${command.config.name}`, "[ LOADER ]");
			}
		}
        if (command.config.envConfig) {
            try {
                for (const [key, value] of Object.entries(command.config.envConfig)) {
                    if (typeof __GLOBAL[command.config.name] == "undefined") __GLOBAL[command.config.name] = new Object();
                    if (typeof config[command.config.name] == "undefined") config[command.config.name] = new Object();
                    if (typeof config[command.config.name][key] !== "undefined") __GLOBAL[command.config.name][key] = config[command.config.name][key]
                    else __GLOBAL[command.config.name][key] = value || "";
                    if (typeof config[command.config.name][key] == "undefined") config[command.config.name][key] = value || "";
                }
                logger(`Loaded config module ${command.config.name}`, "[ LOADER ]")
            } catch (error) {
                console.log(error);
                logger(`Không thể tải config module ${command.config.name}`, "[ LOADER ]");
            }
        }
		client.commands.set(command.config.name, command);
		logger(`Loaded command ${command.config.name}!`, "[ LOADER ]");
	}
	catch (error) {
		logger(`Không thể load module command ${file} với lỗi: ${error.message}`, "[ LOADER ]");
	}
}

//========= Get all event files =========//

const eventFiles = readdirSync(join(__dirname, "/modules/events")).filter((file) => file.endsWith(".js"));
for (const file of eventFiles) {
	var event = require(join(__dirname, "/modules/events", `${file}`));
	try {
		if (!event.config || !event.run) throw new Error(`Sai format!`);
		if (client.events.has(event.config.name)) throw new Error('Bị trùng!');
		if (event.config.dependencies) {
			try {
				for (let i of event.config.dependencies) require.resolve(i);
			}
			catch (e) {
				logger(`Không tìm thấy gói phụ trợ cho module ${event.config.name}, tiến hành cài đặt: ${event.config.dependencies.join(", ")}!`, "[ LOADER ]");
				execSync('npm install -s ' + event.config.dependencies.join(" "));
				delete require.cache[require.resolve(`./modules/events/${file}`)];
				logger(`Đã cài đặt thành công toàn bộ gói phụ trợ cho event module ${event.config.name}`, "[ LOADER ]");
			}
		}
        if (event.config.envConfig) {
            try {
                for (const [key, value] of Object.entries(event.config.envConfig)) {
                    if (typeof __GLOBAL[event.config.name] == "undefined") __GLOBAL[event.config.name] = new Object();
                    if (typeof config[event.config.name] == "undefined") config[event.config.name] = new Object();
                    if (typeof config[event.config.name][key] !== "undefined") __GLOBAL[event.config.name][key] = config[event.config.name][key]
                    else __GLOBAL[event.config.name][key] = value || "";
                    if (typeof config[event.config.name][key] == "undefined") config[event.config.name][key] = value || "";
                }
                logger(`Loaded config event module ${event.config.name}`, "[ LOADER ]")
            } catch (error) {
                logger(`Không thể tải config event module ${event.config.name}`, "[ LOADER ]");
            }
        }
		client.events.set(event.config.name, event);
		logger(`Loaded event ${event.config.name}!`, "[ LOADER ]");
	}
	catch (error) {
		logger(`Không thể load module event ${file} với lỗi: ${error.message}`, "[ LOADER ]");
	}
}

logger(`Load thành công: ${client.commands.size} module commands | ${client.events.size} module events`, "[ LOADER ]")
writeFileSync(client.globalConfig, JSON.stringify(config, null, 4));

execSync('npm cache clean --force');
logger("Npm cache cleaned!", "[ LOADER ]");

function onBot({ models }) {
	login({ appState: require(appStateFile) }, (err, api) => {
		if (err) return logger(JSON.stringify(err));

		let listen = require("./includes/listen")({ api, models, client, __GLOBAL });
		let onListen = () => api.listenMqtt(listen);

		writeFileSync(appStateFile, JSON.stringify(api.getAppState(), null, "\t"));
		api.setOptions({
			forceLogin: true,
			listenEvents: true,
			logLevel: "silent",
			selfListen: false
		});
		try {
			onListen();
			setInterval(() => {
				api.listenMqtt().stopListening();
				setTimeout(() => onListen(), 2000);
				if (__GLOBAL.settings.DeveloperMode == true) {
					const moment = require("moment");
					var time = moment.tz("Asia/Ho_Chi_minh").format("HH:MM:ss L");
					logger(`[ ${time} ] Listen restarted`, "[ DEV MODE ]");
				}
			}, 1800000);
		}
		catch(e) {
			logger(`${e.name}: ${e.message}`, "[ LISTEN ]")
		}
	});
}

(async () => {
	let migrations = readdirSync(`./includes/database/migrations`);
	let completedMigrations = await sequelize.query("SELECT * FROM `SequelizeMeta`", { type: Sequelize.QueryTypes.SELECT });
	for (let name in completedMigrations) {
		if (completedMigrations.hasOwnProperty(name)) {
			let index = migrations.indexOf(completedMigrations[name].name);
			if (index !== -1) migrations.splice(index, 1);
		}
	}

	for (let i = 0, c = migrations.length; i < c; i++) {
		let migration = require(`./includes/database/migrations/` + migrations[i]);
		migration.up(sequelize.queryInterface, Sequelize);
		await sequelize.query("INSERT INTO `SequelizeMeta` VALUES(:name)", { type: Sequelize.QueryTypes.INSERT, replacements: { name: migrations[i] } });
	}
})();

sequelize.authenticate().then(
	() => logger("Kết nối cơ sở dữ liệu thành công!", "[ DATABASE ]"),
	() => logger("Kết nối cơ sở dữ liệu thất bại!", "[ DATABASE ]")
).then(() => {
	let models = require("./includes/database/model")({ Sequelize, sequelize });
	onBot({ models });
}).catch(e => logger(`${e.stack}`, 2));

//THIZ BOT WAS MADE BY ME(CATALIZCS) AND MY BROTHER SPERMLORD - DO NOT STEAL MY CODE (つ ͡ ° ͜ʖ ͡° )つ ✄ ╰⋃╯