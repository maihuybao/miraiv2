module.exports = function({ api, __GLOBAL, client }) {
	//will do something in here ¯\_(ツ)_/¯ 

	function throwError(command, threadID, messageID) {
		let threadSetting = client.threadSetting.get(parseInt(threadID)) || {};
		return api.sendMessage(`[!] » Lệnh bạn đang sử dụng không đúng cú pháp, vui lòng sử dụng ${(threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : __GLOBAL.settings.PREFIX}help ${command} để biết thêm chi tiết cách sử dụng!`, threadID, messageID);
	}

	function cleanAnilistHTML(text) {
		text = text
			.replace('<br>', '\n')
			.replace(/<\/?(i|em)>/g, '*')
			.replace(/<\/?b>/g, '**')
			.replace(/~!|!~/g, '||')
			.replace("&amp;", "&")
			.replace("&lt;", "<")
			.replace("&gt;", ">")
			.replace("&quot;", '"')
			.replace("&#039;", "'");
		return text;
	}

	return {
		throwError,
		cleanAnilistHTML
	};
}
//Useless