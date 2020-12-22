const logger = require("../modules/log.js");
module.exports = function({ models, api }) {
	const User = models.use('user');

	async function createUser(userID) {
		if (!await User.findOne({ where: { userID } })) {
			let userInfo = await getInfo(userID);
			var name = userInfo.name;
			var [ user, created ] = await User.findOrCreate({ where : { userID }, defaults: { name }});
			if (created) {
				logger(`${name} - ${userID}`, 'New User');
				return true;
			}
			else return false;
		}
		else return;
	}

	async function getInfo(id) {
		return (await api.getUserInfo(id))[id];
	}

	async function setUser(userID, options = {}) {
		try {
			(await User.findOne({ where: { userID } })).update(options);
			return true;
		}
		catch (err) {
			logger(err, 2);
			return false;
		}
	}

	async function delUser(userID) {
		return (await User.findOne({ where: { userID } })).destroy();
	}

	async function getUsers(...data) {
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

	async function getName(userID) {
		return (await User.findOne({ where: { userID } })).get({ plain: true }).name;
	}

	async function getGender(userID) {
		return (await getInfo(userID)).gender;
	}

	async function unban(userID, block = false) {
		try {
			await createUser(userID);
			(await User.findOne({ where: { userID } })).update({ block });
			return true;
		}
		catch (err) {
			logger(err, 2);
			return false;
		}
	}

	async function ban(userID) {
		return await unban(userID, true);
	}

	return {
		createUser,
		getInfo,
		setUser,
		delUser,
		getUsers,
		getName,
		getGender,
		unban,
		ban
	}
}