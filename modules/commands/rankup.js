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

module.exports.event = async function({ api, event, User }) {
	let {threadID, senderID } = event;
	let data = (await User.getData(senderID)).otherInfo || {};
	data["COUNT"]++;
	await User.setData(userID = senderID, options = { otherInfo: data });
	let countMess = (await User.getData(senderID)).otherInfo;
	if (typeof countMess == "undefined") return;
	let curLevel = Math.floor((Math.sqrt(1 + (4 * countMess.COUNT / 3) + 1) / 2));
	let level = Math.floor((Math.sqrt(1 + (4 * (countMess.COUNT + 1) / 3) + 1) / 2));
 	if (level > curLevel) {
 		let name = (await User.getInfo(senderID)).name;
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