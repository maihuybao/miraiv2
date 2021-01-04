const { writeFileSync, readFileSync } = require("fs-extra");
const logger = require("./log.js")

module.exports = function({ api, __GLOBAL, client }) {
	//will do something in here ¯\_(ツ)_/¯ 

	function throwError(command, threadID, messageID) {
		let threadSetting = client.threadSetting.get(threadID);
		let prefix = threadSetting.PREFIX || __GLOBAL.settings.PREFIX;;
		return api.sendMessage(`[!] » Lệnh bạn đang sử dụng không tồn tại, vui lòng sử dụng ${prefix}help ${command} để biết thêm chi tiết cách sử dụng!`, threadID, messageID);
	}

	return {
		throwError
	};
}