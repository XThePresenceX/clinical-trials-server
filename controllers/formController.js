"use strict";
let Helper = require("../helpers/general");
let formModel = require("../models/formModel");
let questionModel = require("../models/questionModel");
let db = require("../config/dbConfig");

class FormController {
  getAFormByID(req, res) {
    formId = req.params.formId;
    db.query(
      "SELECT * FROM forms WHERE id = ? LIMIT 1",
      [formId],
      (err, result, fields) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json({ result });
        }
      }
    );
  }

  getForms(req, res, next) {
    db.query("SELECT * FROM forms", (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        res.json({ results: results });
      }
    });
  }

  deleteForm(req, res, next) {
    db.query(
      "DELETE FROM forms WHERE id = ?",
      [req.params.formId],
      (err, rows, fields) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json({ message: "Deleted Successfully" });
        }
      }
    );
  }

  postForm(req, res, next) {
    if (!Helper.verifyRequiredParams(req.body, res, ["formTitle"])) {
      return;
    }
    const formTitle = req.body.formTitle;
    formModel.insertForm(
      formTitle,
      (response) => res.json({ id: response.insertedId, formTitle: formTitle }),
      (error) => res.status(500).json({ error: error.message })
    );
  }

  putForm(req, res, next) {
    if (!Helper.verifyRequiredParams(req.body, res, ["formTitle"])) {
      return;
    }
    const formTitle = req.body.formTitle;
    formModel.updateFormTitle(
      req.params.formId,
      req.body.formTitle,
      (success) => res.json({ formTitle: formTitle }),
      (error) => res.status(500).json({ error: error })
    );
  }

  async createForm(req, res, next) {
    let requiredParameters = ["formTitle", "questions"];
    if (Helper.verifyRequiredParams(req.body, res, requiredParameters)) {
      try {
        let formTitle = req.body.formTitle;
        let questions = req.body.questions ? req.body.questions : [];

        if (questions.length > 0) {
          requiredParameters = [
            "questionText",
            "inputType",
            "answerRequired",
            "allowMultipleOptionAnswers",
            "orderOfDelivery",
          ];
          if (
            !questions.every((question) =>
              Helper.verifyRequiredParams(question, res, requiredParameters)
            )
          ) {
            return;
          }
          formModel.insertForm(
            formTitle,
            async (response) => {
              let formId = response.insertedId;
              let responseQuestions = [];
              await asyncForEach(questions, async (element) => {
                addQuestion(formId, element, (question) =>
                  responseQuestions.push(question)
                );
              });
              const newForm = {
                id: formId,
                formTitle: formTitle,
                questions: responseQuestions,
              };
              res
                .status(201)
                .json({ status: 1, message: "success", form: newForm });
            },
            (error) => res.json(error)
          );
        } else {
          res.json({
            status: 0,
            message: "Please provide at least one question to the form.",
          });
        }
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  }

  addQuestionByFormId(req, res, next) {
    try {
      if (!Helper.verifyRequiredParams(req.params, res, ["formId"])) {
        return;
      }
      const requiredParameters = [
        "questionText",
        "inputType",
        "answerRequired",
        "allowMultipleOptionAnswers",
        "orderOfDelivery",
      ];
      if (!Helper.verifyRequiredParams(req.body, res, requiredParameters)) {
        return;
      }
      addQuestion(parseInt(req.params.formId), req.body, (question) => {
        questionModel.getInputTypeById(
          question.inputType,
          (inputType) => {
            question.inputType = inputType;
            res.json(question);
          },
          (notFound) => res.json(question),
          (err) => res.status(500).json({ error: err })
        );
      });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }

  getFormQuestions(req, res, next) {
    if (!Helper.verifyRequiredParams(req.query, res, ["formId"])) {
      return;
    }
    formModel.getFormQuestions(req.query.formId, (response) => {
      if (response.status == 1) {
        let i = 0;
        let formQuestions = [];
        response.formQuestions.forEach((question) =>
          formModel.getFormQuestionOptions(
            question.questionId,
            (questionOptions) => {
              if (questionOptions.status == 1) {
                question["options"] = questionOptions.questionOptions;
                formQuestions.push(question);
                i++;
                if (i === response.formQuestions.length) {
                  res.json({
                    status: 1,
                    message: "success",
                    questions: formQuestions,
                  });
                }
              } else {
                return res.json(questionOptions);
              }
            }
          )
        );
      } else {
        res.json(response);
      }
    });
  }

  getFormQuestionsX(req, res, next) {
    if (!Helper.verifyRequiredParams(req.params, res, ["formId"])) {
      console.log("form id not found");
      return;
    }
    formModel.getFormQuestions(req.params.formId, (response) => {
      console.log("here");
      if (response.status == 1) {
        let i = 0;
        let formQuestions = [];
        response.formQuestions.forEach((question) =>
          formModel.getFormQuestionOptions(
            question.questionId,
            (questionOptions) => {
              if (questionOptions.status == 1) {
                question["options"] = questionOptions.questionOptions;
                formQuestions.push(question);
                i++;
                if (i === response.formQuestions.length) {
                  res.json({
                    status: 1,
                    message: "success",
                    questions: formQuestions,
                  });
                }
              } else {
                return res.json(questionOptions);
              }
            }
          )
        );
      } else {
        res.json(response);
      }
    });
  }
}

function addQuestion(formId, element, callback) {
  let question = {
    formId: formId,
    questionSubText: element.questionSubText ? element.questionSubText : "",
    questionText: element.questionText,
    inputType: element.inputType,
    answerRequired: element.answerRequired,
    allowMultipleOptionAnswers: element.allowMultipleOptionAnswers,
    orderOfDelivery: element.orderOfDelivery,
  };
  formModel.insertQuestion(question, (response) => {
    if (response.status) {
      let questionId = response.insertedId;
      question["id"] = questionId;
      let options = element.options ? element.options : [];
      question["options"] = options;
      if (element.allowMultipleOptionAnswers == 1) {
        options.forEach((element) => {
          let optionobj = {
            questionId: questionId,
            optionName: element.optionName ? element.optionName : element,
          };
          formModel.insertQuestionOption(optionobj, (response) => {});
        });
      }
    }
    callback(question);
  });
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const formController = new FormController();
module.exports = formController;
