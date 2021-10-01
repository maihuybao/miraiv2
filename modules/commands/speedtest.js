module.exports.config = {
    name: "speedtest",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "CatalizCS",
    description: "Kiểm tra tốc độ mạng",
    commandCategory: "system",
    usages: "speedtest",
    cooldowns: 15,
    dependencies: ['fast-speedtest-api']
};

module.exports.run = async function({ api, event }) {
	try {
		const fast = require('fast-speedtest-api');
		const speedTest = new fast({
			token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm",
			verbose: false,
			timeout: 10000,
			https: true,
			urlCount: 5,
			bufferSize: 8,
			unit: fast.UNITS.Mbps
		});
		const resault = await speedTest.getSpeed();
		return api.sendMessage(
			"=== Download ===" + 
			"\n- Speed: " + resault + " Mbps",
			event.threadID, event.messageID
		);
	}
	catch {
		return api.sendMessage("Không thể speedtest ngay lúc này, hãy thử lại sau!", event.threadID, event.messageID);
	}
}