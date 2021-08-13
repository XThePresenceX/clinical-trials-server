let Helper = require("../helpers/general");
let Notifications = require("../helpers/notifications");
let notificationModel = require("../models/notificationModel");
let studyFormModel = require("../models/studyFormModel");
let studyParticipantModel = require("../models/studyParticipantModel");
let studyParticipantFormModel = require("../models/studyParticipantFormModel");
const logger = require("../helpers/logger");
const { v4: uuidv4 } = require("uuid");
let db = require("../config/dbConfig");

class NotificationController {
  sendNotification(req, res, next) {
    if (
      !Helper.verifyRequiredParams(req.body, res, ["studyId", "participantIds"])
    ) {
      return;
    }
    const studyId = req.body.studyId;
    const participantIds = req.body.participantIds;
    studyFormModel.getFormsByStudyId(
      studyId,
      (result) =>
        studyParticipantFormModel.postMultipleStudyParticipantForm(
          studyId,
          participantIds,
          result,
          (result2) =>
            studyParticipantModel.updateNotifiedParticipants(
              studyId,
              participantIds,
              (result3) =>
                notificationModel.getNotificationTokenByParticipantIds(
                  participantIds,
                  (devices) => {
                    try {
                      const notificationContent = {
                        title: "New Study",
                        // TODO: Add study title to the next line somehow
                        body: "You have been added to a new study.",
                      };
                      Notifications.sendNotification(
                        devices,
                        notificationContent
                      );
                      notificationModel.insertintoContentTracker(
                        notificationContent.body,
                        participantIds,
                        (result) =>
                          res.json({
                            message: "Successfully sent notifications",
                          }),
                        (error) => {
                          logger.log(
                            "notificationController/sendNotification",
                            "error",
                            {
                              errorType: "error",
                              message: "Internal Server Error: " + error,
                            }
                          );
                          res.status(500).json({ message: error });
                        }
                      );
                    } catch (e) {
                      logger.log(
                        "notificationController/sendNotification",
                        "error",
                        {
                          errorType: "e",
                          message: "Internal Server Error: " + e,
                        }
                      );
                      return res
                        .status(500)
                        .json({ message: "Interenal Server Error: " + e });
                    }
                  },
                  (err) => {
                    logger.log(
                      "notificationController/sendNotification",
                      "error",
                      {
                        errorType: "err",
                        message: "Internal Server Error: " + err,
                      }
                    );
                    res.status(500).json({ message: err });
                  }
                ),
              (error3) => {
                logger.log("notificationController/sendNotification", "error", {
                  errorType: "error3",
                  message: "Internal Server Error: " + error3,
                });
                res.status(500).json({ message: error3 });
              }
            ),
          (error2) => {
            logger.log("notificationController/sendNotification", "error", {
              errorType: "error2",
              message: "Internal Server Error: " + error2,
            });
            res.status(500).json({ message: error2 });
          }
        ),
      (error3) => {
        logger.log("notificationController/sendNotification", "error", {
          errorType: "error3",
          message: "Interenal Server Error: " + error3,
        });
        res.status(500).json({ message: error3 });
      }
    );
  }

  sendNextFormNotification(studyId, participantId, formNumber) {
    studyFormModel.getNextFormId(
      studyId,
      formNumber,
      (res2) =>
        notificationModel.getNotificationTokenByParticipantIds(
          [participantId],
          (devices) => {
            if (res2.length > 0) {
              const newFormId = res2[0].formId;
              studyParticipantFormModel.updateStatus(
                participantId,
                studyId,
                newFormId,
                "PENDING",
                (res3) => {
                  const notificationContent = {
                    title: "New Form",
                    // TODO: Add study title to the next line somehow
                    body: "Your form for the next test is now available.",
                  };
                  try {
                    Notifications.sendNotification(
                      devices,
                      notificationContent
                    );
                    notificationModel.insertintoContentTracker(
                      notificationContent.body,
                      [participantId],
                      (res4) =>
                        logger.log(
                          "notificationController/sendNextFormNotification",
                          "info",
                          {
                            message:
                              "Successfully sent notifications for new form.",
                          }
                        ),
                      (error4) =>
                        logger.log(
                          "notificationController/sendNextFormNotification",
                          "error",
                          {
                            errorType: "error4",
                            message: "Internal Server Error - " + error4,
                          }
                        )
                    );
                  } catch (e) {
                    logger.log(
                      "notificationController/sendNextFormNotification",
                      "error",
                      {
                        errorType: "e",
                        message: "Interenal Server Error: " + e,
                      }
                    );
                  }
                },
                (err3) =>
                  logger.log(
                    "notificationController/sendNextFormNotification",
                    "error",
                    { errorType: "err3", message: err3 }
                  )
              );
            } else {
              studyParticipantModel.updateStatus(
                "COMPLETED",
                studyId,
                participantId,
                (res5) => {
                  const notificationContent = {
                    title: "Study Completed",
                    // TODO: Add study title to the next line somehow
                    body: `You have successfully completed the study.`,
                  };
                  try {
                    Notifications.sendNotification(
                      devices,
                      notificationContent
                    );
                    notificationModel.insertintoContentTracker(
                      notificationContent.body,
                      [participantId],
                      (res6) =>
                        logger.log(
                          "notificationController/sendNextFormNotification",
                          "info",
                          {
                            studyId,
                            participantId,
                            message: "Successfully completed the study.",
                          }
                        ),
                      (err6) =>
                        logger.log(
                          "notificationController/sendNextFormNotification",
                          "error",
                          {
                            errorType: "err6",
                            message: "Interenal Server Error: " + err6,
                          }
                        )
                    );
                  } catch (e2) {
                    logger.log(
                      "notificationController/sendNextFormNotification",
                      "error",
                      {
                        errorType: "e2",
                        message: "Interenal Server Error: " + e2,
                      }
                    );
                  }
                },
                (err5) =>
                  logger.log(
                    "notificationController/sendNextFormNotification",
                    "error",
                    {
                      errorType: "err5",
                      message: "Internal Server Error - " + err5,
                    }
                  )
              );
            }
          },
          (err) =>
            logger.log(
              "notificationController/sendNextFormNotification",
              "error",
              { errorType: "err", message: "Internal Server Error - " + err }
            )
        ),
      (error2) =>
        logger.log("notificationController/sendNextFormNotification", "error", {
          errorType: "error2",
          message: "Internal Server Error - " + error2,
        })
    );
  }

  getNotifications(getNotificationsRequest, getNotificationsResponse, next) {
    try {
      notificationModel.getNotificationContentByParticipantId(
        getNotificationsRequest.query.participantId,
        (notificationContent) => {
          getNotificationsResponse.send(notificationContent);
        }
      );
    } catch (err) {
      logger.log("notificationController/getNotifications", "error", {
        message: "Internal Server Error - " + err,
      });
      getNotificationsResponse.status(500);
    }
  }
}

const notificationController = new NotificationController();
module.exports = notificationController;
