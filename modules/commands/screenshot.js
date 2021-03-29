module.exports.config = {
	name: "screenshot",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "CatalizCS",
	description: "Screenshot một trang web nào đó (NOT ALLOW NSFW PAGE)",
	commandCategory: "other",
	usages: "screenshot site",
	cooldowns: 5,
	dependencies: ["request","fs-extra"]
};

module.exports.onLoad = () => {
    const request = require("request");
    const fs = require("fs-extra");
    if (!fs.existsSync(__dirname + '/cache/pornList.txt')) request('https://raw.githubusercontent.com/blocklistproject/Lists/master/porn.txt').pipe(fs.createWriteStream(__dirname + "/cache/pornList.txt"));
}

module.exports.run = ({ event, api, args, client }) => {
    const request = require("request");
    const fs = require("fs-extra");
    const url = require('url');

    if (!client.pornList) client.pornList = fs.readFileSync(__dirname + "/cache/pornList.txt", "utf-8").split('\n').filter(site => site && !site.startsWith('#')).map(site => site.replace(/^(0.0.0.0 )/, ''));
    let urlParsed = url.parse(args[0]);

    if (client.pornList.some(pornURL => urlParsed.host == pornURL)) return api.sendMessage("Trang web bạn nhập không an toàn!!(NSFW PAGE)", event.threadID, event.messageID);

    try {
        return request(`https://image.thum.io/get/width/1920/crop/400/fullpage/noanimate/${args[0]}`)
            .pipe(fs.createWriteStream(__dirname + `/cache/${event.senderID}-ss.png`))
            .on("close", () => api.sendMessage({ attachment: fs.createReadStream(__dirname + `/cache/${event.senderID}-ss.png`) }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/${event.senderID}-ss.png`)));
    }
    catch {
        return api.sendMessage("Không tìm thấy url này, định dạng không đúng ?", event.threadID, event.messageID);
    }
}