module.exports.config = {
	name: "mit",
	version: "1.1.0",
	hasPermssion: 0,
	credits: "CatalizCS",
	description: "mitsuki",
	commandCategory: "chatbot",
	usages: "mit hello",
	cooldowns: 5,
	dependencies: ["request","xml2js"]
};

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

module.exports.run = function ({ api, event, args }) {
	require("request")(`https://kakko.pandorabots.com/pandora/talk-xml?input=${encodeURIComponent(args.join(" ") || "hi")}&botid=9fa364f2fe345a10&custid=${event.senderID}`, (err, response, body) => {
		const xml = require("xml2js");
		xml.parseString(body, (error, results) => api.sendMessage(cleanAnilistHTML(results.result.that[0]), event.threadID, event.messageID));
	})
}
