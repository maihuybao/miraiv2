module.exports = function({ api, __GLOBAL }) {

	async function getThreadInfo(threadID) {
		return await api.getThreadInfo(threadID);
	}
	return {
		getThreadInfo
	}
}