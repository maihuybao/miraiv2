module.exports.config = {
	name: "run",
	version: "1.0.0",
	hasPermssion: 1,
	credits: "CatalizCS",
	description: "running shell",
	commandCategory: "general",
	usages: "run",
	cooldowns: 5,
	dependencies: ["vm2","path"]
};

module.exports.run = async function({ api, event, args, __client, __GLOBAL }) {
	const { VM } = require("vm2");
	var out = "";
	const vm = new VM({
		eval: false,
		wasm: false,
		timeout: 100,
		console: 'inherit',
		sandbox: { out, api, event, args, __client, __GLOBAL },
	});
	const returnValue = vm.run(args.join(" "), vm.js);
	return api.sendMessage(out, event.threadID, event.messageID);
}