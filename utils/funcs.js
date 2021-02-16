module.exports = function({ api, __GLOBAL, client }) {
	//will do something in here ¯\_(ツ)_/¯ 

	function throwError(command, threadID, messageID) {
		let threadSetting = client.threadSetting.get(parseInt(threadID)) || {};
		return api.sendMessage(`[!] » Lệnh bạn đang sử dụng không đúng cú pháp, vui lòng sử dụng ${(threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : __GLOBAL.settings.PREFIX}help ${command} để biết thêm chi tiết cách sử dụng!`, threadID, messageID);
	}

	return {
		throwError
	};
}
//Useless