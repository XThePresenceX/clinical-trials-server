const db2 = require('../config/dbConfig');
let Helper = require('../helpers/general');
let Mail = require('../helpers/mail');
let verificationModel = require('../models/verificationModel');
let bcrypt = require('bcrypt');
let NodeCache = require( "node-cache" );
const myCache = new NodeCache( { stdTTL: 100, checkperiod: 120 } );

class TestResultController {
    
    sendOTP(req, res, next) {
        const requiredParameters = ['email_id', 'participant_id'];
        if (!Helper.verifyRequiredParams(req.body, res, requiredParameters)) {
          return;
        }
        const sql = "SELECT * FROM test_result WHERE email_id = '" + req.body.email_id + "' and participant_id = '" + req.body.participant_id + "'";

        db2.query(sql, (error, results, fields) => {
          if (error) {
            return res.status(500).json({status: '500', message: 'Database connection problem'});
          }
          if(results.length < 1) {
            return res.status(401).json({status: '401', message: 'Incorrect credentials. Please try again.'});
          }
          else {
            //call generate otp 
            var randomOTP = generateToken();
            var value = myCache.get( req.body.participant_id );
            if(value == undefined)
            {
              //save it in cache for ttl. participant id as key and otp as value
              var myObj = { randomOTP: randomOTP, wrongTries: 0 };
              myCache.set( req.body.participant_id, myObj, 300);
            }
            else
            {
              //save it in cache for ttl. participant id as key and otp as value
              var myObj = { randomOTP: randomOTP, wrongTries: value.wrongTries };
              myCache.set( req.body.participant_id, myObj, 300);
            }
            

            //send otp to their email
            Mail.sendEmail({
              path: '../views/emails/otpEmail.hbs',
              subject: 'Cognizance VCT - Your OTP',
              email: req.body.email_id,
              randomOTP: randomOTP
            });

            return res.status(200).json({status: '200', message: 'Success'});
          }
        });
      }
    
    
      seeTestResult(req, res, next) {
        const requiredParameters = ['email_id', 'participant_id', 'otp'];
        if (!Helper.verifyRequiredParams(req.body, res, requiredParameters)) {
          return;
        }

        var value = myCache.get( req.body.participant_id );

        if ( value == undefined ){
            // no such key exists in the chache, invalid participant_id
            return res.status(500).json({status: '500', message: 'Invalid key'});
        }
        if(value.wrongTries <= 3)
        {
          if(value.randomOTP == req.body.otp)
          {
            //send the result 
            const sql = "SELECT covid_result FROM test_result WHERE email_id = '" + req.body.email_id + "' and participant_id = '" + req.body.participant_id + "'";

            db2.query(sql, (error, results, fields) => {
              if (error) {
                return res.status(500).json({status: '500', message: 'Database connection problem'});
              }
              if(results.length < 1) {
                return res.status(401).json({status: '401', message: 'Incorrect credentials. Please try again.'});
              }
              else {
                return res.status(200).json({status: '200', message: "Success", result: results[0].covid_result});
              }
            });
          }
          else
          {
            var myObj = { randomOTP: value.randomOTP, wrongTries: value.wrongTries+1 };
            if(value.wrongTries == 3)
              myCache.set( req.body.participant_id, myObj, 1800);
            else
              myCache.set( req.body.participant_id, myObj, 300);

            //incorrect otp
            return res.status(401).json({status: '401', message: 'Incorrect OTP. Please try again.'});
          }

        }
        else
        {
          return res.status(401).json({status: '401', message: 'Too many failed attempts. Please wait 30 minutes and contact mia@audaciabio.com'});
        }
        
      }

      addPcrResult(req, res, next) {
        const requiredParameters = ['email_id', 'participant_id', 'otp', 'pcr_result'];
        if (!Helper.verifyRequiredParams(req.body, res, requiredParameters)) {
          return;
        }

        var value = myCache.get( req.body.participant_id );
        
        if ( value == undefined ){
            // no such key exists in the chache, invalid participant_id
            return res.status(500).json({status: '500', message: 'Invalid key'});
        }
        else if(value.randomOTP == req.body.otp)
        {
          //send the result 
          const sql = "UPDATE test_result SET pcr_result='" + req.body.pcr_result + "' WHERE email_id = '" + req.body.email_id + "' and participant_id = '" + req.body.participant_id + "'";

          db2.query(sql, (error, results, fields) => {
            if (error) {
              return res.status(500).json({status: '500', message: 'Database connection problem'});
            }
            if(results.length < 1) {
              return res.status(401).json({status: '401', message: 'Something went wrong. Please try again.'});
            }
            else {
              return res.status(200).json({status: '200', message: "Success"});
            }
          });
        }
        else
        {
          //incorrect otp
          return res.status(401).json({status: '401', message: 'Something went wrong. Please try again.'});
        }
      }

}

function generateToken() {
	let chars = "0123456789";
	const string_length = 6;
	let randomstring = '';
	for (let i=0; i<string_length; i++) {
		let rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	return randomstring;
}

const testResultController = new TestResultController();
module.exports = testResultController;
