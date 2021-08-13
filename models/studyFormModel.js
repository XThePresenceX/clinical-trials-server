let db = require('../config/dbConfig');

class StudyFormModel {
  getNextFormId(studyId, formNumber, success, failure) {
    db.query('SELECT formId FROM study_forms WHERE formNumber = ? AND studyId = ?', [formNumber + 1, studyId], (err, rows, fields) => {
      if(err) {
        return failure(err.message);
      }

      if (rows.length > 0) {
        return success(rows);
      }
      return success([]);
    });
  }

  getFormsByStudyId (studyId, success, failure) {
    db.query('SELECT formId, formNumber FROM study_forms WHERE studyId = ?', [studyId], (err, rows, fields) => {
      if(err) {
        return failure({message: err.message});
      }
      if (rows.length > 0) {
        return success(rows);
      }
      return success([]);
    });
  }

  getAllStudyForms (success, failure) {
    db.query('SELECT sf.id, sf.formId, sf.studyId, sf.formNumber, sf.timePeriod, sf.waitTime, sf.repeatFormNumber, sf.createdDateTime, '
    + 'formTitle FROM study_forms sf INNER JOIN forms f ON f.id = sf.formId', (err, rows, fields) => {
      if(err) {
        return failure({message: err.message});
      }
      if (rows.length > 0) {
        return success({result: rows});
      }
      return success({result: []});
    });
  }

  postStudyForms(body, success, failure) {
    db.query('INSERT INTO study_forms (studyId, formId, formNumber, timePeriod, waitTime, repeatFormNumber) VALUES (?,?,?,?,?,?)',
    [body.studyId, body.formId, body.formNumber, body.timePeriod, body.waitTime, body.repeatFormNumber], (err, rows, fields) => {
      if(err) {
        return failure(err.message);
      }
      if (rows.affectedRows === 1) {
        return success({
          id: rows.insertId,
          studyId: body.studyId,
          formId: body.formId,
          formNumber: body.formNumber,
          timePeriod: body.timePeriod,
          waitTime: body.waitTime,
          repeatFormNumber: body.repeatFormNumber
        });
      }
      return failure(`Unable to add form with id - ${body.formId} to study id ${body.studyId} into the database`);
    });
  }

  patchStudyForms(studyFormId, formNumber, timePeriod, waitTime, repeatFormNumber, success, failure) {
    db.query('UPDATE study_forms SET formNumber = ?, timePeriod = ?, waitTime = ?, repeatFormNumber = ? WHERE id = ?',
    [formNumber, timePeriod, waitTime, repeatFormNumber, studyFormId], (err, rows, fields) => {
      if(err) {
        return failure(err.message);
      }
      if (rows.affectedRows === 1) {
        return success(true);
      }
      return failure('Unable to update study form in the database');
    });
  }

  deleteStudyForms(studyFormId, success, failure) {
    db.query('DELETE FROM study_forms WHERE id = ?', [studyFormId], (err, status, fields) => {
      if(err) {
        return failure(err.message);
      }
      return success(true);
    });
  }


}

const studyFormModel = new StudyFormModel();
module.exports = studyFormModel;
