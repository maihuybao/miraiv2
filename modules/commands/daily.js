module.exports.config = {
	name: "daily",
	version: "0.0.1",
	hasPermssion: 0,
	credits: "CatalizCS",
	description: "Nhận 200 coins mỗi ngày!",
	commandCategory: "Economy",
	usages: "daily",
    cooldowns: 5,
    dependencies: ["parse-ms"],
    envConfig: {
        cooldownTime: 43200000,
        rewardCoin:200
    }
};

module.exports.run = async ({ event, api, Currencies, __GLOBAL }) => {
    const ms = require("parse-ms");
    let cooldown = __GLOBAL.daily.cooldownTime;
    let coinReward = __GLOBAL.daily.rewardCoin;
    let data = (await Currencies.getData(event.senderID)).dailyTime;
    if (typeof data !== "undefined" && cooldown - (Date.now() - data) > 0) {
        let time = ms(cooldown - (Date.now() - data));
		return api.sendMessage(`Bạn đang trong thời gian chờ\nVui lòng thử lại sau: ${time.hours}:${time.minutes}:${time.seconds}!`, event.threadID);
    }
    else return api.sendMessage(`Bạn đã nhận ${coinReward} coins, để có thể tiếp tục nhận, vui lòng quay lại sau 12 tiếng`, event.threadID, async () => {
        await Currencies.increaseMoney(event.senderID, coinReward);
        await Currencies.setData(event.senderID, options = { dailyTime: Date.now() });
    })
}