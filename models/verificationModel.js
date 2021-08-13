let userDb = require('../config/userDBConfig');
const { v4: uuidv4 } = require('uuid');

module.exports.createEmailVerificationEntry = (userId, createEmailVerificationEntrySuccess, createEmailVerificationEntryFailure) => {
    const emailToken = uuidv4();
    const sql = `INSERT INTO email_verification (userId, emailToken, emailVerificationStatus, createdDateTime) 
        VALUES(${userId}, "${emailToken}", false, "${new Date().toISOString()}")`;
    console.log(sql);
    userDb.query(sql, (err, status, fields) => {
        if (err) {
            return createEmailVerificationEntryFailure(err.message);
        } else {
            return createEmailVerificationEntrySuccess(emailToken);
        }
    });
}
module.exports.getEmailVerificationStatus = (userId, getEmailVerificationStatusSuccess, getEmailVerificationStatusFailure) => {
    let sql = `SELECT * FROM email_verification WHERE userID = ${userId}`;
    console.log(sql);
    userDb.query(sql, (err, rows) => {
        if (err) {
            return getEmailVerificationStatusFailure(err.message);
        } else {
            return getEmailVerificationStatusSuccess(rows[0]);
        }
    })
}

module.exports.updateEmailVerificationStatus = (userId, emailToken, updateEmailVerificationStatusSuccess, updateEmailVerificationStatusFailure) => {
    this.getEmailVerificationStatus(
        userId, 
        getEmailVerificationStatusSuccess => {
            console.log(emailToken);
            if (emailToken === getEmailVerificationStatusSuccess.emailToken) {
                let sql = `UPDATE email_verification SET emailVerificationStatus = true WHERE userId = ${userId}`;
                userDb.query(sql, (err, status) => {
                    if (err) {
                        return updateEmailVerificationStatusFailure(err.message);
                    } else {
                        return updateEmailVerificationStatusSuccess();
                    }
                })
            }
            else {
                return updateEmailVerificationStatusFailure("Token mismatch");
            }
        }),
        getEmailVerificationStatusFailure => {
            return updateEmailVerificationStatusFailure();
        }
}