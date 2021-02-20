module.exports.config = {
	name: "osu", // Tên lệnh, được sử dụng trong việc gọi lệnh
	version: "1.0.0", // phiên bản của module này
	hasPermssion: 0, // Quyền hạn sử dụng, với 0 là toàn bộ thành viên, 1 là quản trị viên trở lên, 2 là admin/owner
	credits: "BerVer", // Công nhận module sở hữu là ai
	description: "Kiểm trang thông tin người dùng ", // Thông tin chi tiết về lệnh
	commandCategory: "games", // Thuộc vào nhóm nào
	usages: "osu [Tên]", // Cách sử dụng lệnh
	cooldowns: 5, // Thời gian một người có thể lặp lại lệnh
	dependencies: ["fs","request"], //Liệt kê các package module ở ngoài tại đây để khi load lệnh nó sẽ tự động cài!
	// Info là phần chi tiết thêm của cách sử dụng lệnh
	// Key: Từ khoá thuộc trong usages
	// prompt: Chi tiết dữ liệu đầu vào của key
	// type: Định dạng dữ liệu đầu vào của key
	// example: Ví dụ ¯\_(ツ)_/¯ 
	info: [
		{
			key: 'Text1',
			prompt: '',
			type: 'Văn Bản',
			example: 'osu Ber'
		},
	],
	envConfig: {
		//Đây là nơi bạn sẽ setup toàn bộ env của module, chẳng hạn APIKEY, ...
	}
};
module.exports.run = function({ api, event, args, client, __GLOBAL }) {
	//Làm cái gì ở đây tuỳ thuộc vào bạn ¯\_(ツ)_/¯ 
	if (!args.join(" ")) return api.sendMessage("Bạn chưa nhập tên", event.threadID, event.messageID)
return require("request")(`http://lemmmy.pw/osusig/sig.php?colour=hex8866ee&uname=${args.join(" ")}&pp=1&countryrank&rankedscore&onlineindicator=undefined&xpbar&xpbarhex`).pipe(require("fs").createWriteStream(__dirname + `/cache/osu!.png`)).on("close", () => api.sendMessage({ attachment: require("fs").createReadStream(__dirname + `/cache/osu!.png`) }, event.threadID, () => require("fs").unlinkSync(__dirname + `/cache/osu!.png`), event.messageID))
}		