'use strict';
let studyFormModel = require('../models/studyFormModel');
let Helper = require('../helpers/general');

class StudyFormController {
  getStudyForms(req, res, next) {
    studyFormModel.getAllStudyForms(
      response => res.json(response),
      err=> res.status(500).json(err)
    );
  }

  postStudyForms(req, res, next) {
    let requiredParameters = ['studyId', 'formId', 'formNumber', 'timePeriod', 'waitTime', 'repeatFormNumber'];
    if(!Helper.verifyRequiredParams(req.body, res, requiredParameters)) {
      return;
    }
    studyFormModel.postStudyForms(req.body,
      response => res.json(response),
      err=> res.status(500).json(err)
    );
  }

  patchStudyForms(req, res, next) {
    let formNumber = -1, timePeriod = -1, waitTime = -2, repeatFormNumber = -2;
    const body = req.body;

    for (let i=0; i<body.length; i++) {
      if (body[i].op !== 'replace') {
        return res.status(400).json({message: 'Invalid Request Body Operation'});
      }
      if (body[i].path === 'formNumber') {
        formNumber = body[i].value;
      } else if (body[i].path === 'timePeriod') {
        timePeriod = body[i].value;
      }  else if (body[i].path === 'waitTime') {
        waitTime = body[i].value;
      } else if (body[i].path === 'repeatFormNumber') {
        repeatFormNumber = body[i].value;
      } else {
        return res.status(400).json({message: `Invalid Request Body Path - ${body[0].path}`});
      }
    }
    if (formNumber < 0 || timePeriod < 0 || waitTime < -1 || repeatFormNumber < -2) {
      return res.status(400).json({message: 'Missing Required Params'})  ;
    }
    studyFormModel.patchStudyForms(req.params.studyFormId, formNumber, timePeriod, waitTime, repeatFormNumber,
      response => res.json({message: 'Succeffuly Updated'}),
      err=> res.status(500).json({messaage: err})
    );
  }

  deleteStudyForms(req, res, next) {
    studyFormModel.deleteStudyForms(req.params.studyFormId,
      response => res.json({message: 'Successfully Deleted'}),
      err=> res.status(500).json(err)
    );
  }
}

const studyFormController = new StudyFormController();
module.exports = studyFormController;
