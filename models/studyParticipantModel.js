let db = require('../config/dbConfig');

class StudyParticipantModel {
  getStudyParticipants(success, failure) {
    db.query('SELECT * FROM study_participants', (err, rows, fields) => {
      if(err) {
        return failure(err.message);
      }
      if (rows.length > 0) {
        return success(rows);
      }
      return success([]);
    });
  }

  patchStudyParticipants(studyParticipantId, studyStatus, success, failure) {
    db.query('UPDATE study_participants SET studyStatus = ? WHERE id = ?', [studyStatus, studyParticipantId], (err, rows, fields) => {
      if(err) {
        return failure(err.message);
      }
      if (rows.affectedRows === 1) {
        return success(true);
      }
      return failure(`Unable to update status to ${studyStatus} of study_participant with id ${studyParticipantId}`);
    });
  }

  postStudyParticipants(studyId, participantId, success, failure) {
    db.query('INSERT INTO study_participants (studyId, participantId) VALUES (?,?)',
    [studyId, participantId], (err, rows, fields) => {
      if(err) {
        return failure(err.message);
      }
      if (rows.affectedRows === 1) {
        return success({
          id: rows.insertId,
          studyId: studyId,
          participantId: participantId,
          studyStatus: 'NOT NOTIFIED'
        });
      }
      return failure(`Unable to add participant with id - ${participantId} to study id ${studyId} into the database`);
    });
  }

  updateNotifiedParticipants(studyId, participantIds, success, failure) {
    db.query(`UPDATE study_participants SET studyStatus = 'Notified' WHERE studyId = ? AND participantId in (${participantIds.join(', ')})`, [studyId], (err, rows, fields) => {
      if(err) {
        return failure(err.message);
      }
      if (rows.affectedRows > 0) {
        return success(true);
      }
      return failure(`Unable to update studyStatus to Notified of study_participant with for studyId ${studyId} and participants with id ${participantIds.join(', ')}`);
    });
  }

  updateStatus(status, studyId, participantId, success, failure) {
    db.query('UPDATE study_participants SET studyStatus = ? WHERE studyId = ? AND participantId = ?',
    [status, studyId, participantId], (err, rows, fields) => {
      if(err) {
        return failure(err.message);
      }
      if (rows.affectedRows === 1) {
        return success(true);
      }
      return failure(`Unable to update studyStatus to ${status} of study_participant with for studyId ${studyId} and participantId ${participantId}`);
    });
  }

  getIds(studyParticipantId, success, notFound, failure) {
    db.query('SELECT studyId, participantId FROM study_participants WHERE id = ?',
    [studyParticipantId], (err, rows, fields) => {
      if (err) {
        return failure(err);
      }
      if (rows.length > 0) {
        return success(rows[0]);
      }
      return notFound(true);
    });
  }
}

const studyParticipantModel = new StudyParticipantModel()
module.exports = studyParticipantModel;
