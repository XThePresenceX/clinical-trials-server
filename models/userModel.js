const db2 = require('../config/userDBConfig');

class UserModel {
  getUserByEmail(email, success, failure) {
    db2.query('SELECT * FROM user_profile WHERE email = ? LIMIT 1',[email], (err, rows, fields) => {
      if (err) {
        return failure(err.message)
      }
      if(rows.length > 0) {
        return success(rows[0]);
      } else {
        return failure('No records found');
      }
    });
  }

  getUserByPasswordToken(passwordToken, success, failure) {
    db2.query('SELECT * FROM user_profile WHERE forgotPasswordToken = ? LIMIT 1',[passwordToken], (err, rows, fields) => {
      if(err) {
        return failure(err.message);
      }
      if(rows.length > 0) {
        return success(rows[0]);
      } else {
        return failure('Something went wrong.');
      }
    });
  }

  updateUser(id, field, value, success, failure) {
    db2.query('UPDATE user_profile SET `' + field + '` = ? WHERE id = ? LIMIT 1', [value, id], (err, status, fields) => {
      if(err) {
        return failure(err.message);
      }

      if(status.affectedRows == 1)
        return success(true);
      else
        return failure('Record not updated.');
    });
  }

  updateUserPassword(id, hash, success, failure) {
    db2.query('UPDATE user_profile SET password = ?, forgotPasswordToken = ? WHERE id = ? LIMIT 1',
    [hash, '', id], (err, status, fields) => {
      if(err) {
        return failure(err.message);
      }

      if(status.affectedRows == 1)
        return success(true);
      else
        return failure('Record not updated.');
    });
  }
}

const userModel = new UserModel();
module.exports = userModel;
