const readline = require("readline");
const chalk = require("chalk");
const figlet = require("figlet");
const fs = require('fs-extra');
const os = require("os");
const { execSync } = require('child_process');

let commands = {
	1: {
		"de": "Đăng nhập tài khoản bot để lấy appstate",
		run: function() {
			try {
				delete require.cache[require.resolve(`./login.js`)];
				execSync('node login', {stdio: 'inherit'});
				console.log(chalk.bold.green("Successed!"));
			} catch (e) {
				console.log(e.message);
				console.log(chalk.bold.red("Failed!"));
			}
		}
	},
	2: {
		"de": "Khởi động bot",
		run: function() {
			try {
				delete require.cache[require.resolve(`./mirai.js`)];
				execSync('node mirai', {stdio: 'inherit'});
				console.log(chalk.bold.green("Successed!"));
			} catch (e) {
				console.log(e.message);
				console.log(chalk.bold.red("Failed!"));
			}
		}
	},
	3: {
		"de": "Khởi động bot bằng pm2",
		run: function() {
			try {
				execSync('pm2 mirai --no-daemon', {stdio: 'inherit'});
				console.log(chalk.bold.green("Successed!"));
			} catch (e) {
				console.log(e.message);
				console.log(chalk.bold.red("Failed!"));
			}
		}
	},
	4: {
		"de": "Cài đặt module command mới cho bot",
		run: function() {
			console.log("im working later xD");
		}
	},
	5: {
		"de": "Đặt lại toàn bộ module command",
		run: function() {
			console.log("im working later xD");
		}
	},
	6: {
		"de": "Xoá cache, Giải phóng dung lượng",
		run: function() {
			console.log("im working later xD");
		}
	},
	7: {
		"de": "Exit",
		run: function() {
			process.exit();
		}
	}
}

console.clear();
console.log(chalk.yellow(figlet.textSync('Mirai Panel', { horizontalLayout: 'full' })));
console.log(chalk.blue("	================== © 2020 CatalizCS ==================\n"));
console.log(
	`${chalk.blueBright("> ")}Version Bot: ${chalk.cyan(JSON.parse(fs.readFileSync('package.json')).version)}\n` +
	`${chalk.blueBright("> ")}Device Information: ${chalk.cyan(os.version())}\n` +
	`${chalk.blueBright("> ")}Node Version: ${chalk.cyan(process.versions.node)}\n` + 
	`${chalk.blueBright("> ")}CPU Name: ${chalk.cyan(os.cpus()[0].model)}(Cores/Threads: ${chalk.cyan(os.cpus().length)})\n` 
);
console.log(chalk.blue("	============ " + chalk.bold.magenta("Hãy chọn một trong những tuỳ chọn bên dưới") + " ============\n"));
let choose = "";
let objectKey = Object.keys(commands);
objectKey.forEach(item => {
	choose += `${item}/ ${commands[item].de}\n`
});
console.log(choose);

let rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt: '>'
});

rl.prompt();

rl.on('line', async (input) => {
	input = input.toLowerCase();
	if (!input) {
		console.log(chalk.bold.red("Bạn cần phải lựa chọn và nhập các tuỳ chọn có sẵn ở trên"));
		rl.prompt();
		return;
	}
	if (input in commands) {
		await commands[input].run();
		rl.prompt();
		return;
	} else {
		console.log(chalk.bold.red("Tuỳ chọn của bạn không tồn tại"));
		rl.prompt();
		return;
	}
});