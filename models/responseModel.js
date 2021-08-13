let db = require('../config/dbConfig');

class ResponseModel {
  getResponses(success, failure) {
      db.query(`SELECT spf.studyId, spf.formId, spf.participantId, GROUP_CONCAT(CONCAT('{"id":"', fq.id,'","question":"',fq.questionText,'"}')) as questions`
      + ', r.data as answers FROM responses r JOIN study_participant_form spf ON spf.id = r.spf_id '
      + 'JOIN form_questions fq ON fq.formId = spf.formId GROUP BY spf.id, spf.studyId, spf.formId, spf.participantId, r.data',  (err, rows, fields) => {
        if(err) {
          return failure(err.message);
        }
        if(rows.length>0){
          return success(rows);
        }
        return success([]);
      });
  }

  addResponse(studyFormParticipantId, body, success, failure) {
    db.query('INSERT INTO responses (spf_id, data) VALUES (?, ?)', [studyFormParticipantId, JSON.stringify(body)], (err, rows, fields) => {
      if(err) {
        return failure(err.message);
      }

      if(rows.affectedRows === 1) {
        return success(rows.insertId)
      }
      else {
        return failure("Database operation failed.");
      }
    });
  }
}

const responseModel = new ResponseModel();
module.exports = responseModel;
