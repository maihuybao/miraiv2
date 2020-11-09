const login = require("fca-unofficial");
const logger = require("../../utils/log.js");
//const readline = require("readline");
const totp = require("totp-generator");
/*var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});*/
const option = {
	forceLogin: true,
	userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36"
};

//SFHI UVEP HT4Y BXK5 5IZN TLSB YL7D ENZO

module.exports = (op) => new Promise((resolve, reject) => {
	require('npmlog').error = () => {};
	login(op, option, (err, api) => {
		//if (err) reject(require("./error.js")({ err, op }));
		if (err) {
			reject();
			require("./error.js")({ err, op });
		}
		/*if (err) {
			switch (err.error) {
				case "login-approval":
					if (op.otpKey) err.continue(totp(op.otpKey))
					else return reject("Tài khoản facebook của bạn có bật xác minh 2 lớp!");
					break;
				case "Wrong username/password.":
					logger("Tài khoản hoặc mật khẩu sai!");
					return reject();
					//process.exit(1);
					break;
				case "Error retrieving userID. This can be caused by a lot of things, including getting blocked by Facebook for logging in from an unknown location. Try logging in with a browser to verify.":
					logger("Không thể đăng nhập do bạn đang đăng nhập bot ở một địa chỉ hoặc trình duyệt khác chưa được xác minh!", 2);
					return reject();
					break;
				default:
				console.error(err);
				return reject();
				process.exit(1);
			}
		}*/
		resolve(api);
	})
})