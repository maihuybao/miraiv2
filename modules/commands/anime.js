module.exports.config = {
	name: "anime",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "SpermLord",
	description: "Random lấy ảnh anime! (Safe For Work)",
	commandCategory: "random-img",
	usages: "anime tag",
	cooldowns: 1,
	dependencies: ['request', 'fs-extra'],
    info: [
		{
			key: "tag => Để trống",
			prompt: "Lấy danh sách các tag có",
            type: "null",
            example: ""
		},
		{
			key: "tag => tag tồn tại trong danh sách",
			prompt: "Nhập tag tồn tại để lấy ảnh đúng với chủ đề của tag!",
            type: "string",
            example: "kiss"
		}
	],
};

const { existsSync, createWriteStream } = require("fs-extra");
const request = require("request");

if (!existsSync(__dirname + "/cache/anime.json")) request("https://raw.githubusercontent.com/catalizcs/storage-data/master/anime/anime.json").pipe(createWriteStream(__dirname + "/cache/anime.json"));

module.exports.run = ({ event, api, args }) => {
    const { readFileSync, createReadStream, createWriteStream, unlinkSync } = require("fs-extra");
    const request = require("request");

    let animeData = JSON.parse(readFileSync(__dirname + "/cache/anime.json"));
    if (!animeData.hasOwnProperty(args[0])) {
        let list = [];
        Object.keys(animeData).forEach(endpoint => list.push(endpoint));
        return api.sendMessage(`=== Tất cả các tag của Anime ===\n${list.join(", ")}`, event.threadID, event.messageID);
    }
    else return request(animeData[args[0]], (error, response, body) => {
        let picData = JSON.parse(body);
        let URL = "";
        (!picData.data) ? URL = picData.url : URL = picData.data.response.url;
        let ext = URL.substring(URL.lastIndexOf(".") + 1);
        request(URL).pipe(createWriteStream(__dirname + `/cache/anime.${ext}`)).on("close", () => api.sendMessage({ attachment: createReadStream(__dirname + `/cache/anime.${ext}`) }, event.threadID, () => unlinkSync(__dirname + `/cache/anime.${ext}`), event.messageID));
    })
}