let db = require("../config/dbConfig");

class tallyModel {
  insertIntoTally(participantID) {
    let tally = 0;
    let resetTally = 0;
    let tallyContentData = { participantID, tally };
    let tallyContentTallyQuery = "INSERT INTO  tally_participant_forms SET ?";
    db.query(tallyContentTallyQuery, tallyContentData, (err, result) => {
      if (err) {
        throw err;
      }
      return;
    });
  }

  getTallyfromParticipantID(participantID, callback) {
    let query = `SELECT tally FROM tally_participant_forms WHERE participantID = ${participantID} `;
    db.query(query, (err, result) => {
      if (err) {
        return callback(false);
      }
      //   console.log("IN GETTALLY");
      //   console.log(participantID);
      //console.log(result[0].tally);
      //   console.log(typeof result[0].tally);
      return callback(result[0].tally);
    });
  }

  updateTally(participantID, tally) {
    let query = `UPDATE tally_participant_forms SET tally=${tally} WHERE participantID = ${participantID}`;
    db.query(query, (err, result) => {
      if (err) {
        throw err;
      }

      //console.log("IN UPDATETALLY");
      return result;
    });
  }

  getAndUpdateTally(participantID, success, failure) {
    let query = `SELECT tally FROM tally_participant_forms WHERE participantID = ${participantID} `;
    db.query(query, (err, result) => {
      if (err) {
        throw err;
      }
      //   console.log("IN GETTALLY");
      //   console.log(participantID);
      //   console.log(result[0].tally);
      //   console.log(typeof result[0].tally);
      let tally = result[0].tally;
      ++tally;
      //console.log("tally is", tally);
      let query = `UPDATE tally_participant_forms SET tally=${tally} WHERE participantID = ${participantID}`;
      db.query(query, (err, result) => {
        if (err) {
          throw err;
        }
        // console.log("IN UPDATETALLY");
        return;
      });
    });
  }

  getResetTallyfromParticipantID(participantID, callback) {
    let query = `SELECT tally FROM tally_participant_forms WHERE participantID = ${participantID} `;
    db.query(query, (err, result) => {
      if (err) {
        return callback(false);
      }
      //   console.log("IN GETTALLY");
      //   console.log(participantID);
      //console.log(result[0].tally);
      //   console.log(typeof result[0].tally);
      return callback(result[0].resetTally);
    });
  }

  updateResetTally(participantID, resetTally) {
    let query = `UPDATE tally_participant_forms SET resetTally=${resetTally} WHERE participantID = ${participantID}`;
    db.query(query, (err, result) => {
      if (err) {
        throw err;
      }

      //console.log("IN UPDATETALLY");
      return result;
    });
  }

  getAndUpdateResetTally(participantID, success, failure) {
    let query = `SELECT tally FROM tally_participant_forms WHERE participantID = ${participantID} `;
    db.query(query, (err, result) => {
      if (err) {
        throw err;
      }
      //   console.log("IN GETTALLY");
      //   console.log(participantID);
      //   console.log(result[0].tally);
      //   console.log(typeof result[0].tally);
      let resetTally = result[0].resetTally;
      ++tally;
      //console.log("tally is", tally);
      let query = `UPDATE tally_participant_forms SET resetTally=${resetTally} WHERE participantID = ${participantID}`;
      db.query(query, (err, result) => {
        if (err) {
          throw err;
        }
        // console.log("IN UPDATETALLY");
        return;
      });
    });
  }
}

const TallyModel = new tallyModel();
module.exports = TallyModel;
