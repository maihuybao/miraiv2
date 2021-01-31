module.exports.config = {
	name: "short",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "CatalizCS",
	description: "tạo shortcut cho 1 tin nhắn",
	commandCategory: "Group",
	usages: "short a => abcdefghiklmnoqprsuvtxy",
	cooldowns: 5,
	dependencies: ["fs-extra"]
}
const fs = require("fs-extra");
if (!fs.existsSync(__dirname + "/cache/shortcut.json")) fs.writeFileSync(__dirname + "/cache/shortcut.json", JSON.stringify([]), 'utf-8');

module.exports.event = function({ api, event }) {
	if (event.body.length !== -1) {
		let shortcut = JSON.parse(fs.readFileSync(__dirname + "/cache/shortcut.json"));
		if (shortcut.some(item => item.id == event.threadID)) {
			let getThread = shortcut.find(item => item.id == event.threadID).shorts;
			if (getThread.some(item => item.in == event.body)) {
				let shortOut = getThread.find(item => item.in == event.body).out;
				if (shortOut.indexOf(" | ") !== -1) {
					var arrayOut = shortOut.split(" | ");
					return api.sendMessage(`${arrayOut[Math.floor(Math.random() * arrayOut.length)]}`, event.threadID);
				}
				else return api.sendMessage(`${shortOut}`, event.threadID);
			}
		}
	}
}

module.exports.run = function({ api, event, args }) {
	var { threadID, messageID } = event;
	var content = args.join(" ");
	if (!content) return api.sendMessage("Sai Format", threadID, messageID);
	if (content.indexOf(`del`) == 0) {
		let delThis = content.slice(4, content.length);
		if (!delThis) return api.sendMessage("Không tìm thấy shortcut bạn cần xóa", threadID, messageID);
		return fs.readFile(__dirname + "/cache/shortcut.json", "utf-8", (err, data) => {
			if (err) throw err;
			var oldData = JSON.parse(data);
			var getThread = oldData.find(item => item.id == threadID).shorts;
			if (!getThread.some(item => item.in == delThis)) return api.sendMessage("Không tìm thấy shortcut bạn cần xóa", threadID, messageID);
			getThread.splice(getThread.findIndex(item => item.in === delThis), 1);
			fs.writeFile(__dirname + "/cache/shortcut.json", JSON.stringify(oldData), "utf-8", (err) => (err) ? console.error(err) : api.sendMessage("Đã xóa shortcut thành công!", threadID, messageID));
		});
	}
	else if (content.indexOf(`all`) == 0)
		return fs.readFile(__dirname + "/cache/shortcut.json", "utf-8", (err, data) => {
			if (err) throw err;
			let allData = JSON.parse(data);
			let msg = '';
			if (!allData.some(item => item.id == threadID)) return api.sendMessage("Hiện tại không có shortcut nào", threadID, messageID);
			if (allData.some(item => item.id == threadID)) {
				let getThread = allData.find(item => item.id == threadID).shorts;
				getThread.forEach(item => msg = '\n' + msg + item.in + ' -> ' + item.out);
			}
			if (!msg) return api.sendMessage("Hiện tại không có shortcut nào", threadID, messageID);
			api.sendMessage("Sau đây là shortcuts có trong nhóm: " + msg, threadID, messageID);
		});
	else {
		let narrow = content.indexOf(" => ");
		if (narrow == -1) return api.sendMessage("Sai Format", threadID, messageID);
		let shortin = content.slice(0, narrow);
		let shortout = content.slice(narrow + 4, content.length);
		if (shortin == shortout) return api.sendMessage("2 input và output giống nhau", threadID, messageID);
		if (!shortin) return api.sendMessage("Thiếu input", threadID, messageID);
		if (!shortout) return api.sendMessage("Thiếu output", threadID, messageID);
		return fs.readFile(__dirname + "/cache/shortcut.json", "utf-8", (err, data) => {
			if (err) throw err;
			var oldData = JSON.parse(data);
			if (!oldData.some(item => item.id == threadID)) {
				let addThis = {
					id: threadID,
					shorts: []
				}
				addThis.shorts.push({ in: shortin, out: shortout });
				oldData.push(addThis);
				return fs.writeFile(__dirname + "/cache/shortcut.json", JSON.stringify(oldData), "utf-8", (err) => (err) ? console.error(err) : api.sendMessage("Tạo shortcut thành công", threadID, messageID));
			}
			else {
				let getShort = oldData.find(item => item.id == threadID);
				if (getShort.shorts.some(item => item.in == shortin)) {
					let index = getShort.shorts.indexOf(getShort.shorts.find(item => item.in == shortin));
					let output = getShort.shorts.find(item => item.in == shortin).out;
					getShort.shorts[index].out = output + " | " + shortout;
					api.sendMessage("Shortcut đã tồn tại trong group này", threadID, messageID);
					return fs.writeFile(__dirname + "/cache/shortcut.json", JSON.stringify(oldData), "utf-8");
				}
				getShort.shorts.push({ in: shortin, out: shortout });
				return fs.writeFile(__dirname + "/cache/shortcut.json", JSON.stringify(oldData), "utf-8", (err) => (err) ? console.error(err) : api.sendMessage("Tạo shortcut thành công", threadID, messageID));
			}
		});
	}
}
