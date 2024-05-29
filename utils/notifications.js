const sequelize = require("../../config/database");

const gcm = require("node-gcm");
const { getDate } = require("./time");
const Sequelize = require("sequelize");

module.exports = {
	notification: async function (body, subject) {
		try {
			const sender = new gcm.Sender(process.env.GCMSENDER),
				createdDate = getDate("YYYY-MM-DD HH:mm:ss");

			const message = new gcm.Message({
				notification: {
					title: subject,
					body: body,
				},
			});

			sender.send(
				message,
				{
					registrationTokens: fcm,
				},
				async function (error, response) {
					if (error) {
						console.log(error);
					} else {
						console.log(response);
					}
				}
			);
		} catch (error) {
			console.log(error);
		}
	},
};
