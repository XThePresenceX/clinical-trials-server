'use strict';
let studyProductModel = require('../models/studyProductModel')

class StudyProductController {
  getStudyProducts(req, res, next) {
    studyProductModel.getStudyProducts(
      response => res.json(response),
      err => res.status(500).json({message: err})
    );
  }

  postStudyProducts(req, res, next) {
    if (!req.body.studyId || !req.body.productId) {
      return res.status(400).json('Invalid Request Body');
    }
    studyProductModel.postStudyProducts(req.body.studyId, req.body.productId,
      response => res.status(201).json(response),
      err => res.status(500).json({message: err})
    );
  }

  deleteStudyProducts(req, res, next) {
    studyProductModel.deleteStudyProducts(req.params.studyProductId,
      response => res.json({message: 'Successfully Updated'}),
      err => res.status(500).json({message: err})
    );
  }
}
const studyProductController = new StudyProductController()
module.exports = studyProductController
