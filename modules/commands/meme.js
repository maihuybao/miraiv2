module.exports.config = {
	name: "meme",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "Mirai Team",
	description: "Random ảnh chế :D",
	commandCategory: "random-img",
	cooldowns: 1,
	dependencies: {
		"request": "",
		"fs-extra": ""
	}
};

module.exports.run = ({ event, api }) => {
    const { createWriteStream, createReadStream, unlinkSync } = global.nodemodule["fs-extra"];
    const request = global.nodemodule["request"];
    return request("https://meme-api.herokuapp.com/gimme/memes", (err, response, body) => {
        if (err) throw err;
        var content = JSON.parse(body);
        request(content.url).pipe(createWriteStream(__dirname + `/cache/meme.jpg`)).on("close", () =>api.sendMessage({body: `${content.title}`, attachment: createReadStream(__dirname + "/cache/meme.jpg")}, event.threadID, () => unlinkSync(__dirname + "/cache/meme.jpg"), event.messageID));
    });
}