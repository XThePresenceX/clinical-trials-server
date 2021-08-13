let db = require('../config/dbConfig');
let Helper = require('../helpers/general');

class CriteriaController {
  getCriteria(req, res, next) {
    db.query('SELECT * FROM study_criteria', (error, results, fields) => {
      if (error) {
        res.status(500).json({error: error.message});
      } else {
        res.json(results);
      }
    });
  }

  addCriteriaByStudyId(req, res, next) {
    if (!Helper.verifyRequiredParams(req.body, res, ['name', 'value'])) {
      return;
    }
    db.query('INSERT INTO study_criteria (studyId, name, value) values (?, ?, ?)', [req.params.studyId, req.body.name, req.body.value], (error, results, fields) => {
      if (error) {
        return res.status(500).json({error: error.message});
      }
      if(results.affectedRows === 1) {
        return res.status(201).json({
          id: results.insertId,
          name: req.body.name,
          value: req.body.value
        });
      }
      else {
        return res.status(500).json({error: 'Database operation failed.'});
      }
    });
  }

  putCriteriaById(req, res, next) {
    if (!Helper.verifyRequiredParams(req.body, res, ['name', 'value'])) {
      return;
    }
    db.query('UPDATE study_criteria SET name = ?, value = ? WHERE id = ?', [req.body.name, req.body.value, req.params.criteriaId], (error, results, fields) => {
      if (error) {
        return res.status(500).json({error: error.message});
      }
      if(results.affectedRows === 1) {
        return res.json({name: req.body.name, value: req.body.value});
      }
      else {
        return res.status(500).json({error: 'Database operation failed.'});
      }
    });
  }

  deleteCriteriaById(req, res, next) {
    db.query('DELETE FROM study_criteria WHERE id = ?', [req.params.criteriaId], (error, results, fields) => {
      if (error) {
        res.status(500).json({error: error.message});
      } else {
        res.json(results);
      }
    });
  }
}

const criteriaController = new CriteriaController();
module.exports = criteriaController;
