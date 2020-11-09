const logger = require("../../utils/log.js");
const totp = require("totp-generator");
const readline = require("readline");

module.exports = ({ err, op }) => {
	//if (!err.error) return err;
/*	var rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
*/
	if (err.error == "login-approval") {
		if (op.otpKey) {
			logger("Sử dụng key otp để đăng nhập!", "[ LOGIN ]");
			//rl.close();
			try {
				err.continue(totp(op.otpKey))
			} catch (error) {
				return logger("Đã xảy ra lỗi với otpkey!, " + error.message, "[ LOGIN ]");
			}
			return;
		} else {
			var rl = readline.createInterface({
				input: process.stdin,
				output: process.stdout
			});
			logger("Nhập mã xác minh 2 lớp:", "[ LOGIN ]");
			rl.on("line", line => {
				err.continue(line);
				console.log(line);
				rl.close();
			});
			return;
		}
	}
	else if (err.error == "Wrong username/password.") return "Tài khoản hoặc mật khẩu sai!";
	else if (err.error == "Error retrieving userID. This can be caused by a lot of things, including getting blocked by Facebook for logging in from an unknown location. Try logging in with a browser to verify.") return "Không thể đăng nhập do bạn đang đăng nhập bot ở một địa chỉ hoặc trình duyệt khác chưa được xác minh!";
	else return "Không thể đăng nhập vào tài khoản của bạn!";
	/*switch (err.error) {
		case "login-approval":
			if (op.otpKey) {
				logger("Sử dụng key otp để đăng nhập!", "[ LOGIN ]");
				rl.close();
				err.continue(totp(op.otpKey))
			}
			else {
					logger("Nhập mã xác minh 2 lớp:", "[ LOGIN ]");
					rl.on("line", async line => {
						await err.continue(line);
						rl.close();
					});
				}
			break;
		case "Wrong username/password.":
			rl.close();
			return "Tài khoản hoặc mật khẩu sai!";
			//process.exit(1);
			break;
		case "Error retrieving userID. This can be caused by a lot of things, including getting blocked by Facebook for logging in from an unknown location. Try logging in with a browser to verify.":
			rl.close();
			return "Không thể đăng nhập do bạn đang đăng nhập bot ở một địa chỉ hoặc trình duyệt khác chưa được xác minh!";
			break;
		default:
			rl.close();
			return "Không thể đăng nhập vào tài khoản facebook!";
			break;
	}*/
}