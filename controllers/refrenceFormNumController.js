let RefrenceFormNumModel = require("../models/refrenceFormNumModel");

class RefrenceFormController {
  getRefrenceFormNum(req, res) {
    const formId = req.params.formId;
    RefrenceFormNumModel.getRefrenceFormNumFromFormID(formId, (response) => {
      if (response) {
        console.log(response);
        res.send({ status: 1, repeatFormNumber: response });
      } else {
        res.send({ status: 0 });
      }
    });
  }
}

const refrenceFormNumController = new RefrenceFormController();
module.exports = refrenceFormNumController;
