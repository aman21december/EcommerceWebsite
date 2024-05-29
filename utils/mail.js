const nodemailer = require("nodemailer");



module.exports = {
	sendMail: async (recipient, subject, body, attachments = []) => {
		const transporter = nodemailer.createTransport({
			host: process.env.EMAIL_HOST,
			port: process.env.EMAIL_PORT,
			secure: false,
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASSWORD,
			},
		});
		
		transporter.verify(error => {
			if (error) console.error(error);
			else console.log(`Success`);
		});
		try {
			let options = {
				from: `"Govt. Of Bihar" ${process.env.EMAIL_USER}`, // sender address
				to: recipient, // list of receivers
				priority: "high",
				subject: subject,
				html: body,
				attachments,
			};

			transporter.sendMail(options, (error, info) => {
				if (error) console.error(error);

				console.log(info?.messageId);
			});
		} catch (error) {
			console.log(error);
		}
	},
};
