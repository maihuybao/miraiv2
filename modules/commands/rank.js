module.exports.config = {
	name: "rank",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "SpermLord",
	description: "Lấy rank hiện tại của bạn trên hệ thống bot, remake rank_card from canvacord",
	commandCategory: "System",
	usages: "rank",
	cooldowns: 5,
	dependencies: ["fs-extra","axios","path","canvas","jimp", "request"]
};

const fs = require("fs-extra");
const request = require("request");
let dirMaterial = __dirname + `/cache/rank/`;

if (!fs.existsSync(dirMaterial)) fs.mkdirSync(dirMaterial, { recursive: true });
if (!fs.existsSync(dirMaterial + "fonts")) fs.mkdirSync(dirMaterial + "fonts", { recursive: true });
if (!fs.existsSync(dirMaterial + "rank_card")) fs.mkdirSync(dirMaterial + "rank_card", { recursive: true });

if (!fs.existsSync(dirMaterial + "fonts/regular-font.ttf")) request("https://raw.githubusercontent.com/catalizcs/storage-data/master/rank/fonts/regular-font.ttf").pipe(fs.createWriteStream(dirMaterial + "fonts/regular-font.ttf"));
if (!fs.existsSync(dirMaterial + "fonts/bold-font.ttf")) request("https://raw.githubusercontent.com/catalizcs/storage-data/master/rank/fonts/bold-font.ttf").pipe(fs.createWriteStream(dirMaterial + "fonts/bold-font.ttf"));
if (!fs.existsSync(dirMaterial + "rank_card/rankcard.png")) request("https://raw.githubusercontent.com/catalizcs/storage-data/master/rank/rank_card/rankcard.png").pipe(fs.createWriteStream(dirMaterial + "rank_card/rankcard.png"));


async function makeRankCard(data) {
    
    /*
    * 
    * Remake from Canvacord
    * 
    */

    const fs = require("fs-extra");
    const axios = require("axios");
    const path = require("path");
    const __root = path.resolve(__dirname, "cache", "rank");
    const Canvas = require("canvas");

    const { id, name, rank, level, expCurrent, expNextLevel } = data;

	Canvas.registerFont(__root + "/fonts/regular-font.ttf", {
		family: "Manrope",
		weight: "regular",
		style: "normal"
	});
	Canvas.registerFont(__root + "/fonts/bold-font.ttf", {
		family: "Manrope",
		weight: "bold",
		style: "normal"
	});

	let rankCard = await Canvas.loadImage(__root + "/rank_card/rankcard.png");
	let pathImg = __root + `/rank_card/rank_${id}.png`;

	let avatar = __root + `/rank_card/avt_${id}.png`;
	let getAvatar = (await axios.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=170918394587449|sONjQBBNs316xVD31T-yuL4jfyc`, { responseType: 'arraybuffer' })).data;
	fs.writeFileSync(avatar, Buffer.from(getAvatar, 'utf-8'));

	const canvas = Canvas.createCanvas(934, 282);
	const ctx = canvas.getContext("2d");

	ctx.drawImage(rankCard, 0, 0, canvas.width, canvas.height);
	ctx.drawImage(await Canvas.loadImage(await circle(avatar)), 45, 50, 180, 180);

	ctx.font = `bold 36px Manrope`;
	ctx.fillStyle = "#FFFFFF";
	ctx.textAlign = "start";
	ctx.fillText(name, 270, 164);
	ctx.font = `36px Manrope`;
	ctx.fillStyle = "#FFFFFF";
	ctx.textAlign = "center";

	ctx.font = `bold 32px Manrope`;
	ctx.fillStyle = "#FFFFFF";
	ctx.textAlign = "end";
	ctx.fillText(level, 934 - 55, 82);
	ctx.fillStyle = "#FFFFFF";
	ctx.fillText("Lv.", 934 - 55 - ctx.measureText(level).width - 10, 82);

	ctx.font = `bold 32px Manrope`;
	ctx.fillStyle = "#FFFFFF";
	ctx.textAlign = "end";
	ctx.fillText(rank, 934 - 55 - ctx.measureText(level).width - 16 - ctx.measureText(`Lv.`).width - 25, 82);
	ctx.fillStyle = "#FFFFFF";
	ctx.fillText("#", 934 - 55 - ctx.measureText(level).width - 16 - ctx.measureText(`Lv.`).width - 16 - ctx.measureText(rank).width - 16, 82);

	ctx.font = `bold 26px Manrope`;
	ctx.fillStyle = "#FFFFFF";
	ctx.textAlign = "start";
	ctx.fillText("/ " + expNextLevel, 710 + ctx.measureText(expCurrent).width + 10, 164);
	ctx.fillStyle = "#FFFFFF";
	ctx.fillText(expCurrent, 710, 164);

	let expWidth = (expCurrent * 615) / expNextLevel;
	if (expWidth > 615 - 18.5) expWidth = 615 - 18.5;

	ctx.beginPath();
	ctx.fillStyle = "#4283FF";
	ctx.arc(257 + 18.5, 147.5 + 18.5 + 36.25, 18.5, 1.5 * Math.PI, 0.5 * Math.PI, true);
	ctx.fill();
	ctx.fillRect(257 + 18.5, 147.5 + 36.25, expWidth, 37.5);
	ctx.arc(257 + 18.5 + expWidth, 147.5 + 18.5 + 36.25, 18.75, 1.5 * Math.PI, 0.5 * Math.PI, false);
	ctx.fill();

	const imageBuffer = canvas.toBuffer();
	fs.writeFileSync(pathImg, imageBuffer);
	fs.removeSync(avatar);
	return pathImg;
}

async function circle(image) {
    const jimp = require('jimp');
	image = await jimp.read(image);
	image.circle();
	return await image.getBufferAsync("image/png");
}

function expToLevel(point) {
	if (point < 0) return 0;
	return Math.floor((Math.sqrt(1 + (4 * point) / 3) + 1) / 2);
}

function levelToExp(level) {
	if (level <= 0) return 0;
	return 3 * level * (level - 1);
}

async function getInfo(uid, Currencies) {
	const point = (await Currencies.getData(uid)).exp;
	const level = expToLevel(point);
	const expCurrent = point - levelToExp(level);
	const expNextLevel = levelToExp(level + 1) - levelToExp(level);
	return { level, expCurrent, expNextLevel };
}

module.exports.run = async ({ event, api, args, Currencies, Users }) => {
	const fs = require("fs-extra");
	
	let dataAll = (await Currencies.getAll(["userID", "exp"]));
	console.log(dataAll);
	dataAll.sort((a, b) => {
		if (a.exp > b.exp) return -1;
		if (a.exp < b.exp) return 1;
		if (a.userID > b.userID) return 1;
		if (a.userID < b.userID) return -1;
	});

	if (args.length == 0) {
		let rank = dataAll.findIndex(item => parseInt(item.userID) == parseInt(event.senderID)) + 1;
		let name = Users.getData(event.senderID).name || (await api.getUserInfo(event.senderID))[event.senderID].name;
		if (rank == 0) return api.sendMessage("Bạn hiện không có trong cơ sở dữ liệu nên không thể thấy thứ hạng của mình, vui lòng thử lại sau 5 giây.", event.threadID, event.messageID);
		else getInfo(event.senderID, Currencies)
		.then(point => makeRankCard({ id: event.senderID, name, rank, ...point }))
		.then(path => api.sendMessage({ attachment: fs.createReadStream(path) }, event.threadID, () => fs.unlinkSync(path), event.messageID));
	}
}