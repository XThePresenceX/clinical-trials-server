let db = require('../config/dbConfig');

class WalletModel {
  updateWallet(data, callBack) {
    let sql = 'INSERT INTO wallet (participantId, studyId, cashishPoints) VALUES (?,?,?)';
    db.query(sql, [data.participantId, data.studyId, data.cashishPoints], (err, status, fields) => {
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

  checkStudyWallet(participantId, studyId, callBack) {
    db.query('SELECT * FROM wallet WHERE participantId = ? AND studyId = ? LIMIT 1',[participantId, studyId], (err, rows, fields) => {
      if(rows.length > 0) {
        return callBack(true);
      } else {
        return callBack(false);
      }
    });
  }

  getParticipantWallet(participantId, callBack) {
    db.query('SELECT sum(cashishPoints) as totalCashishPoints from wallet WHERE participantId = ?', [participantId], (err, rows, fields) => {
      if(err) {
        return callBack({status: 0, message: err.message});
      }
      let cashishPoints = 0;
      if(rows.length > 0) {
        cashishPoints = rows[0].totalCashishPoints? rows[0].totalCashishPoints: 0 ;
      }
      return callBack({status: 1, cashishPoints: cashishPoints});
    });
  }
}

const walletModel = new WalletModel();
module.exports = walletModel;
