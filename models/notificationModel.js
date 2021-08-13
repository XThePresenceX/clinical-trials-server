let db = require('../config/dbConfig');
const { v4: uuidv4 } = require('uuid');

class NotificationModel {
	getNotificationTokenByParticipantIds(participantIds, success, failure) {
		db.query('SELECT notificationToken FROM notification_devices WHERE participantId in (' + participantIds.join(', ') + ')', (err, rows, fields) => {
			if (err) {
				return failure(err.message);
			}

			if (rows.length > 0) {
				return success(JSON.parse(JSON.stringify(rows)));
			}
			return success([]);
		});
	}

	insertintoContentTracker(notificationDescription, participantId, success, failure) {
		var createdAt = new Date();
		var notificationContentUuid = uuidv4();
		let notificationContentData = { notificationDescription, createdAt, notificationContentUuid };
		let notificationContentInsertQuery = 'INSERT INTO notification_content SET ?';
		db.query(notificationContentInsertQuery, notificationContentData, (err, result) => {
			if (err) {
				return failure(err.message);
			}
			let notificationTrackerData = { participantId, notificationContentUuid };
			let notificationTrackerInsertQuery = 'INSERT INTO notification_tracker SET ?';
			db.query(notificationTrackerInsertQuery, notificationTrackerData, (err, result) => {
				if (err) {
					return failure(err.message);
				}
				return success(true);
			})
		})
	}

	getNotificationContentByParticipantId(participantId, success) {
		let query = `SELECT notification_tracker.id, notification_content.notificationDescription, notification_content.createdAt
      FROM notification_content, notification_tracker
      WHERE notification_tracker.notificationContentUuid = notification_content.notificationContentUuid
	  AND notification_tracker.participantId = ${participantId}
	  ORDER BY notification_content.createdAt DESC`;
		db.query(query, (err, result) => {
			if (err) {
				throw err;
			}
			return success(JSON.parse(JSON.stringify(result)));
		})
	}
}
const notificationModel = new NotificationModel();
module.exports = notificationModel;
