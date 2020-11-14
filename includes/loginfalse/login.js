const login = require("fca-unofficial");
const totp = require("totp-generator");
const logger = require("../../utils/log.js");
const readline = require("readline");

const options = {
	logLevel: "silent",
	forceLogin: true,
	userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36"
};

/*const getInput = async () => {
	const readline = require("readline");
	let codeOutput;
	var rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	logger("Nhập mã xác minh 2 lớp:");
	rl.on("line", line => {
		codeOutput = line;
		rl.close();
	})
	return codeOutput;
}


const getInput = () => {
	return new Promise((resolve, reject) => {
		try {
			var output = "";
			var rl = readline.createInterface({
				input: process.stdin,
				output: process.stdout
			});
			logger("Nhập mã xác minh 2 lớp:");
			rl
			.on("line", (line) => {
				output = line.trim();
			})
			.on("close", () => {
				resolve(output);
			})
		} catch (error) {
			reject(error);
		}
	})
}*/

module.exports = (piggy) => new Promise((resolve, reject) => {
	login(piggy, options, async (error, api) => {
		if (error) {
			switch (error.error) {
				case "login-approval": 
					if (piggy.otpKey) {
						logger("Sử dụng key otp để đăng nhập!", "[ LOGIN ]");
						try {
							error.continue(totp(piggy.otpKey))
						} catch (error) {
							return logger("Đã xảy ra lỗi với otpkey!, " + error.message, "[ LOGIN ]");
						}
					} 
					else {
						var rl = readline.createInterface({
							input: process.stdin,
							output: process.stdout
						});
						rl.question('Code: ', (code) => {
							rl.close();
							logger(code);
							return error.continue("1231");
						})
						
						/*var rl = readline.createInterface({
							input: process.stdin,
							output: process.stdout
						});
						//logger("Nhập mã xác minh 2 lớp:");
						rl.question("Nhập mã xác minh 2 lớp: ", async (answer) => {
							console.log("1231" + answer);
							await error.continue(answer);
							rl.close();
						});
						//const input = await getInput();
						//console.log(input);
						//error.continue(input);
						/*var rl = readline.createInterface({
							input: process.stdin,
							output: process.stdout
						});
						logger("Nhập mã xác minh 2 lớp:");
						await rl.on("input", input => {
							rl.close();
							console.log(input);
							return input;
						})*/
					}
					break;
				case "Wrong username/password.": 
					logger("Tài khoản hoặc mật khẩu sai!");
					break;
				case "Error retrieving userID. This can be caused by a lot of things, including getting blocked by Facebook for logging in from an unknown location. Try logging in with a browser to verify.":
					logger("Không thể đăng nhập do bạn đang đăng nhập bot ở một địa chỉ hoặc trình duyệt khác chưa được xác minh!");
					reject();
					break;
				default:
					logger("Không thể đăng nhập vào tài khoản của bạn!");
			}
			return;
		}
		resolve(api);
	});
});