"use strict";
let responseModel = require("../models/responseModel");
let studyParticipantFormModel = require("../models/studyParticipantFormModel");
const { s3Upload } = require("../helpers/s3Uploader");

class ResponseController {
  postResponse(req, res, next) {
    const formId = req.params.formId;
    const studyId = req.params.studyId;
    const participantId = req.params.participantId;
    //console.log("WAITING AT REPLIED");

    studyParticipantFormModel.getIdByIds(
      participantId,
      studyId,
      formId,
      (spfId) => {
        if (spfId === 0) {
          res.status(404).json({
            message:
              "Could not find the study related form for the participant.",
          });
        } else {
          responseModel.addResponse(
            spfId,
            req.body,
            (result) =>
              studyParticipantFormModel.updateStatus(
                participantId,
                studyId,
                formId,
                "REPLIED",
                (result2) =>
                  res.json({ status: 1, message: "Added Successfully" }),
                (error2) =>
                  res.status(500).json({
                    status: 2,
                    message:
                      "Added Successfully but failed to update status. Error - " +
                      error2,
                  })
              ),
            (error) =>
              res
                .status(500)
                .json({ message: "Internal Server Error. Error: " + error })
          );
        }
      },
      (err) =>
        res
          .status(500)
          .json({ message: "Internal Server Error. Error: " + err })
    );
  }

  getResponses(req, res, next) {
    responseModel.getResponses(
      (val) => res.json(val),
      (err) =>
        res
          .status(500)
          .json({ message: "Internal Server Error. Error: " + err })
    );
  }
  postSignature(req, res, next) {
    s3Upload(req.body.base64String, "signatures")
      .then((signatureFileId) => {
        res.json({ signatureFileId });
      })
      .catch((s3UploadError) => {
        res.status(500).send(s3UploadError);
      });
  }
  postImage(req, res, next) {
    s3Upload(req.body.base64String, "pictureresponses")
      .then((imageFileId) => {
        res.json({ imageFileId });
      })
      .catch((s3UploadError) => {
        res.status(500).send(s3UploadError);
      });
  }
}

const responseController = new ResponseController();
module.exports = responseController;
