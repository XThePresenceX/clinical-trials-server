"use strict";
let Helper = require("../helpers/general");
let participantModel = require("../models/participantModel");
let Mail = require("../helpers/mail");
let TallyModel = require("../models/tallyModel");

class ParticipantController {
  addParticipant(req, res, next) {
    let requiredParameters = [
      "id",
      "gender",
      "birthyear",
      "city",
      "state",
      "country",
    ];
    if (Helper.verifyRequiredParams(req.body, res, requiredParameters)) {
      let participantObj = {
        id: req.body.id,
        gender: req.body.gender,
        birthyear: req.body.birthyear,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
      };

      participantModel.getParticipantById(
        req.body.id,
        (response) =>
          res.status(409).json({ message: "Participant already exists." }),
        (notFound) => {
          participantModel.insert(
            participantObj,
            (insertedId) => {
              participantObj.id = insertedId;
              Mail.sendEmail({
                path: "../views/emails/approved.hbs",
                subject:
                  "Cognizance VCT - Approved as Virtual Clinical Trial Participant",
                email: participantObj.email,
                text: "Congratulations!",
              });
              TallyModel.insertIntoTally(req.body.id);
              res.json(participantObj);
            },
            (error) => res.status(500).json({ error: error })
          );
        },
        (error) => res.status(500).json({ error: error })
      );
    }
  }

  editParticipantProfile(req, res, next) {
    let requiredParameters = [
      "firstName",
      "lastName",
      "phone",
      "city",
      "state",
      "country",
    ];
    if (Helper.verifyRequiredParams(req.body, res, requiredParameters)) {
      let obj = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        participantId: req.params.participantId,
      };

      participantModel.updateParticipantProfile(
        obj,
        (response) =>
          participantModel.getParticipantById(
            obj.participantId,
            (participantData) => {
              delete participantData["password"];
              res.json({ status: 1, participant: participantData });
            },
            (notFound) =>
              res.status(404).json({ message: "Participant Not Found" }),
            (err) => res.status(500).json({ message: "Internal Server Error" })
          ),
        (error) => res.status(500).json(error)
      );
    }
  }

  getAllParticipants(req, res, next) {
    participantModel.getAllParticipants(
      (result) => res.json(result),
      (err) => res.status(500).json({ error: err })
    );
  }

  deleteParticipant(req, res, next) {
    const participantId = req.params.participantId;
    participantModel.deleteParticipant(
      participantId,
      (result) => res.json(result),
      (err) => res.status(500).json({ error: err })
    );
  }

  registerDevice(req, res, next) {
    var requiredParameters = ["participantId", "notificationToken"];

    if (Helper.verifyRequiredParams(req.body, res, requiredParameters)) {
      let participantId = req.body.participantId;
      let notificationToken = req.body.notificationToken;
      participantModel.removeRegisteredDevice(notificationToken, (response) => {
        if (response.status == 1) {
          participantModel.registerDeviceToken(
            {
              participantId: participantId,
              notificationToken: notificationToken,
            },
            (response) => {
              if (response.status == 1) {
                return res.json({
                  status: 1,
                  message: "Device token registered successfully",
                });
              } else {
                return res.json({ status: 0, message: response.message });
              }
            }
          );
        } else {
          return res.json({ status: 0, message: response.message });
        }
      });
    }
  }
}

const participantController = new ParticipantController();
module.exports = participantController;
