//=========Call Variable =========//

const { readdirSync, readFileSync, writeFileSync, existsSync, copySync, unlinkSync } = require("fs-extra");
const { join, resolve } = require("path");
const { execSync } = require('child_process');
const logger = require("./utils/log.js");
const login = require("fca-unofficial");
const timeStart = Date.now();

const client = new Object({
	commands: new Map(),
	events: new Map(),
	cooldowns: new Map(),
	handleReply: new Array(),
	handleReaction: new Array(),
	userBanned: new Map(),
	threadBanned: new Map(),
	threadSetting: new Map(),
	threadInfo: new Map(),
	commandRegister: new Map(),
	dirConfig: "",
	dirMain: process.cwd()
});

const __GLOBAL = new Object({
	settings: new Array()
})

//check argv

var argv = require('minimist')(process.argv.slice(2));
var configValue;

if (argv["_"].length != 0) client.dirConfig = join(client.dirMain, argv["_"][0]);
else client.dirConfig = join(client.dirMain, "config.json");

try {
	configValue = require(client.dirConfig);
	logger.loader(`Đã tìm thấy file config: ${argv["_"][0] || "config.json"}`);
}
catch {
	if (existsSync(client.dirConfig + ".temp")) {
		configValue = require(client.dirConfig + ".temp");
		logger.loader(`Đã tìm thấy file config: ${argv["_"][0] || "config.json"}`);
	}
	else logger.loader(`Không tìm thấy file config: ${argv["_"][0] || "config.json"}`, "error");
}

try {
	for (const [name, value] of Object.entries(configValue)) {
		__GLOBAL.settings[name] = value;
	}
	logger.loader("Config Loaded!");
}
catch {
	return logger.loader("Không thể load config!", "error");
}

writeFileSync(client.dirConfig + ".temp", JSON.stringify(configValue, null, 4), 'utf8');

//require("npmlog").emitLog = () => {};

if (existsSync(resolve('./includes', 'skeleton_data.sqlite')) && !existsSync(resolve('./includes', 'data.sqlite'))) copySync(resolve('./includes', 'skeleton_data.sqlite'), resolve('./includes', 'data.sqlite'));

const semver = require('semver');
const axios = require("axios");
axios.get('https://raw.githubusercontent.com/catalizcs/miraiv2/master/package.json').then((res) => {
	logger("Đang kiểm tra cập nhật...", "[ CHECK UPDATE ]");
	var local = JSON.parse(readFileSync('./package.json')).version;
	if (semver.lt(local, res.data.version)) logger(`Đã có phiên bản ${res.data.version} để bạn có thể cập nhật!`, "[ CHECK UPDATE ]");
	else logger('Bạn đang sử dụng bản mới nhất!', "[ CHECK UPDATE ]");
}).catch(err => logger("Đã có lỗi xảy ra khi đang kiểm tra cập nhật cho bạn!", "[ CHECK UPDATE ]"));

//========= Get all command files =========//

const commandFiles = readdirSync(join(__dirname, "/modules/commands")).filter((file) => file.endsWith(".js") && !file.includes('example'));
for (const file of commandFiles) {
	try {
		var command = require(join(__dirname, "/modules/commands", `${file}`));
	}
	catch(e) {
		logger.loader(`Không thể load module: ${file} với lỗi: ${e.name} - ${e.message}`, "error")
	}
	
	try {
		if (!command.config || !command.run || !command.config.commandCategory) throw new Error(`Module không đúng định dạng!`);
		if (client.commands.has(command.config.name)) throw new Error(`Tên module bị trùng với một module mang cùng tên khác!`);
		if (command.config.dependencies) {
			try {
				for (const i of command.config.dependencies) require.resolve(i);
			}
			catch (e) {
				logger.loader(`Không tìm thấy gói phụ trợ cho module ${command.config.name}, tiến hành cài đặt: ${command.config.dependencies.join(", ")}!`, "warm");
				execSync('npm install -s ' + command.config.dependencies.join(" "));
				delete require.cache[require.resolve(`./modules/commands/${file}`)];
				logger.loader(`Đã cài đặt thành công toàn bộ gói phụ trợ cho module ${command.config.name}`);
			}
		}
        if (command.config.envConfig) {
            try {
                for (const [key, value] of Object.entries(command.config.envConfig)) {
                    if (typeof __GLOBAL[command.config.name] == "undefined") __GLOBAL[command.config.name] = new Object();
                    if (typeof configValue[command.config.name] == "undefined") configValue[command.config.name] = new Object();
                    if (typeof configValue[command.config.name][key] !== "undefined") __GLOBAL[command.config.name][key] = configValue[command.config.name][key]
                    else __GLOBAL[command.config.name][key] = value || "";
                    if (typeof configValue[command.config.name][key] == "undefined") configValue[command.config.name][key] = value || "";
                }
                logger.loader(`Loaded config module ${command.config.name}`)
            } catch (error) {
                console.log(error);
                logger.loader(`Không thể tải config module ${command.config.name}`, "error");
            }
        }
		if (command.onLoad) 
			try {
				command.onLoad({ __GLOBAL, client, configValue });
			
			}
			catch (error) {
				logger.loader(`Không thể onLoad module: ${command} với lỗi: ${error.name} - ${error.message}`, "error");
			}
		if (command.event) {
			var registerCommand = client.commandRegister.get("event") || [];
			registerCommand.push(command.config.name);
			client.commandRegister.set("event", registerCommand);
		}
		client.commands.set(command.config.name, command);
		logger.loader(`Loaded command ${command.config.name}!`);
	}
	catch (error) {
		logger.loader(`Không thể load module command ${file} với lỗi: ${error.message}`, "error");
	}
}

//========= Get all event files =========//

const eventFiles = readdirSync(join(__dirname, "/modules/events")).filter((file) => file.endsWith(".js"));
for (const file of eventFiles) {
	try {
		var event = require(join(__dirname, "/modules/events", `${file}`));
	}
	catch(e) {
		logger.loader(`Không thể load module: ${file} với lỗi: ${e.name} - ${e.message}`, "error")
	}

	try {
		if (!event.config || !event.run) throw new Error(`Sai format!`);
		if (client.events.has(event.config.name)) throw new Error('Bị trùng!');
		if (event.config.dependencies) {
			try {
				for (let i of event.config.dependencies) require.resolve(i);
			}
			catch (e) {
				logger.loader(`Không tìm thấy gói phụ trợ cho module ${event.config.name}, tiến hành cài đặt: ${event.config.dependencies.join(", ")}!`, "warm");
				execSync('npm install -s ' + event.config.dependencies.join(" "));
				delete require.cache[require.resolve(`./modules/events/${file}`)];
				logger.loader(`Đã cài đặt thành công toàn bộ gói phụ trợ cho event module ${event.config.name}`);
			}
		}
        if (event.config.envConfig) {
            try {
                for (const [key, value] of Object.entries(event.config.envConfig)) {
                    if (typeof __GLOBAL[event.config.name] == "undefined") __GLOBAL[event.config.name] = new Object();
                    if (typeof configValue[event.config.name] == "undefined") configValue[event.config.name] = new Object();
                    if (typeof configValue[event.config.name][key] !== "undefined") __GLOBAL[event.config.name][key] = config[event.config.name][key]
                    else __GLOBAL[event.config.name][key] = value || "";
                    if (typeof configValue[event.config.name][key] == "undefined") configValue[event.config.name][key] = value || "";
                }
                logger.loader(`Loaded config event module ${event.config.name}`)
            } catch (error) {
                logger.loader(`Không thể tải config event module ${event.config.name}`, "error");
            }
        }
		if (event.onLoad) try {
			event.onLoad({ __GLOBAL, client, configValue });
		}
		catch (error) {
			logger.loader(`Không thể chạy setup module: ${event} với lỗi: ${error.name} - ${error.message}`, "error");
		}
		client.events.set(event.config.name, event);
		logger.loader(`Loaded event ${event.config.name}!`);
	}
	catch (error) {
		logger.loader(`Không thể load module event ${file} với lỗi: ${error.message}`, "error");
	}
}

logger.loader(`Load thành công: ${client.commands.size} module commands | ${client.events.size} module events`);
writeFileSync(client.dirConfig, JSON.stringify(configValue, null, 4), 'utf8');
unlinkSync(client.dirConfig + ".temp");

try {
	var appStateFile = resolve(join(client.dirMain, __GLOBAL.settings["APPSTATEPATH"]));
}
catch (e) {
	return logger("Đã xảy ra lỗi trong khi lấy appstate đăng nhập, lỗi: " + e, "error");
}

function onBot({ models }) {
	login({ appState: require(appStateFile) }, (err, api) => {
		if (err) return logger(JSON.stringify(err), "error");
		const handleListen = require("./includes/listen")({ api, models, client, __GLOBAL, timeStart });

		api.setOptions({
			forceLogin: true,
			listenEvents: true,
			logLevel: "silent",
			selfListen: false,
			userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36"
		});
		writeFileSync(appStateFile, JSON.stringify(api.getAppState(), null, "\t"));

		try {
			api.listenMqtt(handleListen);
			setInterval(() => {
				api.listenMqtt().stopListening();
				setTimeout(() => api.listenMqtt(handleListen), 2000);
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

const { Sequelize, sequelize } = require("./includes/database");

(async () => {
	var migrations = readdirSync(`./includes/database/migrations`);
	var completedMigrations = await sequelize.query("SELECT * FROM `SequelizeMeta`", { type: Sequelize.QueryTypes.SELECT });
	for (const name in completedMigrations) {
		if (completedMigrations.hasOwnProperty(name)) {
			const index = migrations.indexOf(completedMigrations[name].name);
			if (index !== -1) migrations.splice(index, 1);
		}
	}

	for (const migration of migrations) {
		var migrationRequire = require(`./includes/database/migrations/` + migration);
		migrationRequire.up(sequelize.queryInterface, Sequelize);
		await sequelize.query("INSERT INTO `SequelizeMeta` VALUES(:name)", { type: Sequelize.QueryTypes.INSERT, replacements: { name: migration } });
	}

	try {
		await sequelize.authenticate();
		logger("Kết nối cơ sở dữ liệu thành công", "[ DATABASE ]")
		const models = require("./includes/database/model");
		onBot({ models });
	}
	catch (error) {
		() => logger(`Kết nối cơ sở dữ liệu thất bại, Lỗi: ${error.name}: ${error.message}`, "[ DATABASE ]");
	}
})();

//THIZ BOT WAS MADE BY ME(CATALIZCS) AND MY BROTHER SPERMLORD - DO NOT STEAL MY CODE (つ ͡ ° ͜ʖ ͡° )つ ✄ ╰⋃╯