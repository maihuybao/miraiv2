module.exports.config = {
    name: "linkword",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "MewMew",
    description: "Chơi nối từ với bot or thành viên trong nhóm",
    commandCategory: "game-mp",
    usages: "linkword",
    cooldowns: 5,
    dependencies: ["axios"],
    info: [
        {
            key: 'none',
            prompt: 'bật tắt chế độ chơi',
            type: 'Văn Bản',
            example: 'linkword'
        }, 
        {
            key: 'từ nối',
            prompt: 'Nhắn lên nhóm 2 từ và đợi bot trả lời',
            type: 'Văn bản',
            example: 'con gà'
        }
    ]
};
module.exports.event = async function({ api, event, global }) {
    if (!global.linkword) global.linkword = new Map();
    const axios = require("axios");
    let { body: content, threadID, messageID } = event;
    if (global.linkword.has(threadID)) {
        if (content && content.split(" ").length == 2) {
            var data = (await axios.get("http://simsimi.miraiproject.tk/api/linkword?ask=" + encodeURIComponent(content))).data;
            return api.sendMessage(data.text, threadID, messageID);
        }
    }
}
module.exports.run = function({ api, event, global }) {
    let { threadID, messageID } = event;
    if (!global.linkword) global.linkword = new Map();
    if (!global.linkword.has(threadID)) {
        global.linkword.set(threadID);
        api.sendMessage("Đã bật linkword", threadID, messageID);
    } else {
        global.linkword.delete(threadID);
        api.sendMessage("Đã tắt linkword", threadID, messageID);
    }
}
