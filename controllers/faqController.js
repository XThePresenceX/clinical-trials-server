let db = require('../config/dbConfig');
let Helper = require('../helpers/general');
const logger = require('../helpers/logger');

class FaqController {
  getFaqs(req, res, next) {
    db.query('SELECT * FROM study_faq', (error, results, fields) => {
      if (error) {
        logger.log('faqController/getFaqs', 'error', {message: 'Interenal Server Error: '+error.message});
        res.status(500).json({error: error.message});
      } else {
        res.json(results);
      }
    });
  }

  addFaqByStudyId(req, res, next) {
    if (!Helper.verifyRequiredParams(req.body, res, ['question', 'answer'])) {
      return;
    }
    db.query('INSERT INTO study_faq (studyId, question, answer) values (?, ?, ?)', [req.params.studyId, req.body.question, req.body.answer], (error, results, fields) => {
      if (error) {
        logger.log('faqController/addFaqByStudyId', 'error', {
          errorType: 'error',
          message: 'Interenal Server Error: '+error.message,
          question: req.body.question,
          answer: req.body.answer,
          studyId: req.params.studyId
        });
        return res.status(500).json({error: error.message});
      }
      if(results.affectedRows === 1) {
        return res.status(201).json({
          id: results.insertId,
          studyId: parseInt(req.params.studyId),
          question: req.body.question,
          answer: req.body.answer
        });
      }
      else {
        logger.log('faqController/addFaqByStudyId', 'error', {
          message: 'Database Operation Failed as result.affectedRows is != 1',
          question: req.body.question,
          answer: req.body.answer,
          studyId: req.params.studyId
        });
        return res.status(500).json({error: 'Database operation failed.'});
      }
    });
  }

  putFaqById(req, res, next) {
    if (!Helper.verifyRequiredParams(req.body, res, ['question', 'answer'])) {
      return;
    }
    db.query('UPDATE study_faq SET question = ?, answer = ? WHERE id = ?', [req.body.question, req.body.answer, req.params.faqId], (error, results, fields) => {
      if (error) {
        return res.status(500).json({error: error.message});
      }
      if(results.affectedRows === 1) {
        return res.json({question: req.body.question, answer: req.body.answer});
      }
      else {
        return res.status(500).json({error: 'Database operation failed.'});
      }
    });
  }

  deleteFaqById(req, res, next) {
    db.query('DELETE FROM study_faq WHERE id = ?', [req.params.faqId], (error, results, fields) => {
      if (error) {
        res.status(500).json({error: error.message});
      } else {
        res.json(results);
      }
    });
  }
}

const faqController = new FaqController();
module.exports = faqController;
