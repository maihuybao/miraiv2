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

module.exports.run = async function({ api, event, args, client, __GLOBAL, models }) {
	const { VM } = require("vm2");
	var out = (a) => api.sendMessage(a, event.threadID);
	const vm = new VM({
		eval: false,
		wasm: false,
		timeout: 100,
		console: 'inherit',
		sandbox: { out, api, event, args, client, __GLOBAL, models },
	});
	vm.run(args.join(" "), vm.js);
}