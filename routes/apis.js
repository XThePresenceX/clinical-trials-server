let express = require("express");
let constants = require("../config/constants");
let router = express.Router();
let usersController = require("../controllers/usersController");
let participantsController = require("../controllers/participantsController");
let formController = require("../controllers/formController");
let studyController = require("../controllers/studyController");
let responseController = require("../controllers/responseController");
let walletController = require("../controllers/walletController");
let signatureController = require("../controllers/signatureController");
let notificationsController = require("../controllers/notificationController");
let tallyController = require("../controllers/tallyController");
let testResultController = require("../controllers/testResultController");

router.get("/participant/verifyEmail", usersController.verifyEmail);
let Auth = require("../helpers/auth");
const refrenceFormNumController = require("../controllers/refrenceFormNumController");

// router.use('/', (req, res, next) => {
//       if (req.get('Authorization') === '' || req.get('Authorization') === null || req.get('Authorization') === undefined)
//             return res.json({ status: 401, status_message: `FIRST AUTHENTICATION_FAILED` });

//       if (req.get('apiKey') === '' || req.get('apiKey') === null || req.get('apiKey') === undefined)
//             return res.json({ status: 401, status_message: `FIRST API_KEY_MISSING` });

//       if (req.get('apiKey') != constants.API_KEY)
//             return res.json({ status: 401, status_message: `SECOND API_KEY_MISMATCHED` });

//       if (req.get('Authorization') != constants.AUTHORIZATION_TOKEN)
//             return res.json({ status: 401, status_message: `SECOND AUTHENTICATION_FAILED` });

//       return next();
// });

//------------------------------- USERs ------------------------------------
router.post("/participant/signup", usersController.addUser);
router.post("/participant/login", usersController.login);
router.post("/participant/forgotPassword", usersController.forgotPassword);
router.post("/participant/resetPassword", usersController.resetPassword);

router
  .route("/participant/profile/:participantId")
  .put(participantsController.editParticipantProfile);
router
  .route("/participant/registerDevice")
  .post(participantsController.registerDevice);

router.route("/form/create").post(formController.createForm);

router.route("/wallet/update").post(walletController.updateWallet);
router
  .route("/wallet/:participantId")
  .get(walletController.getParticipantWallet);

router
  .route("/studies/active/:participantId")
  .get(studyController.getActiveStudies);
router
  .route("/studies/previous/:participantId")
  .get(studyController.getPreviousStudies);
router.route("/studies/faq/:studyId").get(studyController.getStudyFaq);
router
  .route("/studies/:studyId/participants/:participantId/forms")
  .get(studyController.getParticipantStudyForms);

router.route("/form/questions").get(formController.getFormQuestions);
router.route("/form/questionsX/:formId").get(formController.getFormQuestionsX);
//router.route("/form/:formId").get(formController.getAFormByID);

router.route("/tallyup").post(tallyController.updateTallyTable);
router.route("/gettally/:participantID").get(tallyController.getTally);
router.route("/newtally/:participantID").post(tallyController.addUserToTally);

router
  .route("/getRepeatNum/:formId")
  .get(refrenceFormNumController.getRefrenceFormNum);

router
  .route("/participant/:participantId/study/:studyId/form/:formId/response")
  .post(responseController.postResponse);
router.route("/signature").post(signatureController.postSignature);
router.route("/notifications").get(notificationsController.getNotifications);
router.route("/picture").post(responseController.postImage);

router.route("/sendOTP").post(testResultController.sendOTP);
router.route("/testResult").post(testResultController.seeTestResult);
router.route("/addPcrResult").post(testResultController.addPcrResult);

module.exports = router;
