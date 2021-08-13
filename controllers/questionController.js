'use strict';
let Helper = require('../helpers/general');
let db = require('../config/dbConfig');
let questionModel = require('../models/questionModel');

class QuestionController {
  getAllQuestions(req, res, next) {
    questionModel.getAllQuestions(
      response => res.json(response),
      error => res.status(500).json(error)
    );
  }

  putQuestionById(req, res, next) {
    const id = req.params.questionId;
    const requiredParameters = ['questionText', 'inputType', 'answerRequired', 'allowMultipleOptionAnswers', 'orderOfDelivery'];
    const body = req.body;
    if(!Helper.verifyRequiredParams(body, res, requiredParameters) ) {
      return;
    }
    questionModel.updateFormQuestion(id, body,
      response => questionModel.deleteFormQuestionOptionsById(id,
        response2 => questionModel.insertFormQuestionOptions(id, body.options,
          response3 => res.json({message: 'successfully updated'}),
          error => res.status(500).json({error: error, event: 'Inserting Form Question Options'})
        ),
        error => res.status(500).json({error: error, event: 'Deleting Form Question Options'})
      ),
      error => res.status(500).json({error: error, event: 'Updating Form Question'})
    );
  }

  deleteQuestionById(req, res, next) {
    const id = req.params.questionId;
    db.query('DELETE FROM form_questions WHERE id = ?',[id], (err, rows, fields) => {
      if (err) {
        res.status(500).json({error: err.message});
      } else {
        res.status(200).json({message: 'successfully deleted'});
      }
    });
  }

  getInputTypes(req, res, next) {
    db.query('SELECT * FROM input_types', (error, results, fields) => {
      if (error) {
        res.status(500).json({error: error.message});
      } else {
        res.json(results);
      }
    });
  }
}

const questionController = new QuestionController();
module.exports = questionController;
