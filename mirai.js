//////////////////////////////////////////////////////
//========= Require all variable need use =========//
/////////////////////////////////////////////////////

const { readdirSync, readFileSync, writeFileSync, existsSync, copySync, unlinkSync } = require("fs-extra");
const { join, resolve } = require("path");
const { execSync } = require('child_process');
const logger = require("./utils/log.js");
const login = require("fca-unofficial");
const timeStart = Date.now();
const semver = require('semver');
const axios = require("axios");

const client = {
	commands: new Map(),
	events: new Map(),
	event: new Map(),
	schedule: [],
	allUser: [],
	allThread: [],
	handleReply: [],
	handleReaction: [],
	cooldowns: new Map(),
	userBanned: new Map(),
	nameUser: new Map(),
	threadBanned: new Map(),
	threadSetting: new Map(),
	commandBanned: new Map(),
	threadInfo: new Map(),
	commandRegister: new Map(),
	inProcess: false,
	dirConfig: "",
	dirMain: process.cwd(),
	timeLoadModule: ""
},
global = {
	config: []
};

//////////////////////////////////////////////////////////
//========= Find and get variable from Config =========//
/////////////////////////////////////////////////////////

const argv = require('minimist')(process.argv.slice(2)); 
var configValue;

var indexConfig = argv._.findIndex(function (element)  {  return element.indexOf(".json") !== -1;  }) || 0;
if (argv._.length != 0) client.dirConfig = join(client.dirMain, argv._[indexConfig]);
else client.dirConfig = join(client.dirMain, "config.json");
try {
	configValue = require(client.dirConfig);
	logger.loader(`Đã tìm thấy file config: ${argv._[indexConfig] || "config.json"}`);
}
catch {
	if (existsSync(client.dirConfig.replace(/\.json/g,"") + ".temp")) {
		configValue = readFileSync(client.dirConfig.replace(/\.json/g,"") + ".temp");
		configValue = JSON.parse(configValue);
		logger.loader(`Đã tìm thấy file config: ${client.dirConfig.replace(/\.json/g,"") + ".temp"}`);
	}
	else logger.loader(`Không tìm thấy file config: ${argv._.findIndex[indexConfig] || "config.json"}`, "error");
}

try {
	for (const [name, value] of Object.entries(configValue)) {
		global.config[name] = value;
	}
	logger.loader("Config Loaded!");
}
catch {
	return logger.loader("Không thể load config!", "error");
}

writeFileSync(client.dirConfig + ".temp", JSON.stringify(configValue, null, 4), 'utf8');

////////////////////////////////////////////////
//========= Check update from Github =========//
///////////////////////////////////////////////

axios.get('https://raw.githubusercontent.com/catalizcs/miraiv2/master/package.json').then((res) => {
	logger("Đang kiểm tra cập nhật...", "[ CHECK UPDATE ]");
	const local = JSON.parse(readFileSync('./package.json')).version;
	if (semver.lt(local, res.data.version)) logger(`Đã có phiên bản ${res.data.version} để bạn có thể cập nhật!`, "[ CHECK UPDATE ]");
	else logger('Bạn đang sử dụng bản mới nhất!', "[ CHECK UPDATE ]");
}).catch(err => logger("Đã có lỗi xảy ra khi đang kiểm tra cập nhật cho bạn!", "[ CHECK UPDATE ]"));

const commandFiles = readdirSync(client.dirMain + "/modules/commands").filter((file) => file.endsWith(".js") && !file.includes('example') && !global.config.commandDisabled.includes(file));

////////////////////////////////////////////////
//========= Import command to GLOBAL =========//
////////////////////////////////////////////////

for (const file of commandFiles) {
	const timeStartLoad = Date.now();
	try {
		var command = require(client.dirMain + "/modules/commands/" + file);
	}
	catch(e) {
		logger.loader(`Không thể load module: ${file} với lỗi: ${e.name} - ${e.message}`, "error");
	}
	
	try {
		if (!command.config || !command.run || !command.config.commandCategory) throw new Error(`Module không đúng định dạng!`);
		if (client.commands.has(command.config.name || "")) throw new Error(`Tên module bị trùng với một module mang cùng tên khác!`);
		const nameModule = command.config.name;
		if (command.config.dependencies) {
			try {
				for (const i of command.config.dependencies) require.resolve(i);
			}
			catch (e) {
				logger.loader(`Không tìm thấy gói phụ trợ cho module ${nameModule}, tiến hành cài đặt: ${command.config.dependencies.join(", ")}!`, "warm");
				execSync('npm install -s --prefer-offline --no-audit --package-lock false ' + command.config.dependencies.join(" "));
				delete require.cache[require.resolve(client.dirMain + "/modules/commands/" + file)];
				logger.loader(`Đã cài đặt thành công toàn bộ gói phụ trợ cho module ${nameModule}`);
			}
		}
		
		if (command.config.envConfig) {
			try {
				for (const [key, value] of Object.entries(command.config.envConfig)) {
					if (typeof global[nameModule] == "undefined") global[nameModule] = {};
					if (typeof configValue[nameModule] == "undefined") configValue[nameModule] = {};
					if (typeof configValue[nameModule][key] !== "undefined") global[nameModule][key] = configValue[nameModule][key];
					else global[nameModule][key] = value || "";
					if (typeof configValue[nameModule][key] == "undefined") configValue[nameModule][key] = value || "";
				}
				logger.loader(`Loaded config module ${nameModule}`);
			} catch (error) {
				console.log(error);
				logger.loader(`Không thể tải config module ${nameModule}`, "error");
			}
		}

		if (command.onLoad) {
			try {
				command.onLoad({ global, client, configValue });
			}
			catch (error) {
				logger.loader(`Không thể onLoad module: ${nameModule} với lỗi: ${error.name} - ${error.message}`, "error");
			}
		}

		if (command.event) {
			var registerCommand = client.commandRegister.get("event") || [];
			registerCommand.push(nameModule);
			client.commandRegister.set("event", registerCommand);
		}
		client.commands.set(command.config.name, command);
		logger.loader(`Loaded command ${nameModule}!`);
	}
	catch (error) {
		logger.loader(`Không thể load module command ${file} với lỗi: ${error.message}`, "error");
	}
	(Date.now() - timeStartLoad > 5) ? client.timeLoadModule += `${command.config.name} - ${Date.now() - timeStartLoad}ms\n` : "";
}

const eventFiles = readdirSync(client.dirMain + "/modules/events").filter((file) => file.endsWith(".js") && !global.config.eventDisabled.includes(file));

//////////////////////////////////////////////
//========= Import event to GLOBAL =========//
//////////////////////////////////////////////

for (const file of eventFiles) {
	const timeStartLoad = Date.now();
	try {
		var event = require(client.dirMain + "/modules/events/" + file);
	}
	catch(e) {
		logger.loader(`Không thể load module: ${file} với lỗi: ${e.name} - ${e.message}`, "error");
	}

	try {
		if (!event.config || !event.run) throw new Error(`Module không đúng định dạng!`);
		if (client.events.has(event.config.name) || "") throw new Error('Tên module bị trùng với một module mang cùng tên khác!');
		const nameModule = event.config.name;
		if (event.config.dependencies) {
			try {
				for (const i of event.config.dependencies) require.resolve(i);
			}
			catch (e) {
				logger.loader(`Không tìm thấy gói phụ trợ cho module ${nameModule}, tiến hành cài đặt: ${event.config.dependencies.join(", ")}!`, "warm");
				execSync('npm install -s --prefer-offline --no-audit --package-lock false ' + event.config.dependencies.join(" "));
				delete require.cache[require.resolve(client.dirMain + "/modules/events/" + file)];
				logger.loader(`Đã cài đặt thành công toàn bộ gói phụ trợ cho event module ${nameModule}`);
			}
		}
		if (event.config.envConfig) {
			try {
				for (const [key, value] of Object.entries(event.config.envConfig)) {
					if (typeof global[nameModule] == "undefined") global[nameModule] = {};
					if (typeof configValue[nameModule] == "undefined") configValue[nameModule] = {};
					if (typeof configValue[nameModule][key] !== "undefined") global[nameModule][key] = configValue[nameModule][key];
					else global[nameModule][key] = value || "";
					if (typeof configValue[nameModule][key] == "undefined") configValue[nameModule][key] = value || "";
				}
				logger.loader(`Loaded config event module ${nameModule}`);
			} catch (error) {
				logger.loader(`Không thể tải config event module ${nameModule}`, "error");
			}
		}

		if (event.onLoad) {
			try {
				event.onLoad({ global, client, configValue });
			}
			catch (error) {
				logger.loader(`Không thể onLoad module: ${nameModule} với lỗi: ${error.name} - ${error.message}`, "error");
			}
		}

		client.events.set(nameModule, event);
		logger.loader(`Loaded event ${nameModule}!`);
	}
	catch (error) {
		logger.loader(`Không thể load module event ${file} với lỗi: ${error.message}`, "error");
	}
	(Date.now() - timeStartLoad > 5) ? client.timeLoadModule += `${event.config.name} - ${Date.now() - timeStartLoad}ms\n` : "";
}

logger.loader(`Load thành công: ${client.commands.size} module commands | ${client.events.size} module events`);
if (global.config.DeveloperMode == true && client.timeLoadModule.length != 0) logger.loader(client.timeLoadModule, "warn");
writeFileSync(client.dirConfig, JSON.stringify(configValue, null, 4), 'utf8');
unlinkSync(client.dirConfig + ".temp");

logger.loader(`=== ${Date.now() - timeStart}ms ===`);

try {
	var appStateFile = resolve(join(client.dirMain, global.config.APPSTATEPATH || "appstate.json"));
	var appState = require(appStateFile);
}
catch (e) {
	return logger("Đã xảy ra lỗi trong khi lấy appstate đăng nhập, lỗi: " + e, "error");
}

function onBot({ models }) {
	login({ appState }, (error, api) => {
		if (error) return logger(JSON.stringify(error), "error");

		api.setOptions({
			forceLogin: true,
			listenEvents: true,
			logLevel: "error",
			selfListen: global.config.selfListen || false,
			userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.72 Safari/537.36"
		});

		writeFileSync(appStateFile, JSON.stringify(api.getAppState(), null, "\t"));

		const handleListen = require("./includes/listen")({ api, models, client, global, timeStart });

		api.listenMqtt((error, event) => {
			if (error) return logger(`handleListener đã xảy ra lỗi: ${JSON.stringify(error)}`, "error");
			if ((["presence","typ","read_receipt"].some(typeFilter => typeFilter == event.type))) return;
			(global.config.DeveloperMode == true) ? console.log(event) : "";
			return handleListen(event);
		});

		setInterval(function () { return handleListen({ type: "ping", time: 1, reader: 1, threadID: 1 }) }, 60000);
		return;
	});	
}

//////////////////////////////////////////////
//========= Connecting to Database =========//
//////////////////////////////////////////////

const { Sequelize, sequelize } = require("./includes/database");
(async () => {
	try {
		if (existsSync(resolve('./includes', 'skeleton_data.sqlite')) && !existsSync(resolve('./includes', 'data.sqlite'))) copySync(resolve('./includes', 'skeleton_data.sqlite'), resolve('./includes', 'data.sqlite'));
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

		await sequelize.authenticate();
		logger("Kết nối cơ sở dữ liệu thành công", "[ DATABASE ]");
		const models = require("./includes/database/model");
		return onBot({ models });
	}
	catch (error) {
		() => logger(`Kết nối cơ sở dữ liệu thất bại, Lỗi: ${error.name}: ${error.message}`, "[ DATABASE ]");
	}
})();

//THIZ BOT WAS MADE BY ME(CATALIZCS) AND MY BROTHER SPERMLORD - DO NOT STEAL MY CODE (つ ͡ ° ͜ʖ ͡° )つ ✄ ╰⋃╯