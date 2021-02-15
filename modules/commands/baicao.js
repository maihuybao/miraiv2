module.exports.config = {
	name: "baicao",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "CatalizCS",
	description: "Game bài cào dành cho nhóm",
	commandCategory: "games",
	usages: "baicao [args]",
	cooldowns: 1,
	info: [
		{
			key: "args",
			prompt: "create, start, list, join, leave"
		},
		{
			key: "không cần prefix",
			prompt: "chia bài, đổi bài, ready, nonready"
		}
	]
};

module.exports.event = async ({ event, api, client }) => {
	let { senderID, threadID, body } = event;
	if (!client.baicao) client.baicao = new Map();
	if (!client.baicao.has(threadID)) return;
	let values = client.baicao.get(threadID);
	if (values.start != 1) return;
	if (body.indexOf("chia bài") == 0) {
		if (values.chiabai == 1) return;
		for(var i = 0; i < values.player.length; i++) {
			let card1 = Math.floor(Math.random() * (9 - 1 + 1)) + 1;
			let card2 = Math.floor(Math.random() * (9 - 1 + 1)) + 1;
			let card3 = Math.floor(Math.random() * (9 - 1 + 1)) + 1;
			let tong = (card1+card2+card3);
			if (tong >= 20) tong -= 20;
			if (tong >= 10) tong -= 10;
			values.player[i].card1 = card1;
			values.player[i].card2 = card2;
			values.player[i].card3 = card3;
			values.player[i].tong = tong;
			api.sendMessage(`Bài của bạn: ${card1} | ${card2} | ${card3} \n\nTổng bài của bạn: ${tong}`, values.player[i].id);
		}
		values.chiabai = 1;
		client.baicao.set(event.threadID, values);
		return api.sendMessage("Bài đã được chia thành công! tất cả mọi người đều có 2 lượt đổi bài", threadID);
	}
	if (body.indexOf("đổi bài") == 0) {
		if (values.chiabai != 1) return;
		let player = values.player.find(item => item.id == senderID);
		if (player.doibai == 0) return api.sendMessage("Bạn đã sử dụng toàn bộ lượt đổi bài", threadID);
		if (player.ready == true) return api.sendMessage("Bạn đã ready, bạn không thể đổi bài!", threadID);
		let card = ["card1","card2","card3"];
		player[card[(Math.floor(Math.random() * card.length))]] = Math.floor(Math.random() * (9 - 1 + 1)) + 1;
		player.tong = (player.card1+player.card2+player.card3);
		if (player.tong >= 20) player.tong -= 20;
		if (player.tong >= 10) player.tong -= 10;
		player.doibai -= 1;
		client.baicao.set(values);
		return api.sendMessage(`Bài của bạn sau khi được đổi: ${player.card1} | ${player.card2} | ${player.card3} \n\nTổng bài của bạn: ${player.tong}`, player.id);
	}
	if (body.indexOf("ready") == 0) {
		if (values.chiabai != 1) return;
		let player = values.player.find(item => item.id == senderID);
		if (player.ready == true) return;
		values.ready += 1;
		player.ready = true;
		api.sendMessage(`Người chơi: ${player.id} Đã sẵn sàng lật bài, còn lại: ${values.player.length - values.ready} người chơi chưa lật bài`, event.threadID);
		if (values.player.length == values.ready) {
			let player = values.player;
			player.sort((a, b) => {
				if (a.tong > b.tong) return -1;
				if (a.tong < b.tong) return 1;
				if (a.id > b.id) return 1;
				if (a.id < b.id) return -1;
			});
			let ranking = "";
			let num = 0;
			for (const info of player) {
				num++
				var name;
				try {
					name = Users.getData(info.id).name;	
				}
				catch {
					name = (await api.getUserInfo(info.id))[info.id].name;
				}
				ranking += `${num} • ${name} Với ${info.tong} nút\n`
			}
			client.baicao.delete(threadID);
			return api.sendMessage(
				"Kết quả" +
				"\n" + ranking
			,threadID);
		}
		else return
	}
	if (body.indexOf("nonready") == 0) {
		let data = values.player.filter(item => item.ready == false);
		let msg = "";
		for (const info of data) {
			var name;
			try {
				name = Users.getData(info.id).name;	
			}
			catch {
				name = (await api.getUserInfo(info.id))[info.id].name;
			}
			msg += name + ", ";
		}
		return api.sendMessage("Những người chơi chưa ready bao gồm: " + msg, threadID);
	}
}

module.exports.run = async ({ api, event, args, client, utils }) => {
	if (!client.baicao) client.baicao = new Map();
	let values = client.baicao.get(event.threadID);
	if (args[0] == "create") {
		if (client.baicao.has(event.threadID)) return api.sendMessage("Hiện tại nhóm này đang có bàn bài cào đang được mở", event.threadID, event.messageID);
		client.baicao.set(event.threadID, { "author": event.senderID, "start": 0, "chiabai": 0, "ready": 0, player: [ { "id": event.senderID, "card1": 0, "card2": 0, "card3": 0, "doibai": 2, "ready": false } ] });
		return api.sendMessage("Bàn bài cào của bạn đã được tạo thành công!, để tham gia bạn hãy nhập baicao join", event.threadID, event.messageID);
	}
	else if (args[0] == "join") {
		if (!values) return api.sendMessage("Hiện tại chưa có bàn bài cào nào, bạn có thể tạo bằng cách sử dụng baicao create", event.threadID, event.messageID);
		if (values.start != 0) return api.sendMessage("Hiện tại bàn bài cào đã được bắt đầu", event.threadID, event.messageID);
		if (values.player.find(item => item.id == event.senderID)) return api.sendMessage("Bạn đã tham gia vào bàn bài cào này!", event.threadID, event.messageID);
		values.player.push({ "id": event.senderID, "card1": 0, "card2": 0, "card3": 0, "tong": 0, "doibai": 2, "ready": false });
		client.baicao.set(event.threadID, values);
		return api.sendMessage("Bạn đã tham gia thành công!", event.threadID, event.messageID);
	}
	else if (args[0] == "list") {
		if (!values) return api.sendMessage("Hiện tại chưa có bàn bài cào nào, bạn có thể tạo bằng cách sử dụng baicao create", event.threadID, event.messageID);
		return api.sendMessage(
			"=== Bàn Bài Cào ===" +
			"\n Author Bàn: " + values.author +
			"\nTổng số người chơi: " + values.player.length + " Người"
		, event.threadID, event.messageID);
	}
	else if (args[0] == "leave") {
		if (!values) return api.sendMessage("Hiện tại chưa có bàn bài cào nào, bạn có thể tạo bằng cách sử dụng baicao create", event.threadID, event.messageID);
		if (!values.player.some(item => item.id == event.senderID)) return api.sendMessage("Bạn chưa tham gia vào bàn bài cào trong nhóm này!", event.threadID, event.messageID);
		if (values.author == event.senderID) {
			client.baicao.delete(event.threadID);
			api.sendMessage("Author đã rời khỏi bàn, đồng nghĩa với việc bàn sẽ bị giải tán!", event.threadID, event.messageID);
		}
		else {
		values.player.splice(values.player.findIndex(item => item.id === event.senderID), 1);
		api.sendMessage("Bạn đã rời khỏi bàn bài cào này!", event.threadID, event.messageID);
		client.baicao.set(event.threadID, values);
		}
		return;
	}
	else if (args[0] == "start" && values.author == event.senderID) {
		if (!values) return api.sendMessage("Hiện tại chưa có bàn bài cào nào, bạn có thể tạo bằng cách sử dụng baicao create", event.threadID, event.messageID);
		if (values.player.length <= 1) return api.sendMessage("Hiện tại bàn của bạn không có người chơi nào tham gia, bạn có thể mời người đấy tham gia bằng cách yêu cầu người chơi khác nhập baicao join", event.threadID, event.messageID);
		if (values.start == 1) return api.sendMessage("Hiện tại bàn đã được bắt đầu bởi chủ bàn", event.threadID, event.messageID);
		values.start += 1;
		return api.sendMessage("Bàn bài cào của bạn được bắt đầu", event.threadID, event.messageID);
	}
	else if (args[0] == "test" && values.author == event.senderID) {
		if (!values) return api.sendMessage("Hiện tại chưa có bàn bài cào nào, bạn có thể tạo bằng cách sử dụng baicao create", event.threadID, event.messageID);
		if (!values.player.some(item => item.id == event.senderID)) return api.sendMessage("Bạn chưa tham gia vào bàn bài cào trong nhóm này!", event.threadID, event.messageID);
		if (values.player.length <= 1) return api.sendMessage("Hiện tại bàn của bạn không có người chơi nào tham gia, bạn có thể mời người đấy tham gia bằng cách yêu cầu người chơi khác nhập baicao join", event.threadID, event.messageID);
		values.player.forEach(info => {
			api.sendMessage("Bạn có thấy tin nhắn này?", info.id);
		})
		return api.sendMessage("Bạn có thấy tin nhắn của bot gửi tới bạn? Nếu không, hãy kiểm tra phần tin nhắn chờ hoặc tin nhắn spam!", event.threadID, event.messageID);
	}
	else return utils.throwError("baicao", event.threadID, event.messageID);
}