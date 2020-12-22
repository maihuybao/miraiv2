const { writeFileSync, readFileSync } = require("fs-extra");
const logger = require("./log.js")

module.exports = function({ api, __GLOBAL, client }) {
	async function getThreadInfo(threadID) {
		return await api.getThreadInfo(threadID);
	}

	return {
		getThreadInfo
	}
}