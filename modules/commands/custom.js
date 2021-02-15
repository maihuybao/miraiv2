module.exports.config = {
	name: "custom",
	version: "1.0.0",
	hasPermssion: 1,
	credits: "CatalizCS",
	description: "Custom toàn bộ mọi thứ ở tại lệnh này :D",
	commandCategory: "System",
    usages: "custom args input",
    dependencies: ["request", "fs-extra"],
	cooldowns: 5,
	info: [
		{
			key: "args => joinMessage",
			prompt: "Tùy chỉnh văn bản chào khi có thành viên vào",
			type: 'String',
			example: 'input => Chào mừng {name} đã tới {threadName}, {type} là thành viên thứ {soThanhVien} \n\n trong đó: \n{name}: Là tên thành viên vào \n{threadName}: Là tên nhóm\n{type}: Định danh thành viên mới vào, chẳng hạn là bạn hoặc các bạn\n{soThanhVien}: Là số thứ tự thành viên mới'
        },
        {
			key: "args => leaveMessage",
			prompt: "Tùy chỉnh văn bản khi có thành viên rời khỏi nhóm",
			type: 'String',
			example: 'input => {name} Đã {type} khỏi nhóm \n\nTrong đó: \n{name}: Là tên thành viên thoát\n {type}: Xác định nguyên nhân thoát, bị đá hoặc tự thoát'
        },
        {
			key: "args => rankupMessage",
			prompt: "Tùy chỉnh văn bản khi có thành viên lên level",
			type: 'String',
			example: 'input => {name} Đã thăng cấp {level} \n\nTrong đó: \n{name}: Là tên thành viên thoát\n {level}: Level của thành Viên'
        },
        {
			key: "args => joinGif",
			prompt: "Tùy chỉnh gif chào khi có thành viên vào",
			type: 'Url',
			example: 'input => Link tải file gif'
        },
        {
			key: "args => leaveGif",
			prompt: "Tùy chỉnh gif khi có thành viên rời khỏi nhóm",
			type: 'Url',
			example: 'input => Link tải file gif'
        },
        {
			key: "args => rankupGif",
			prompt: "Tùy chỉnh gif khi có thành viên lên level",
			type: 'Url',
			example: 'input => Link tải file gif'
        },
	]
};

module.exports.run = async ({ api, event, args, Threads, utils, client }) => {
    let settings = (await Threads.getData(event.threadID)).settings;
    switch (args[0]) {
        case "joinMessage": {
            let msg = args.slice(1, args.length).join(" ");
            settings["customJoin"] = msg;
            await Threads.setData(event.threadID, options = { settings });
            client.threadSetting.set(event.threadID, settings);
            api.sendMessage("Đã lưu tùy chỉnh của bạn thành công! dưới đây sẽ là phần preview:", event.threadID, () => {
                let body = msg
                .replace(/\{name}/g, "[Tên thành viên]")
                .replace(/\{type}/g, "[Bạn/các bạn]")
                .replace(/\{soThanhVien}/g, "[Số thành viên]")
                .replace(/\{threadName}/g, "[Tên nhóm]");
                api.sendMessage(body, event.threadID);
            })
        }
        break;
        case "leaveMessage": {
            let msg = args.slice(1, args.length).join(" ");
            settings["customLeave"] = msg;
            await Threads.setData(event.threadID, options = { settings });
            client.threadSetting.set(event.threadID, settings);
            api.sendMessage("Đã lưu tùy chỉnh của bạn thành công! dưới đây sẽ là phần preview:", event.threadID, () => {
                let body = msg
                .replace(/\{name}/g, "[Tên thành viên]")
                .replace(/\{type}/g, "[Tự rời/Bị quản trị viên]");
                api.sendMessage(body, event.threadID);
            })
        }
        break;
        case "rankupMessage": {
            let msg = args.slice(1, args.length).join(" ");
            settings["customRankup"] = msg;
            await Threads.setData(event.threadID, options = { settings });
            client.threadSetting.set(event.threadID, settings);
            api.sendMessage("Đã lưu tùy chỉnh của bạn thành công! dưới đây sẽ là phần preview:", event.threadID, () => {
                let body = msg
                .replace(/\{name}/g, "[Tên thành viên]")
                .replace(/\{level}/g, "[Level của thành viên]");
                api.sendMessage(body, event.threadID);
            })
        }
        break;
        case "joinGif": {
            const request = require("request");
            const fs = require("fs-extra");
            let msg = args.slice(1, args.length).join(" ");
            let dirGif = __dirname + `/../events/cache/joinGif/`;
            if (msg == "reset") {
                if (!fs.existsSync(dirGif)) fs.mkdirSync(dirGif, { recursive: true });
                if (!fs.existsSync(dirGif + `${event.threadID}.gif`)) return api.sendMessage("Bạn chưa cài đặt file gif cho nhóm!", event.threadID);
                fs.unlinkSync(dirGif + `${event.threadID}.gif`);
                return api.sendMessage("Đã gỡ bỏ thành công file gif của nhóm bạn!", event.threadID);
            }
            else if (msg.match(/(http(s?):)([/|.|\w|\s|-])*\.(?:gif)/g)) {
                if (!fs.existsSync(dirGif)) fs.mkdirSync(dirGif, { recursive: true });
                return request(msg).pipe(fs.createWriteStream(dirGif + `${event.threadID}.gif`)).on("close", () => api.sendMessage({ body: "Đã lưu file gif của nhóm bạn thành công, bên dưới đây là preview:", attachment: fs.createReadStream(dirGif + `${event.threadID}.gif`) }, event.threadID))
            }
        }
        break;
        case "leaveGif": {
            const request = require("request");
            const fs = require("fs-extra");
            let msg = args.slice(1, args.length).join(" ");
            let dirGif = __dirname + `/../events/cache/leaveGif/`;
            console.log(msg);
            if (msg == "reset") {
                if (!fs.existsSync(dirGif)) fs.mkdirSync(dirGif, { recursive: true });
                if (!fs.existsSync(dirGif + `${event.threadID}.gif`)) return api.sendMessage("Bạn chưa cài đặt file gif cho nhóm!", event.threadID);
                fs.unlinkSync(dirGif + `${event.threadID}.gif`);
                return api.sendMessage("Đã gỡ bỏ thành công file gif của nhóm bạn!", event.threadID);
            }
            else if (msg.match(/(http(s?):)([/|.|\w|\s|-])*\.(?:gif)/g)) {
                if (!fs.existsSync(dirGif)) fs.mkdirSync(dirGif, { recursive: true });
                return request(msg).pipe(fs.createWriteStream(dirGif + `${event.threadID}.gif`)).on("close", () => api.sendMessage({ body: "Đã lưu file gif của nhóm bạn thành công, bên dưới đây là preview:", attachment: fs.createReadStream(dirGif + `${event.threadID}.gif`) }, event.threadID))
            }
        }
        break;
        case "rankupGif": {
            const request = require("request");
            const fs = require("fs-extra");
            let msg = args.slice(1, args.length).join(" ");
            let dirGif = __dirname + `/cache/rankup/`;
            console.log(msg);
            if (msg == "reset") {
                if (!fs.existsSync(dirGif)) fs.mkdirSync(dirGif, { recursive: true });
                if (!fs.existsSync(dirGif + `${event.threadID}.gif`)) return api.sendMessage("Bạn chưa cài đặt file gif cho nhóm!", event.threadID);
                fs.unlinkSync(dirGif + `${event.threadID}.gif`);
                return api.sendMessage("Đã gỡ bỏ thành công file gif của nhóm bạn!", event.threadID);
            }
            else if (msg.match(/(http(s?):)([/|.|\w|\s|-])*\.(?:gif)/g)) {
                if (!fs.existsSync(dirGif)) fs.mkdirSync(dirGif, { recursive: true });
                return request(msg).pipe(fs.createWriteStream(dirGif + `${event.threadID}.gif`)).on("close", () => api.sendMessage({ body: "Đã lưu file gif của nhóm bạn thành công, bên dưới đây là preview:", attachment: fs.createReadStream(dirGif + `${event.threadID}.gif`) }, event.threadID))
            }
            else if (!msg.match(/(http(s?):)([/|.|\w|\s|-])*\.(?:gif)/g)) return utils.throwError("custom", event.threadID, event.messageID);
            else return utils.throwError("custom", event.threadID, event.messageID);
        }
        break;
        default:
            utils.throwError("custom", event.threadID, event.messageID);
        break;
    }
}
