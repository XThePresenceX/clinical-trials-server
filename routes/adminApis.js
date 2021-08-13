let express = require("express");
let constants = require("../config/constants");
let router = express.Router();
let participantsController = require("../controllers/participantsController");
let faqController = require("../controllers/faqController");
let criteriaController = require("../controllers/criteriaController");
let productController = require("../controllers/productController");
let questionController = require("../controllers/questionController");
let formController = require("../controllers/formController");
let studyController = require("../controllers/studyController");
let studyFormController = require("../controllers/studyFormController");
let studyParticipantController = require("../controllers/studyParticipantController");
let studyProductController = require("../controllers/studyProductController");
let notificationController = require("../controllers/notificationController");
let responseController = require("../controllers/responseController");

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

router.route("/participants").get(participantsController.getAllParticipants);
router.route("/participants").post(participantsController.addParticipant);
router
  .route("/participants/:participantId")
  .put(participantsController.editParticipantProfile);
router
  .route("/participants/:participantId")
  .delete(participantsController.deleteParticipant);

router.route("/studies").get(studyController.getStudies);
router.route("/studies").post(studyController.postStudies);
router.route("/studies/:studyId").put(studyController.putStudy);
router.route("/studies/:studyId").delete(studyController.deleteStudy);

router.route("/studyForms").get(studyFormController.getStudyForms);
router.route("/studyForms").post(studyFormController.postStudyForms);
router
  .route("/studyForms/:studyFormId")
  .patch(studyFormController.patchStudyForms);
router
  .route("/studyForms/:studyFormId")
  .delete(studyFormController.deleteStudyForms);

router.route("/studyProducts").get(studyProductController.getStudyProducts);
router.route("/studyProducts").post(studyProductController.postStudyProducts);
router
  .route("/studyProducts/:studyProductId")
  .delete(studyProductController.deleteStudyProducts);

router.route("/forms").get(formController.getForms);
router.route("/forms").post(formController.postForm);
router.route("/forms/:formId").put(formController.putForm);
router.route("/forms/:formId").delete(formController.deleteForm);

router.route("/questions").get(questionController.getAllQuestions);
router
  .route("/forms/:formId/question")
  .post(formController.addQuestionByFormId);
router.route("/questions/:questionId").put(questionController.putQuestionById);
router
  .route("/questions/:questionId")
  .delete(questionController.deleteQuestionById);

router.route("/faqs").get(faqController.getFaqs);
router.route("/study/:studyId/faq").post(faqController.addFaqByStudyId);
router.route("/faqs/:faqId").put(faqController.putFaqById);
router.route("/faqs/:faqId").delete(faqController.deleteFaqById);

router.route("/criteria").get(criteriaController.getCriteria);
router
  .route("/study/:studyId/criteria")
  .post(criteriaController.addCriteriaByStudyId);
router.route("/criteria/:criteriaId").put(criteriaController.putCriteriaById);
router
  .route("/criteria/:criteriaId")
  .delete(criteriaController.deleteCriteriaById);

router
  .route("/studyParticipants")
  .get(studyParticipantController.getStudyParticipants);
router
  .route("/studyParticipants")
  .post(studyParticipantController.postStudyParticipants);
router
  .route("/studyParticipants/:studyParticipantId")
  .patch(studyParticipantController.patchStudyParticipantById);

router.route("/products").get(productController.getProducts);
router.route("/products").post(productController.addProduct);
router.route("/products/:productId").put(productController.putProductById);
router
  .route("/products/:productId")
  .delete(productController.deleteProductById);

router.route("/inputTypes").get(questionController.getInputTypes);
router.route("/responses").get(responseController.getResponses);

//router.route('/gethigh').get(notificationController.trial);
//router.route('/adnoticon').get(notificationController.addNotificationContentTable);
//router.route('/insertnotitrack').post(notificationController.insertintoTracker);
//router.route('/insertnoti').get(notificationController.triggerfunc);
//.route('/adnotifications').get(notificationController.addNotificationTrackerTable);
router.route("/notifications").post(notificationController.sendNotification);

router
  .route("/sendnotifications")
  .post(notificationController.sendNextFormNotification);

module.exports = router;
