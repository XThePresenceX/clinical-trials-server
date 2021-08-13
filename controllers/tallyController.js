let TallyModel = require("../models/tallyModel");
const { insertIntoTally } = require("../models/tallyModel");

class TallyController {
  addUserToTally(req, res) {
    const participantID = req.params.participantID;
    TallyModel.insertIntoTally(participantID, (response) => {
      if (response) {
        res.send({ status: 1, tallyCreated: response });
      } else {
        res.send({ status: 0 });
      }
    });
  }
  updateTallyTable(req, res) {
    const participantID = req.body.participantID;
    // console.log("this is", TallyModel.getTallyfromParticipantID(participantID));
    // let tallyNum = TallyModel.getTallyfromParticipantID(participantID);
    // console.log(tallyNum);
    //TallyModel.insertIntoTally(participantID);
    TallyModel.getAndUpdateTally(participantID);
  }

  updateResetTallyTable(req, res) {
    const participantID = req.body.participantID;
    // console.log("this is", TallyModel.getTallyfromParticipantID(participantID));
    // let tallyNum = TallyModel.getTallyfromParticipantID(participantID);
    // console.log(tallyNum);
    //TallyModel.insertIntoTally(participantID);
    TallyModel.getAndUpdateResetTally(participantID);
  }

  getTally(req, res) {
    const participantID = req.params.participantID;
    TallyModel.getTallyfromParticipantID(participantID, (response) => {
      if (response) {
        res.send({ status: 1, tally: response });
      } else {
        res.send({ status: 0 });
      }
    });
  }

  getResetTally(req, res) {
    const participantID = req.params.participantID;
    TallyModel.getResetTallyfromParticipantID(participantID, (response) => {
      if (response) {
        res.send({ status: 1, tally: response });
      } else {
        res.send({ status: 0 });
      }
    });
  }
}

const tallyController = new TallyController();
module.exports = tallyController;
