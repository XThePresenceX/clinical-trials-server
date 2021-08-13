const express = require("express");
const cron = require("node-cron");
const http = require("http");
const db = require("./config/dbConfig");
const notificationController = require("./controllers/notificationController");
const studyParticipantFormModel = require("./models/studyParticipantFormModel");
const studyParticipantModel = require("./models/studyParticipantModel");
const logger = require("./helpers/logger");

module.exports = async function start() {
  // Setting up the schedule to run every half minute
  while (true) {
    //cron.schedule("*/ * * * *", async () => runJob());
    //console.log("somethingxxxxxxx");
    runJob();
    await sleep(5000);
  }
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
/*
Main function for the Cron Job
- Checks all the forms that have been sent out
- Checks if the answers for the forms have been recieved.
- Calculates the time difference between the current time and when the answers are recieved.
- If the time difference is greater than the "wait time", send in the next form.
*/
async function runJob() {
  //console.log("YYYYYYYY");
  db.query(
    "SELECT * FROM study_participant_form spf JOIN study_forms sf ON sf.studyId = spf.studyId AND sf.formId = spf.formId" +
      " WHERE spf.status='PENDING' OR spf.status='REPLIED'",
    [],
    async (error, results, fields) => {
      const currentTime = new Date().getTime();
      if (error) {
        logger.log("cron/runJob", "error", {
          message: "Error fetching data" + error,
        });
        return;
      }
      //console.log(results);
      for (let i = 0; i < results.length; i++) {
        //console.log(results);
        const formId = results[i].formId;
        const studyId = results[i].studyId;
        const participantId = results[i].participantId;
        const status = results[i].status;
        const updatedTime = results[i].updatedTime;
        const timePeriod = results[i].timePeriod;
        const waitTime = results[i].waitTime;
        const formNumber = results[i].formNumber;
        const repeatFormNumber = results[i].repeatFormNumber;

        const timeDifference = currentTime - updatedTime.getTime();
        const roundedTime = Math.floor(timeDifference / (1000 * 60)); // Converting Milliseconds to minutes (1000 x 60)
        // console.log(
        //   "Time Period: ",
        //   timePeriod,
        //   " AND roundedTime: ",
        //   roundedTime
        // );
        //console.log(roundedTime);

        if (status === "PENDING") {
          // console.log("WAITING AT PENDING");
          // Special Case where we should wait indefinitely for response (like in case of consent, product registration, etc)
          if (waitTime === -1) {
            continue;
          }
          if (roundedTime > waitTime) {
            //console.log("WAITING AT REJECTION STATUS");
            studyParticipantFormModel.updateStatus(
              participantId,
              studyId,
              formId,
              "REJECTED",
              (res) =>
                studyParticipantModel.updateStatus(
                  "ENDED",
                  studyId,
                  participantId,
                  (res2) =>
                    logger.log("cron/runJob", "info", {
                      message: "Wait time exceeded for the form!",
                      studyId: studyId,
                      participantId: participantId,
                      formId: formId,
                    }),
                  (err2) =>
                    logger.log("cron/runJob", "error", {
                      errorType: "err2",
                      message:
                        "Wait time exceeded for the form! Error while updating the status of the study participant. Error - " +
                        err2,
                      studyId: studyId,
                      participantId: participantId,
                    })
                ),
              (err) =>
                logger.log("cron/runJob", "error", {
                  errorType: "err",
                  message:
                    "Wait time exceeded for the form! Error while updating the status of study participant form. Error - " +
                    err,
                  studyId: studyId,
                  participantId: participantId,
                  formId: formId,
                })
            );
            continue;
          }
        } else {
          // The form has been replied by the participant.
          // if (timePeriod > roundedTime) {
          //   console.log("WAITING AT TIME");
          //   // There is still time left for the new form to be sent.
          //   continue;
          // }
          if (repeatFormNumber >= 0) {
            //console.log("WAITING AT RESET");
            // Repeat the study from this form number
            studyParticipantFormModel.resetStudy(
              participantId,
              studyId,
              (res) =>
                notificationController.sendNextFormNotification(
                  studyId,
                  participantId,
                  repeatFormNumber - 1
                ),
              (err) =>
                logger.log("cron/runJob", "error", {
                  errorType: "err",
                  message: "Error while resetting study. Error - " + err,
                  studyId: studyId,
                  participantId: participantId,
                })
            );
          } else {
            //console.log("WAITING AT COMPLETED");
            studyParticipantFormModel.updateStatus(
              participantId,
              studyId,
              formId,
              "COMPLETED",
              (res) =>
                notificationController.sendNextFormNotification(
                  studyId,
                  participantId,
                  formNumber
                ),
              (err) =>
                logger.log("cron/runJob", "error", {
                  errorType: "err",
                  message: "Error while resetting study. Error - " + err,
                  studyId: studyId,
                  participantId: participantId,
                })
            );
          }
        }
      }
    }
  );
}
