module.exports.config = {
	name: "givesome",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "CatalizCS",
	description: "Cho bạn cái gì đó :)",
	commandCategory: "general",
	usages: "givesome",
	cooldowns: 5,
	dependencies: ["request"],
};

module.exports.event = function({ api, event, client, __GLOBAL }) {
	const { createWriteStream, createReadStream, unlinkSync } = require("fs-extra");
	if (event.body.indexOf("give he some ") == 0) {
		let text = event.body.slice(event.body.indexOf("give he some ") + 13, event.body);
		return require("request")("https://api.unsplash.com/search/photos?client_id=Hf3ZFAxC83RugBG4mAaobaiMfj_3BZkkiUljJmc534U&page=1&query=" + encodeURIComponent(text), (err, response, body) => {
			const result = JSON.parse(body);
			require("request")(result.results[0].urls.raw).pipe(createWriteStream(__dirname + `/cache/pics.png`)).on("close", () => api.sendMessage({attachment: createReadStream(__dirname + `/cache/pics.png`)}, event.threadID, () => unlinkSync(__dirname + `/cache/pics.png`), event.messageID));
		})
	}
}

module.exports.run = async ({ api, event, args }) => {
	return api.sendMessage("Sử dụng: give he some ... để sử dụng!", event.threadID, event.messageID);
}