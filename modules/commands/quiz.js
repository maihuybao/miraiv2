module.exports.config = {
	name: "quiz",
	version: "1.0.0",
	credits: "CatalizCS",
	hasPermssion: 0,
	description: "Trả lời câu hỏi (tiếng anh)",
	commandCategory: "General",
	usages: "quiz",
	cooldowns: 5,
	dependencies: ["axios"],
	info: [
		{
			key: 'Reply',
			prompt: 'Phản hồi câu hỏi để trả lời trong thời gian cho phép',
			type: 'String'
		}
	]
};

module.exports.handleReaction = ({ api, event, handleReaction, client }) => {
	
	if (!event.userID == handleReaction.author) return;
	let response = "";
	if (event.reaction == "👍") response = "True"
	else response = "False";
	if (response == handleReaction.answer) api.sendMessage("ye, bạn trả lời đúng rồi đấy xD", event.threadID);
	else api.sendMessage("oops, bạn trả lời sai rồi :X", event.threadID);
	const indexOfHandle = client.handleReaction.findIndex(e => e.messageID == handleReaction.messageID);
	client.handleReaction.splice(indexOfHandle, 1);
	handleReaction.answerYet = 1;
	return client.handleReaction.push(handleReaction);
}

module.exports.run = async ({  api, event, args, client }) => {
	const axios = require("axios");
	let difficulties = ["easy", "medium", "hard"];
	let difficulty = args[0];
	(difficulties.some(item => difficulty == item)) ? "" : difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
	let fetch = await axios(`https://opentdb.com/api.php?amount=1&encode=url3986&type=boolean&difficulty=${difficulty}&category=31`);
	if (!fetch.data) return api.sendMessage("Không thể tìm thấy câu hỏi do server bận", event.threadID, event.messageID);
	return api.sendMessage(`Đây là câu hỏi dành cho bạn:\n        ${decodeURIComponent(fetch.data.results[0].question)}\n\n   👍: True       😢: False`, event.threadID, async (err, info) => {
		client.handleReaction.push({
			name: "quiz",
			messageID: info.messageID,
			author: event.senderID,
			answer: fetch.data.results[0].correct_answer,
			answerYet: 0
		});
		await new Promise(resolve => setTimeout(resolve, 20 * 1000));
		const indexOfHandle = client.handleReaction.findIndex(e => e.messageID == info.messageID);
		let data = client.handleReaction[indexOfHandle];
		if (data.answerYet !== 1) {
			api.sendMessage(`Time out!! đáp án chính xác là ${fetch.data.results[0].correct_answer}`, event.threadID, info.messageID);
			return client.handleReaction.splice(indexOfHandle, 1);
		}
		else return;
	});
}