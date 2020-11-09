const login = require("fca-unofficial");
//const login = require("./login");
const { readFileSync } = require("fs");
const { resolve } = require("path");
const appStateFile = resolve(__dirname, './../../appstate.json');
const totp = require("totp-generator");
const readline = require("readline");
const logger = require("../../utils/log.js");
const option = {
	forceLogin: true,
	userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36"
};

const loginAppstate = (values) => new Promise((resolve, reject) => {
	login(values, option, (err, api) => {
		if (err) {
			switch (err.error) {
				case "login-approval": 
					if (values.otpKey) {
						logger("Sử dụng key otp để đăng nhập!", "[ LOGIN ]");
						try {
							err.continue(totp(values.otpKey))
						} catch (error) {
							return logger("Đã xảy ra lỗi với otpkey!, " + error.message, "[ LOGIN ]");
						}
					} 
					else {
						var rl = readline.createInterface({
							input: process.stdin,
							output: process.stdout
						});
						logger("Nhập mã xác minh 2 lớp:", "[ LOGIN ]");
						rl.on("line", line => {
							err.continue(line);
							rl.close();
						});
					}
					break;
				case "Wrong username/password.": 
					logger("Tài khoản hoặc mật khẩu sai!");
					reject();
					break;
				case "Error retrieving userID. This can be caused by a lot of things, including getting blocked by Facebook for logging in from an unknown location. Try logging in with a browser to verify.":
					logger("Không thể đăng nhập do bạn đang đăng nhập bot ở một địa chỉ hoặc trình duyệt khác chưa được xác minh!");
					reject();
					break;
				default:
					logger("Không thể đăng nhập vào tài khoản của bạn!");
					reject();
			}
		}
		resolve(api);
	})
});

module.exports = async function({ email, password, otpKey }, callback) {
	if (typeof callback !== "function") return console.error("Chưa có hàm nào được đặt.");
	let api;
	try {
		api = await loginAppstate({ appState: require(appStateFile) }).catch(() => Promise.resolve(loginAppstate({ email, password, otpKey })));
		callback(undefined, api);
	}
	catch (e) {
		callback(e);
	}
}
