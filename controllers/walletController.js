'use strict';
let Helper = require('../helpers/general');
let studyModel = require('../models/studyModel')
let walletModel = require('../models/walletModel')

//----------------------------------------------------------------------------------
//                             STUDY COMPLETED BY A USER
//----------------------------------------------------------------------------------

module.exports.updateWallet = (req, res, next) => {
	let requiredParameters = ['studyId', 'participantId'];
	if (Helper.verifyRequiredParams(req.body, res, requiredParameters)) {
    
    let studyId = req.body.studyId;
    let participantId = req.body.participantId;

		studyModel.getStudyById(studyId, (response) => {
			if(response) {
        let walletObj = {
          participantId: participantId,
          studyId: studyId,
          cashishPoints: response.cashishPoints
        }

        walletModel.checkStudyWallet(participantId, studyId, (response) => {
          if(response) {
            res.json({status: 0, message: "This study is already filled by the participant."});
          } else {
            walletModel.updateWallet(walletObj, (response) => {
              if(response.status == 1) {
                res.json({status: 1, message: "Wallet is updated successfully."});
              } else {
                res.json({status: 0, message: response.message});		
              }
            })
          }
        })
			} else {
				res.json({status: 0, message: "Incorrect survey id."});
			}
		})
	}
}

//----------------------------------------------------------------------------------
//                                GET USER WALLET
//----------------------------------------------------------------------------------

module.exports.getParticipantWallet = (req, res, next) => {
  let participantId = req.params.participantId;
  walletModel.getParticipantWallet(participantId, (response) => {
    if(response.status == 1) {
      return res.json(response);
    } else {
      return res.json({ status: 0, message: response.message });
    }
  })
}