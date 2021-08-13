'use strict';
let studyParticipantModel = require('../models/studyParticipantModel')
let studyParticipantFormModel = require('../models/studyParticipantFormModel');

class StudyParticipantController {
  getStudyParticipants(req, res, next) {
    studyParticipantModel.getStudyParticipants(
      response => res.json(response),
      err=> res.status(500).json({message: err})
    );
  }

  postStudyParticipants(req, res, next) {
    if (!req.body.studyId || !req.body.participantId) {
      return res.status(400).json('Invalid Request Body');
    }
    studyParticipantModel.postStudyParticipants(req.body.studyId, req.body.participantId,
      response => res.status(201).json(response),
      err=> res.status(500).json({message: err})
    );
  }

  patchStudyParticipantById(req, res, next) {
    if (!(req.body[0].op === 'replace', req.body[0].path === 'studyStatus')) {
      return res.status(400).json('Invalid Request Body');
    }
    studyParticipantModel.patchStudyParticipants(req.params.studyParticipantId, req.body[0].value,
      response => {
        if (req.body[0].value.toLowerCase() === 'inactive') {
          studyParticipantModel.getIds(req.params.studyParticipantId,
            result => studyParticipantFormModel.updateStatusPendingForms(result.participantId, result.studyId, 'INACTIVATED',
              result2 => res.json({message: 'Successfully Updated'}),
              error2 => res.status(500).json({message: 'Internal Server Error. Error - '+error2})
            ),
            notFound => res.status(409).json({message: 'No record with the provided studyParticipantId found.'}),
            error => res.status(500).json({message: 'Internal Server Error. Error - '+error})
          );
        } else {
          res.json({message: 'Successfully Updated'});
        }
      },
      err => res.status(500).json({message: err})
    );
  }
}
const studyParticipantController = new StudyParticipantController()
module.exports = studyParticipantController
