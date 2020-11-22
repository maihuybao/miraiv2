module.exports.config = {
	name: "math",
	version: "0.0.1-beta",
	hasPermssion: 0,
	credits: "MewMew",
	description: "Làm toán",
	commandCategory: "general",
	usages: "math 1 + 2",
	cooldowns: 5,
	dependencies: ["request"],
	info: [
		{
			key: 'math',
			prompt: '',
			type: 'Phép toán',
			example: 'math x+1=2'
		}
	]
};

module.exports.run = function({ api, event, args, __GLOBAL }) {
	function cleanMath(calc) {
		let clean = calc;
		clean = clean.replace(/}/g, "").replace(/{/g, "").replace(/, x/g, "\nx").replace(/negative/, "-").replace(/sqrt/g, "√").replace(/pi/g, "π").replace(/1 half/g, "½").replace(/1 3rd/g, "⅓").replace(/1 4th/g, "¼").replace(/1 5th/g, "⅕").replace(/->/g, " = ");
		return clean;
	}
	const wolfram = `http://api.wolframalpha.com/v2/result?appid=${__GLOBAL.settings.WOLFRAM}&i=`;
	Math.radians = (degrees) => degrees * Math.PI / 180;
	Math.degrees = (radians) => radians * 180 / Math.PI;
	var m = args.join(" ");
	var l = "http://lmgtfy.com/?q=" + m.replace(/ /g, "+");
	if (!m) return api.sendMessage("Bạn chưa nhập phép tính", event.threadID, event.messageID);
	require("request")(wolfram + encodeURIComponent(m), (err, response, body) => (body.toString() === "No short answer available") ? api.sendMessage("Không có kết quả nào cho phép tính", event.threadID, event.messageID) : (body.toString() === "Wolfram|Alpha did not understand your input") ? api.sendMessage(l, event.threadID, event.messageID) : (body.toString() === "Wolfram|Alpha did not understand your input") ? api.sendMessage("Tôi không hiểu câu hỏi của bạn", event.threadID, event.messageID) : (body.toString() === "My name is Wolfram Alpha") ? api.sendMessage("Tôi bị gay??!", event.threadID, event.messageID) : (body.toString() === "I was created by Stephen Wolfram and his team") ? api.sendMessage("Đoán xem =))", event.threadID, event.messageID) : (body.toString() === "I am not programmed to respond to this dialect of English.") ? api.sendMessage("Tôi không được lập trình để nói những thứ như này", event.threadID, event.messageID) : (body.toString() === "StringJoin(CalculateParse`Content`Calculate`InternetData(Automatic, Name))") ? send("Tôi không biết phải trả lời như nào", event.threadID, event.messageID) : (body === "3.14159") ? api.sendMessage(`${Math.PI}`, event.threadID, event.messageID) : api.sendMessage(cleanMath(body), event.threadID, event.messageID));
}