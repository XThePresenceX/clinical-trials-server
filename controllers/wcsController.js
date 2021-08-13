let Helper = require('../helpers/general');
let db = require('../config/dbConfig');
let Mail = require('../helpers/mail')

module.exports.join = (req, res, next) => {
	let requiredParameters = ['name', 'email', 'study'];
	if (Helper.verifyRequiredParams(req.body, res, requiredParameters)) {
		const {name, email, study} = req.body;

		console.log(req.body);

		// write data to table here ..
		let query = 'INSERT INTO wcs_participant (name, email, study) VALUES (?,?,?)';
		db.query(query, [name, email, study], (err, status, fields) => {
			if (err) {
				return res.status(500).json({
					status: 500,
					message: "DB_WRITE_ERROR"
				});
			}

			if (status.affectedRows == 1) {
				// send confirmation email here ..
				let emailData = {
					path: '../views/emails/wcsJoin.hbs',
					subject: 'Women Cannabis Study - Welcome!',
					email: email,
					name: name,
					text: 'Welcome!'
				}
				Mail.sendEmail(emailData);
				return res.status(200).json({
					status: 200,
					message: "ok"
				});
			}
			else {
				return res.status(500).json({
					status: 500,
					message: "DB_WRITE_ERROR"
				});
			}
		})
	}
}

module.exports.contact = (req, res, next) => {
	let requiredParameters = ['name', 'address', 'email', 'reason', 'message'];
	console.log(req.body);
	if (Helper.verifyRequiredParams(req.body, res, requiredParameters)) {
		const { name, address, email, reason, message } = req.body;

		// write data to table here ..
		let query = 'INSERT INTO wcs_contact (name, address, email, reason, message) VALUES (?,?,?,?,?)';
		db.query(query, [name, address, email, reason, message], (err, status, fields) => {
			if (err) {
				return res.status(500).json({
					status: 500,
					message: "DB_WRITE_ERROR"
				});
			}

			if (status.affectedRows == 1) {
				return res.status(200).json({
					status: 200,
					message: "ok"
				});
			}
			else {
				return res.status(500).json({
					status: 500,
					message: "DB_WRITE_ERROR"
				});
			}
		})

	}
}

module.exports.vctcontact = (req, res, next) => {
	let requiredParameters = ['name', 'address', 'email', 'reason', 'message'];
	console.log(req.body);
	if (Helper.verifyRequiredParams(req.body, res, requiredParameters)) {
		const { name, address, email, reason, message } = req.body;

		// write data to table here ..
		let query = 'INSERT INTO vct_contact (name, address, email, reason, message) VALUES (?,?,?,?,?)';
		db.query(query, [name, address, email, reason, message], (err, status, fields) => {
			if (err) {
				console.log(err);
				return res.status(500).json({
					status: 500,
					message: "DB_WRITE_ERROR"
				});
			}

			if (status.affectedRows == 1) {
				return res.status(200).json({
					status: 200,
					message: "ok"
				});
			}
			else {
				return res.status(500).json({
					status: 500,
					message: "DB_WRITE_ERROR"
				});
			}
		})

	}
}
