let db = require("../config/dbConfig");

class refrenceFormNum {
  getRefrenceFormNumFromFormID(formId, callback) {
    let query = `SELECT repeatFormNumber FROM study_forms  WHERE formId = ${formId} `;
    db.query(query, (err, result) => {
      if (err) {
        return callback(false);
      }
      //   console.log("IN GETTALLY");
      //   console.log(participantID);
      console.log(result[0].repeatFormNumber);
      //   console.log(typeof result[0].tally);
      return callback(result[0].repeatFormNumber);
    });
  }
}
const RefrenceFormNum = new refrenceFormNum();
module.exports = RefrenceFormNum;
