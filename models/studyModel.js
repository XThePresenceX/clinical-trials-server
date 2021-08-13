let db = require('../config/dbConfig');

class StudyModel {
  getStudyById(id, callBack) {
    db.query('SELECT * FROM studies WHERE id = ? LIMIT 1',[id], (err, rows, fields) => {
      if(rows.length > 0) {
        return callBack(rows[0]);
      } else {
        return callBack(false);
      }
    });
  }

  getActiveStudies(participantId, success, failure) {
    db.query(`SELECT s.id, s.studyTitle, s.description, s.cashishPoints, s.createdDateTime, sp.studyStatus
    FROM study_participants sp JOIN studies s ON s.id = sp.studyId
    WHERE sp.participantId = ${participantId} AND sp.studyStatus = 'Notified' ORDER BY s.createdDateTime DESC`,
    (err, rows, fields) => {
      if(err) {
        return failure(err.message);
      }

      if (rows.length > 0) {
        return success(rows);
      } else {
        return success([]);
      }
    });
  }

  getPreviousStudies(participantId, success, failure) {
    db.query(`SELECT s.id, s.studyTitle, s.description, s.cashishPoints, s.createdDateTime, sp.studyStatus
    FROM study_participants sp JOIN studies s ON s.id = sp.studyId
    WHERE sp.participantId = ${participantId} AND (sp.studyStatus = 'COMPLETED' OR sp.studyStatus = 'ENDED')
    ORDER BY s.createdDateTime DESC`,
    (err, rows, fields) => {
      if(err) {
        return failure(err.message);
      }

      if (rows.length > 0) {
        return success(rows);
      } else {
        return success([]);
      }
    });
  }

  getStudyForms(studyId, callBack) {
    db.query('SELECT sf.formId, f.formTitle FROM study_forms sf  '
    + 'INNER JOIN forms f ON sf.formId = f.id '
    + 'WHERE sf.studyId = ' + studyId + ' ORDER BY f.createdDateTime ASC', (err, rows, fields) => {
      if(err) {
        return callBack({status: 0, message: err.message});
      }

      if (rows.length > 0) {
        return callBack({status: 1, forms: rows});
      } else {
        return callBack({status: 1, forms: []});
      }
    });
  }

  getStudyFaq(studyId, success, failure) {
    db.query('SELECT * FROM study_faq sf WHERE sf.studyId = ' + studyId + ' ORDER BY sf.createdDateTime ASC',
    (err, rows, fields) => {
      if(err) {
        return failure(err.message);
      }
      if (rows.length > 0) {
        return success(rows);
      }
      return success([]);
    });
  }

  getParticipantStudyForms(studyId, participantId, success, failure) {
    db.query("SELECT f.id, f.formTitle, spf.status, f.createdDateTime FROM study_participant_form spf "
    + "JOIN forms f ON f.id = spf.formId JOIN study_forms sf ON sf.formId = f.id AND sf.studyId = spf.studyId "
    + "WHERE spf.status in ('PENDING', 'WAITING', 'REJECTED', 'REPLIED', 'COMPLETED') AND spf.studyId = ? AND "
    + "spf.participantId = ? ORDER BY sf.formNumber",
    [studyId, participantId], (err, rows, fields) => {
      if(err) {
        return failure(err.message);
      }
      if (rows.length > 0) {
        return success(rows);
      }
      return success([]);
    });
  }

  getStudies(success, failure) {
    db.query('SELECT * FROM studies ORDER BY createdDateTime', (err, rows, fields) => {
      if(err) {
        return failure(err.message);
      }

      if (rows.length > 0) {
        return success(rows);
      }
      return success([]);
    });
  }

  postStudies(study, success, failure) {
    db.query('INSERT INTO studies (studyTitle, description, cashishPoints) VALUES (?,?,?)',
    [study.studyTitle, study.description, study.cashishPoints], (err, rows, fields) => {
      if(err) {
        return failure(err.message);
      }
      if (rows.affectedRows === 1) {
        study.id = rows.insertId;
        return success(study);
      }
      return failure('Unable to add study into the database');
    });
  }

  putStudy(studyId, study, success, failure) {
    db.query('UPDATE studies SET studyTitle = ?, description = ?, cashishPoints = ? WHERE id = ?',
    [study.studyTitle, study.description, study.cashishPoints, studyId], (err, rows, fields) => {
      if(err) {
        return failure(err.message);
      }
      if (rows.affectedRows === 1) {
        return success(study);
      }
      return failure('Unable to add study into the database');
    });
  }

  deleteStudy(studyId, success, failure) {
    db.query('DELETE FROM studies WHERE id = ?', [studyId], (err, status, fields) => {
      if(err) {
        return failure(err.message);
      }
      return success(true);
    });
  }
}

const studyModel = new StudyModel();
module.exports = studyModel;
