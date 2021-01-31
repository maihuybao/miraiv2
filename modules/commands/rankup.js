module.exports.config = {
	name: "rankup",
	version: "0.0.1-beta",
	hasPermssion: 1,
	credits: "CatalizCS",
	description: "Thông báo rankup cho từng nhóm, người dùng",
	commandCategory: "system",
	usages: "rankup on/off",
	cooldowns: 5,
};

module.exports.event = async function({ api, event, Currencies, Users }) {
	let {threadID, senderID } = event;
	let data = (await Currencies.getData(senderID));
	if (!data) return;
	let exp = parseInt(data["exp"]);
	exp++
	await Currencies.setData(senderID, options = { exp });

	let countMess = (await Currencies.getData(senderID)).exp;
	if (typeof countMess == "undefined") return;
	let curLevel = Math.floor((Math.sqrt(1 + (4 * countMess / 3) + 1) / 2));
	let level = Math.floor((Math.sqrt(1 + (4 * (countMess + 1) / 3) + 1) / 2));
 	if (level > curLevel) {
		if (level == 1) return;
 		let name = (await Users.getInfo(senderID)).name;
		return api.sendMessage({
 			body: `Trình độ chém gió của ${name} đã đạt tới level ${level}`,
 			mentions:[{
 				tag: name,
 				id: senderID
 			}]
 		}, threadID);
 	}
}
module.exports.run = async function({ api, event, args, User }) {
	
}