let db = require('../config/dbConfig');

class QuestionModel {
  getAllQuestions(success, failure) {
    db.query('SELECT fq.id, fq.formId, fq.`questionText`, fq.`questionSubText`, it.inputType, fq.`answerRequired`, '
      + 'fq.`allowMultipleOptionAnswers`, fq.`orderOfDelivery`, group_concat(fqo.optionName) as options FROM form_questions fq '
      + 'INNER JOIN input_types it ON it.id = fq.inputType LEFT JOIN form_question_options fqo ON fq.id = fqo.questionId GROUP BY fq.id',
    (err, rows, fields) => {
      if(err) {
        return failure(err.message);
      }
      if(rows.length > 0) {
        return success(rows);
      }
      return success([]);
    });
  }

  getInputTypeById(id, success, notFound, failure) {
    db.query('SELECT inputType FROM input_types WHERE id = ?', [id], (err, rows, fields) => {
      if(err) {
        return failure(err.message);
      }
      if(rows.length > 0) {
        return success(rows[0].inputType);
      }
      return notFound(true);
    });
  }

  updateFormQuestion(id, body, success, failure) {
    const questionSubText = body.questionSubText ? body.questionSubText : '';
    db.query('UPDATE form_questions SET questionText = ?, questionSubText = ?, inputType = ?, answerRequired = ?, allowMultipleOptionAnswers = ?, orderOfDelivery = ? WHERE id = ?',
    [body.questionText, questionSubText, body.inputType, body.answerRequired, body.allowMultipleOptionAnswers, body.orderOfDelivery, id], (err, rows, fields) => {
      if(err) {
        return failure(err.message);
      }

      if(rows.affectedRows == 1) {
        return success(true)
      }
      else {
        return failure('Database operation failed.');
      }
    });
  }

  deleteFormQuestionOptionsById(id, success, failure) {
    db.query('DELETE FROM form_question_options WHERE questionId = ?', [id], (err, rows, fields) => {
      if(err) {
        return failure(err.message);
      }
      return success(true)
    });
  }

  insertFormQuestionOptions(id, options, success, failure) {
    if (!options || options.length === 0) {
      success(true);
    } else {
      let values = '';
      options.forEach(option => {
        if (values !== ''){
          values+=',';
        }
        values += `(${id}, '${option}')`;
      });
      db.query(`INSERT INTO form_question_options (questionId, optionName) VALUES ${values}`, (err, rows, fields) => {
        if(err) {
          return failure(err.message);
        }

        if(rows.affectedRows > 0) {
          return success(true)
        }
        else {
          return failure('Database operation failed.');
        }
      });
    }
  }
}

const questionModel = new QuestionModel();
module.exports = questionModel;
