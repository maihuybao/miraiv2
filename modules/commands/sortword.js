module.exports.config = {
    name: "sortword",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "MewMew",
    description: "Sắp xếp lại 1 từ tiếng anh bị xáo trộn",
    commandCategory: "group",
    usages: "sortword",
    cooldowns: 5,
    dependencies: ["axios"],
    info: [
        {
            key: 'easy, medium, hard, extreme, random',
            prompt: 'Chọn chế độ chơi và hoàn thành câu hỏi',
            type: 'Văn Bản',
            example: 'sortword'
        }
    ]
};
module.exports.event = function({ api, event, client, __GLOBAL }) {
    if (typeof client.sortword == "undefined") return;
    if (client.sortword.some(e => e.user == event.senderID)) {
        var data = client.sortword.find(e => e.user == event.senderID);
        var index = client.sortword.findIndex(e => e.user == event.senderID);
        if (data.user == event.senderID && data.thread == event.threadID && event.body.toLowerCase() == data.correct.toLowerCase()) {
            return api.sendMessage("Bạn đã sắp xếp chính xác", event.threadID, () => {
                client.sortword.splice(index, 1);
            }, event.messageID)
        } else if (data.user == event.senderID && data.thread == event.threadID && event.body.toLowerCase() != data.correct.toLowerCase()) {
            return api.sendMessage("Bạn sắp xếp sai rồi!\nĐáp án đúng là: " + data.correct, event.threadID, () => {
                client.sortword.splice(index, 1);
            }, event.messageID);
        }
    }
}
module.exports.run = async function({ api, event, args, client, __GLOBAL }) {
    if (!client.sortword) client.sortword = new Array();
    var axios = require("axios");
    var level, time;
    switch (args[0]) {
        case "easy":
            level = "easy", time = 10;
            break;
        case "medium":
            level = "medium", time = 15;
            break;
        case "hard":
            level = "hard", time = 20;
            break;
        case "extreme":
            level = "extreme", time = 25;
            break;
        default:
            level = "random", time = 10;
            break;
    }
    var data = (await axios.get("https://simsimi.miraiproject.tk/api/rw?level=" + level)).data;
    api.sendMessage(`Bạn đã chọn level ${level} với thời gian ${time}s`, event.threadID, async () => {
        api.sendMessage("Chuẩn bị", event.threadID);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return api.sendMessage(data.random.join(", "), event.threadID, async () => {
            client.sortword.push({
                user: event.senderID,
                thread: event.threadID,
                correct: data.correct
            });
            await new Promise(resolve => setTimeout(resolve, time * 1000));
            if (client.sortword.some(e => e.user == event.senderID)) {
                var index = client.sortword.findIndex(e => e.user == event.senderID);
                api.sendMessage("Đã hết thời gian quy định!", event.threadID, () => client.sortword.splice(index, 1), event.messageID);
            }
        });
    }, event.messageID);
}
