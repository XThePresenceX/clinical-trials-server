let db = require("../config/dbConfig");
let TallyModel = require("../models/tallyModel");

class StudyParticipantFormModel {
  getIdByIds(participantId, studyId, formId, success, failure) {
    db.query(
      "SELECT id FROM study_participant_form WHERE studyId = ? AND participantId = ? AND formId =? LIMIT 1",
      [studyId, participantId, formId],
      (error, rows, next) => {
        if (error) {
          return failure(error.message);
        }
        if (rows.length > 0) {
          return success(rows[0].id);
        } else {
          return success(0);
        }
      }
    );
  }

  postStudyParticipantForm(studyId, participantId, formId, success, failure) {
    db.query(
      "INSERT INTO study_participant_form (studyId, formId, participantId, status) VALUES(?, ?, ?, ?)",
      [studyId, formId, participantId, "PENDING"],
      (error, results, fields) => {
        if (error) {
          return failure(error.message);
        }
        if (results.affectedRows > 0) {
          return success({
            id: results.insertId,
            studyId,
            participantId,
            formId,
          });
        }
        return failure("Unable to add study participant form");
      }
    );
  }

  postMultipleStudyParticipantForm(
    studyId,
    participantIds,
    formIds,
    success,
    failure
  ) {
    let values = "";
    formIds.forEach((formId) =>
      participantIds.forEach((participantId) => {
        //console.log("Value is ", values);
        if (values !== "") {
          // console.log("Value2 is ", values);
          values += ",";
        }
        if (formId.formNumber === 0) {
          //console.log("Value3 is ", values);
          values += `(${studyId}, ${formId.formId}, ${participantId}, 'PENDING')`;
        } else {
          // console.log("Value4 is ", values);
          values += `(${studyId}, ${formId.formId}, ${participantId}, 'WAITING')`;
        }
      })
    );
    db.query(
      `INSERT INTO study_participant_form (studyId, formId, participantId, status) VALUES ${values}`,
      (error, results, fields) => {
        if (error) {
          return failure(error.message);
        }
        if (results.affectedRows > 0) {
          return success(true);
        }
        return failure("Unable to add study participant form");
      }
    );
  }

  updateStatus(participantId, studyId, formId, status, success, failure) {
    // if (status == "REPLIED") {
    //   TallyModel.getAndUpdateTally(participantId);
    // }
    db.query(
      `UPDATE study_participant_form SET status = '${status}' WHERE studyId = ? AND formId = ? AND participantId = ? AND status != 'REJECTED'`,
      [studyId, formId, participantId],
      (error, results, fields) => {
        if (error) {
          return failure(error.message);
        }
        if (results.affectedRows > 0) {
          return success(true);
        }
        return failure("Unable to update row. Maybe its too late.");
      }
    );
  }

  updateStatusPendingForms(participantId, studyId, status, success, failure) {
    // if (status == "REPLIED") {
    //   TallyModel.getAndUpdateTally(participantId);
    // }
    db.query(
      `UPDATE study_participant_form SET status = '${status}' WHERE studyId = ? AND participantId = ? AND status = 'PENDING'`,
      [studyId, participantId],
      (error, results, fields) => {
        if (error) {
          return failure(error.message);
        }
        return success(true);
      }
    );
  }

  resetStudy(participantId, studyId, success, failure) {
    db.query(
      `UPDATE study_participant_form SET status = 'WAITING' WHERE studyId = ? AND participantId = ?`,
      [studyId, participantId],
      (error, results, fields) => {
        if (error) {
          return failure(error.message);
        }
        TallyModel.getAndUpdateTally(participantId);
        return success(true);
      }
    );
  }
}

const studyParticipantFormModel = new StudyParticipantFormModel();
module.exports = studyParticipantFormModel;
