let db = require('../config/dbConfig');

class ParticipantModel {
  insert(data, success, failure) {
    let sql = 'INSERT INTO participants (id, gender, birthyear, city, state, country) VALUES (?,?,?,?,?,?)';
    db.query(sql, [data.id, data.gender, data.birthyear, data.city, data.state, data.country], (err, status, fields) => {
      if(err) {
        return failure(err.message);
      }

      if(status.affectedRows == 1) {
        return success(status.insertId)
      }
      else {
        return failure('Database operation failed.');
      }
    });
  }

  getParticipantById(id, success, notFound, failure) {
    db.query('SELECT * FROM participants WHERE id = ? LIMIT 1',[id], (err, rows, fields) => {
      if (err) {
        return failure(err.message);
      }
      if(rows.length > 0) {
        return success(rows[0]);
      } else {
        return notFound(false);
      }
    });
  }

  getAllParticipants(success, failure) {
    db.query('SELECT id, gender, birthYear, city, state, country, status FROM participants', (err, rows, fields) => {
      if(err) {
        return failure(err.message);
      }
      if (rows.length > 0) {
        return success(rows);
      }
      return success([]);
    });
  }

  getParticipantByEmail(email, success, notFound, failure) {
    db.query('SELECT * FROM participants WHERE email = ? LIMIT 1',[email], (err, rows, fields) => {
      if(err) {
        return failure(err.message);
      }
      if(rows.length > 0) {
        return success(rows[0]);
      } else {
        return notFound('No participant found');
      }
    });
  }

  deleteParticipant(id, success, failure) {
    db.query('DELETE FROM participants WHERE id = ? LIMIT 1', [id], (err, status, fields) => {
      if(err) {
        return failure(err.message);
      }
      return success({message: 'Successfully Deleted'});
    });
  }

  updateParticipant(id, field, value, success, failure) {
    db.query('UPDATE participants SET `' + field + '` = ? WHERE id = ? LIMIT 1', [value, id], (err, status, fields) => {
      if(err) {
        return failure(err.message);
      }

      if(status.affectedRows == 1)
        return success(true);
      else
        return failure('Record not updated.');
    });
  }

  updateParticipantProfile(data, success, failure) {
    db.query('UPDATE participants SET firstName = ?, lastName = ?, phone = ?, city = ?, state = ?, country = ? WHERE id = ?',
    [data.firstName, data.lastName, data.phone, data.city, data.state, data.country, data.participantId],
    (err, status, fields) => {
      if(err) {
        return failure(err.message);
      }
      if(status.affectedRows === 1)
        return success();
      else
        return failure('Record not updated.');
    });
  }

  removeRegisteredDevice(deviceId, callBack) {
    db.query('DELETE FROM notification_devices WHERE notificationToken = ?', [deviceId], (err, status, fields) => {
      if(err) {
        return callBack({status: 0, message: err.message});
      }
      return callBack({status: 1});
    });
  }

  registerDeviceToken(data, callBack) {
    let sql = 'INSERT INTO notification_devices (participantId, notificationToken) VALUES (?,?)';
    db.query(sql, [data.participantId, data.notificationToken], (err, status, fields) => {
      if(err) {
        return callBack({status: 0, message: err.message});
      }

      if(status.affectedRows == 1) {
        return callBack({status: 1, insertedId: status.insertId})
      }
      else {
        return callBack({status : 0, message: "Database operation failed."});
      }
    });
  }

  getAllDeviceTokens(callBack) {
    db.query('SELECT * FROM notification_devices', (err, rows, fields) => {
      if(err) {
        return callBack({status: 0, message: err.message});
      }

      if (rows.length > 0) {
        return callBack({status: 1, data: rows});
      } else {
        return callBack({status: 1, data: []});
      }
    });
  }
}

const participantModel = new ParticipantModel();
module.exports = participantModel;
