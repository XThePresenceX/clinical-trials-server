let db = require('../config/dbConfig');

class FormModel {
  insertForm(formTitle, success, failure) {
    let sql = 'INSERT INTO forms (formTitle) VALUES (?)';
    db.query(sql, [formTitle], (err, status, fields) => {
      if(err) {
        return failure({status: 0, message: err.message});
      }

      if(status.affectedRows === 1) {
        return success({status: 1, insertedId: status.insertId})
      }
      else {
        return failure({status : 0, message: "Database operation failed."});
      }
    });
  }

  updateFormTitle(formId, formTitle, success, failure) {
    let sql = 'UPDATE forms SET formTitle = ? WHERE id = ?';
    db.query(sql, [formTitle, formId], (err, status, fields) => {
      if(err) {
        return failure(err.message);
      }

      if(status.affectedRows === 1) {
        return success(true)
      }
      else {
        return failure("Database operation failed.");
      }
    });
  }

  insertQuestion(data, callBack) {
    let sql = 'INSERT INTO form_questions (formId, questionText, questionSubText, inputType, answerRequired, allowMultipleOptionAnswers, orderOfDelivery) VALUES (?,?,?,?,?,?,?)';
    db.query(sql, [data.formId, data.questionText, data.questionSubText, data.inputType, data.answerRequired, data.allowMultipleOptionAnswers, data.orderOfDelivery], (err, status, fields) => {
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

  insertQuestionOption(data, callBack) {
    let sql = 'INSERT INTO form_question_options (questionId, optionName) VALUES (?,?)';
    db.query(sql, [data.questionId, data.optionName], (err, status, fields) => {
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

  getFormById(id, callBack) {
    db.query('SELECT * FROM forms WHERE id = ? LIMIT 1',[id], (err, rows, fields) => {
      if(err) {
        return callBack({status: 0, message: err.message});
      }

      if(rows.length > 0) {
        return callBack(rows[0]);
      } else {
        return callBack(false);
      }
    });
  }

  getFormQuestions(formId, callBack) {
    db.query('SELECT fq.id as questionId, fq.`questionText`, fq.`questionSubText`, it.inputType, fq.`answerRequired`, '
    + 'fq.`allowMultipleOptionAnswers`, fq.`orderOfDelivery` FROM form_questions fq INNER JOIN input_types it ON '
    + 'it.id = fq.inputType WHERE formId = ? ORDER BY fq.`orderOfDelivery`',
    [formId], (err, rows, fields) => {
      if(err) {
        return callBack({status: 0, message: err.message});
      }

      if(rows.length > 0) {
        return callBack({status: 1, formQuestions: rows});
      } else {
        return callBack({status: 1, formQuestions: []});
      }
    });
  }

  getFormQuestionOptions(questionId, callBack) {
    db.query('SELECT * FROM form_question_options WHERE questionId = ?',[questionId], (err, rows, fields) => {
      if(err) {
        return callBack({status: 0, message: err.message});
      }

      if(rows.length > 0) {
        return callBack({status: 1, questionOptions: rows});
      } else {
        return callBack({status: 1, questionOptions: []});
      }
    });
  }
}

const formModel = new FormModel();
module.exports = formModel;
