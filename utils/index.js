module.exports.throwError = function (command, threadID, messageID) {
	let threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
	return global.client.api.sendMessage(`[!] » Lệnh bạn đang sử dụng không đúng cú pháp, vui lòng sử dụng ${(threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX}help ${command} để biết thêm chi tiết cách sử dụng!`, threadID, messageID);
}

module.exports.cleanAnilistHTML = function (text) {
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

module.exports.downloadFile = async function (url, path) {
	const { createWriteStream } = require('fs');
	const axios = require('axios');

	const response = await axios({
		method: 'GET',
		url: url,
		responseType: 'stream'
	});

	const writer = createWriteStream(path);

	response.data.pipe(writer);

	return new Promise((resolve, reject) => {
		writer.on('finish', resolve);
		writer.on('error', reject);
	});
};