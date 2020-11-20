module.exports.config = {
	name: "covid",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "SpermLord",
	description: "Lấy thông tin về tình hình dịch bệnh COVID-19",
	commandCategory: "general",
	usages: "covid",
	cooldowns: 5
};

module.exports.run = function({ api, event, args, client }) {
	const axios = require('axios');
	(async () => {
		var world = (await axios.get('https://covid19.mathdro.id/api')).data;
		var vn = (await axios.get('https://covid19.mathdro.id/api/countries/vn')).data;
		var nhiemtg = world.confirmed.value;
		var chettg = world.deaths.value;
		var hoiphuctg = world.recovered.value;
		var nhiemvn = vn.confirmed.value;
		var chetvn = vn.deaths.value;
		var hoiphucvn = vn.recovered.value;
		api.sendMessage(
			'====== Thế Giới ======\n' +
			`😷 Nhiễm: ${nhiemtg}\n` +
			`💚 Hồi phục: ${hoiphuctg}\n` +
			`💀 Tử vong: ${chettg}\n` +
			'====== Việt Nam ======\n' +
			`😷 Nhiễm: ${nhiemvn}\n` +
			`💚 Hồi phục: ${hoiphucvn}\n` +
			`💀 Tử vong: ${chetvn}`,
			event.threadID, event.messageID
		);
	})();
}