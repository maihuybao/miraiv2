module.exports.config = {
    name: "linkword",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "MewMew",
    description: "Chơi nối từ với bot or thành viên trong nhóm",
    commandCategory: "group",
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
module.exports.event = async function({ api, event, args, client, __GLOBAL }) {
    if (!__GLOBAL.linkword) __GLOBAL.linkword = new Map();
    const axios = require("axios");
    let { body: content, threadID, messageID } = event;
    if (__GLOBAL.linkword.has(threadID)) {
        if (content && content.split(" ").length == 2) {
            var data = (await axios.get("http://simsimi.miraiproject.tk/api/linkword?ask=" + encodeURIComponent(content))).data;
            return api.sendMessage(data.text, threadID, messageID);
        }
    }
}
module.exports.run = function({ api, event, args, client, __GLOBAL }) {
    let { threadID, messageID } = event;
    if (!__GLOBAL.linkword) __GLOBAL.linkword = new Map();
    if (!__GLOBAL.linkword.has(threadID)) {
        __GLOBAL.linkword.set(threadID);
        api.sendMessage("Đã bật linkword", threadID, messageID);
    } else {
        __GLOBAL.linkword.delete(threadID);
        api.sendMessage("Đã tắt linkword", threadID, messageID);
    }
}
