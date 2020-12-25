const logger = require("../../utils/log.js");
module.exports = function ({ models, api, __GLOBAL }) {
	const User = models.use('user');

	async function getInfo(id) {
		return (await api.getUserInfo(id))[id];
	}

	async function getAll(...data) {
		var where, attributes;
		for (let i of data) {
			if (typeof i != 'object') throw 'Phải là 1 Array hoặc Object hoặc cả 2.';
			if (Array.isArray(i)) attributes = i;
			else where = i;
		}
		try {
			return (await User.findAll({ where, attributes })).map(e => e.get({ plain: true }));
		}
		catch (err) {
			logger(err, 2);
			return [];
		}
	}

	async function getData(userID, value) {
		return (await User.findOne({ where: { userID } })).get({ plain: true })[value];
	}

	async function setData(userID, options = {}) {
		try {
			(await User.findOne({ where: { userID } })).update(options);
			return true;
		}
		catch (e) {
			logger(err, 2);
			return false;
		}
	}

	async function delData(userID) {
		return (await User.findOne({ where: { userID } })).destroy();
	}

	async function createData({ userID, defaults }) {
		if (typeof defaults != 'object') throw 'Phải là 1 Array hoặc Object hoặc cả 2.';
		try {
			(await thread.findOrCreate({ where: { userID }, defaults }))
			return true;
		}
		catch (e) {
			logger(err, 2);
			return false;
		}
	}

	return {
		getInfo,
		getAll,
		getData,
		setData,
		delData,
		createData
	}

}