const logger = require("../../utils/log.js");

module.exports = function ({ models, api }) {
	const Users = models.use('Users');

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
			return (await Users.findAll({ where, attributes })).map(e => e.get({ plain: true }));
		}
		catch (err) {
			logger(err, 2);
			return [];
		}
	}

	async function getData(userID) {
		const data = await Users.findOne({ where: { userID } });
		if (data) return data.get({ plain: true });
		else return false;
	}

	async function setData(userID, options = {}) {
		if (typeof options != 'object' && !Array.isArray(options)) throw 'Phải là 1 Object.';
		try {
			(await Users.findOne({ where: { userID } })).update(options);
			return true;
		}
		catch (e) {
			logger(e, 2);
			return false;
		}
	}

	async function delData(userID) {
		return (await Users.findOne({ where: { userID } })).destroy();
	}

	async function createData(userID, defaults = {}) {
		if (typeof defaults != 'object' && !Array.isArray(defaults)) throw 'Phải là 1 Object.';
		try {
			await Users.findOrCreate({ where: { userID }, defaults });
			return true;
		}
		catch (e) {
			logger(e, 2);
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