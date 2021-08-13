"use strict";
let studyModel = require("../models/studyModel");
let Helper = require("../helpers/general");
const studyParticipantFormModel = require("../models/studyParticipantFormModel");
const notificationController = require("../controllers/notificationController");
let studyFormModel = require("../models/studyFormModel");

class StudyController {
  getActiveStudies(req, res, next) {
    studyModel.getActiveStudies(
      req.params.participantId,
      (response) => res.json({ status: 1, studies: response }),
      (error) => res.json({ status: 0, message: error })
    );
  }

  getPreviousStudies(req, res, next) {
    studyModel.getPreviousStudies(
      req.params.participantId,
      (response) => res.json({ status: 1, studies: response }),
      (error) => res.json({ status: 0, message: error })
    );
  }

  getStudyFaq(req, res, next) {
    studyModel.getStudyFaq(
      req.params.studyId,
      (faqs) => res.json({ status: 1, message: "success", faqs }),
      (err) => res.json({ status: 0, message: err })
    );
  }

  getParticipantStudyForms(req, res, next) {
    const studyId = req.params.studyId;
    const participantId = req.params.participantId;
    studyModel.getParticipantStudyForms(
      studyId,
      participantId,
      (forms) => res.json({ status: 1, message: "success", forms }),
      (err) => res.json({ status: 0, message: err })
    );
  }

  getStudies(req, res, next) {
    studyModel.getStudies(
      (response) => res.json(response),
      (err) => res.status(500).json({ error: err })
    );
  }

  resetStudy(req, res, next) {
    let numba = 0;
    console.log("resetting here in backend");
    const studyId = req.params.studyId;
    const participantId = req.params.participantId;
    studyParticipantFormModel.resetStudy(
      participantId,
      studyId,
      (res) =>
        notificationController.sendNextFormNotification(
          studyId,
          participantId,
          numba - 1
        ),
      (err) => res.status(500).json({ error: err })
    );
  }

  postStudies(req, res, next) {
    let requiredParameters = ["studyTitle", "description", "cashishPoints"];
    if (!Helper.verifyRequiredParams(req.body, res, requiredParameters)) {
      return;
    }
    const studyObj = {
      id: "",
      studyTitle: req.body.studyTitle,
      description: req.body.description,
      cashishPoints: req.body.cashishPoints,
    };
    studyModel.postStudies(
      studyObj,
      (study) => res.json(study),
      (err) => res.status(500).json(err)
    );
  }

  deleteStudy(req, res, next) {
    studyModel.deleteStudy(
      req.params.studyId,
      (response) => res.json({ message: "Successfully Deleted Study" }),
      (err) => res.status(500).json(err)
    );
  }

  putStudy(req, res, next) {
    const requiredParameters = ["studyTitle", "description", "cashishPoints"];
    if (!Helper.verifyRequiredParams(req.body, res, requiredParameters)) {
      return;
    }
    const studyId = req.params.studyId;
    studyModel.putStudy(
      studyId,
      req.body,
      (study) => res.json(study),
      (err) => res.status(500).json(err)
    );
  }
}

const studyController = new StudyController();
module.exports = studyController;
