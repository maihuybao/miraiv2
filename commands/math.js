module.exports.config = {
	name: "math",
	version: "0.0.1-beta",
	hasPermssion: 0,
	credits: "MewMew",
	description: "làm toán",
	commandCategory: "general",
	usages: "math 1 + 2",
	cooldowns: 5,
	info: [
		{
			key: 'math',
			prompt: '',
			type: 'Phép toán',
			example: 'math x+1=2'
		}
	]
};

module.exports.run = function({ api, event, args, client }) {
	function cleanMath(calc) {
		let clean = calc;
		clean = clean.replace(/}/g, "").replace(/{/g, "").replace(/, x/g, "\nx").replace(/negative/, "-").replace(/sqrt/g, "√").replace(/pi/g, "π").replace(/1 half/g, "½").replace(/1 3rd/g, "⅓").replace(/1 4th/g, "¼").replace(/1 5th/g, "⅕").replace(/->/g, " = ");
		return clean;
	}
	const send = api.sendMessage;
	const wolfram = "http://api.wolframalpha.com/v2/result?appid=T8J8YV-H265UQ762K&i=";
	Math.radians = (degrees) => degrees * Math.PI / 180;
	Math.degrees = (radians) => radians * 180 / Math.PI;
	var m = args.join(" ");
	var l = "http://lmgtfy.com/?q=" + m.replace(/ /g, "+");
	if (!m) return send("Bạn chưa nhập phép tính", event.threadID, event.messageID);
	require("request")(wolfram + encodeURIComponent(m), (err, response, body) => (body.toString() === "No short answer available") ? send("Không có kết quả nào cho phép tính", event.threadID, event.messageID) : (body.toString() === "Wolfram|Alpha did not understand your input") ? send(l, event.threadID, event.messageID) : (body.toString() === "Wolfram|Alpha did not understand your input") ? send("Tôi không hiểu câu hỏi của bạn", event.threadID, event.messageID) : (body.toString() === "My name is Wolfram Alpha") ? send("Tôi bị gay??!", event.threadID, event.messageID) : (body.toString() === "I was created by Stephen Wolfram and his team") ? send("Đoán xem =))", event.threadID, event.messageID) : (body.toString() === "I am not programmed to respond to this dialect of English.") ? send("Tôi không được lập trình để nói những thứ như này", event.threadID, event.messageID) : (body.toString() === "StringJoin(CalculateParse`Content`Calculate`InternetData(Automatic, Name))") ? send("Tôi không biết phải trả lời như nào", event.threadID, event.messageID) : (body === "3.14159") ? api.sendMessage(`${Math.PI}`, event.threadID, event.messageID) : send(cleanMath(body), event.threadID, event.messageID));
}