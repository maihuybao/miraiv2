const request = require("request");

module.exports.config = {
	name: "covid",
	description: "",
	aliases: [],
	usage: "like name",
	group: "system"
};


module.exports.run = (api, event) => {
	return request("https://code.junookyo.xyz/api/ncov-moh/data.json", (err, response, body) => {
		if (err) throw err;
		var data = JSON.parse(body);
		api.sendMessage(
			"Thế giới:" +
			"\n- Nhiễm: " + data.data.global.cases +
			"\n- Chết: " + data.data.global.deaths +
			"\n- Hồi phục: " + data.data.global.recovered +
			"\nViệt Nam:" +
			"\n- Nhiễm: " + data.data.vietnam.cases +
			"\n- Chết: " + data.data.vietnam.deaths +
			"\n- Phục hồi: " + data.data.vietnam.recovered,
			event.threadID, event.messageID
		);
	});
}