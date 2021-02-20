module.exports.config = {
	name: "addlinkword", // Tên lệnh, được sử dụng trong việc gọi lệnh
	version: "1.0.0", // phiên bản của module này
	hasPermssion: 0, // Quyền hạn sử dụng, với 0 là toàn bộ thành viên, 1 là quản trị viên trở lên, 2 là admin/owner
	credits: "BerVer", // Công nhận module sở hữu là ai
	description: "Nối từ với Bot", // Thông tin chi tiết về lệnh
	commandCategory: "group", // Thuộc vào nhóm nào
	usages: "addlinkword [từ]", // Cách sử dụng lệnh
	cooldowns: 1, // Thời gian một người có thể lặp lại lệnh
	dependencies: ["axios"], //Liệt kê các package module ở ngoài tại đây để khi load lệnh nó sẽ tự động cài!
	// Info là phần chi tiết thêm của cách sử dụng lệnh
	// Key: Từ khoá thuộc trong usages
	// prompt: Chi tiết dữ liệu đầu vào của key
	// type: Định dạng dữ liệu đầu vào của key
	// example: Ví dụ ¯\_(ツ)_/¯ 
	info: [
		{
			key: 'Từ',
			prompt: '',
			type: 'Văn Bản',
			example: 'addlinkword ngốc nghếch'
		},
	],
	envConfig: {
		//Đây là nơi bạn sẽ setup toàn bộ env của module, chẳng hạn APIKEY, ...
	}
};
module.exports.run = async function({ api, event, args, client, __GLOBAL }) {
	//Làm cái gì ở đây tuỳ thuộc vào bạn ¯\_(ツ)_/¯ 
    const axios = require("axios");
    var a = (await axios.get(`https://api.simsimi.tk/api/linkword?add=${encodeURIComponent(args.join(" "))}`)).data;
    var out = (msg) => api.sendMessage(msg, event.threadID, event.messageID);
    out(a.text)
}

