const db2 = require("../config/userDBConfig");
let Helper = require("../helpers/general");
let Mail = require("../helpers/mail");
let userModel = require("../models/userModel");
let participantModel = require("../models/participantModel");
let verificationModel = require("../models/verificationModel");
let bcrypt = require("bcrypt");

class UsersController {
  getUsers(req, res, next) {
    db2.query("SELECT * FROM user_profile", (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        res.json(results);
      }
    });
  }

  addUser(req, res, next) {
    console.log(req);
    const requiredParameters = [
      "firstName",
      "lastName",
      "email",
      "gender",
      "birthdate",
      "city",
      "state",
      "country",
      "status",
      "password",
    ];
    if (!Helper.verifyRequiredParams(req.body, res, requiredParameters)) {
      return;
    }
    const sql =
      "INSERT INTO user_profile (firstName, lastName, email, password, phone, organization, gender, birthdate, city, state, country, status) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const body = {
      id: "",
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      organization: req.body.organization,
      gender: req.body.gender,
      birthdate: req.body.birthdate,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      status: req.body.status,
    };
    bcrypt.hash(body.password, 10, (error, hash) => {
      db2.query(
        sql,
        [
          body.firstName,
          body.lastName,
          body.email,
          hash,
          body.phone,
          body.organization,
          body.gender,
          body.birthdate,
          body.city,
          body.state,
          body.country,
          body.status,
        ],
        (error, results, fields) => {
          if (error) {
            return res.status(500).json({ error: error.message });
          }
          if (results.affectedRows === 1) {
            body.id = results.insertId;
            verificationModel.createEmailVerificationEntry(
              body.id,
              (createEmailVerificationEntrySuccess) => {
                Mail.sendEmail({
                  path: "../views/emails/verifyEmail.hbs",
                  subject: "Cognizance VCT - Please Verify Your Email",
                  userId: body.id,
                  email: body.email,
                  emailToken: createEmailVerificationEntrySuccess,
                });
              },
              (createEmailVerificationEntryFailure) => {
                res
                  .status(500)
                  .json({ error: "Email Verification operation failed." });
              }
            );
            return res.status(201).json(body);
          } else {
            return res
              .status(500)
              .json({ error: "Database operation failed." });
          }
        }
      );
    });
  }
  verifyEmail(verifyEmailRequest, verifyEmailResponse, next) {
    const { userId, emailToken } = verifyEmailRequest.query;
    verificationModel.updateEmailVerificationStatus(
      userId,
      emailToken,
      (updateEmailVerificationSuccess) => {
        userModel.updateUser(
          userId,
          "status",
          "emailVerified",
          (updateUserSuccess) => {
            return verifyEmailResponse.redirect(
              "https://cognizancevct.com/verifyEmail/success.html"
            );
          }
        ),
          (updateUserFailure) => {
            return verifyEmailResponse.redirect(
              "https://cognizancevct.com/verifyEmail/failure.html"
            );
          };
      },
      (updateEmailVerificationStatusFailure) => {
        return verifyEmailResponse.redirect(
          "https://cognizancevct.com/verifyEmail/failure.html"
        );
      }
    );
  }
  updateUserStatusById(req, res, next) {
    if (
      !req.body ||
      req.body[0].op !== "replace" ||
      req.body[0].path !== "status"
    ) {
      return res.status(400).json({ message: "Invalid Body" });
    }
    const status = req.body[0].value;
    db2.query(
      "UPDATE user_profile SET status = ? WHERE id = ?",
      [status, req.params.userId],
      (error, results, fields) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }
        if (results.affectedRows === 1) {
          if (status === "Not Approved") {
            db2.query(
              "SELECT email FROM user_profile WHERE id = ?",
              [req.params.userId],
              (error, rows, fields) => {
                if (error || rows.length < 1) {
                  return;
                }
                Mail.sendEmail({
                  path: "../views/emails/rejected.hbs",
                  subject:
                    "Cognizance VCT - Not Approved as Virtual Clinical Trial Participant",
                  email: rows[0],
                  text: "Not Approved",
                });
              }
            );
          }
          return res.json({ message: "Successfully Updated" });
        } else {
          return res.status(500).json({ error: "Database operation failed." });
        }
      }
    );
  }

  deleteUserById(req, res, next) {
    db2.query(
      "DELETE FROM user_profile WHERE id = ?",
      [req.params.userId],
      (error, results, fields) => {
        if (error) {
          res.status(500).json({ error: error.message });
        } else {
          res.json(results);
        }
      }
    );
  }

  login(req, res, next) {
    let requiredParameters = ["email", "password"];
    if (Helper.verifyRequiredParams(req.body, res, requiredParameters)) {
      let email = req.body.email;
      let password = req.body.password;

      userModel.getUserByEmail(
        email,
        (user) =>
          bcrypt.compare(password, user.password, (error, response) => {
            if (error) {
              return res
                .status(500)
                .json({ status: 0, message: error.message });
            }

            if (response) {
              delete user.password;
              participantModel.getParticipantById(
                user.id,
                (participant) =>
                  res.json({
                    status: 1,
                    message: "Success",
                    data: participant,
                  }),
                (notFound) =>
                  res.json({
                    status: 2,
                    message: "Participant Not Found",
                    data: user,
                  }),
                (error) => {
                  console.log(error);
                  res
                    .status(500)
                    .json({ status: 0, message: "Invalid Email or Password" });
                }
              );
            } else {
              res
                .status(500)
                .json({ status: 0, message: "Invalid Email or Password" });
            }
          }),
        (error) =>
          res
            .status(500)
            .json({ status: 0, message: "Invalid Email or Password." })
      );
    }
  }

  forgotPassword(req, res, next) {
    let requiredParameters = ["email"];
    if (Helper.verifyRequiredParams(req.body, res, requiredParameters)) {
      let email = req.body.email;

      userModel.getUserByEmail(
        email,
        (response) => {
          let passwordToken = generateToken();
          let emailData = {
            path: "../views/emails/forgotPassword.hbs",
            subject: "Cognizance VCT - Reset Password",
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName,
            passwordToken: passwordToken,
            text: "Reset Password",
          };
          userModel.updateUser(
            response.id,
            "forgotPasswordToken",
            passwordToken,
            (success) => {
              Mail.sendEmail(emailData);
              res.json({
                status: 1,
                message:
                  "Forgot Password instructions have been sent to your email.",
              });
            },
            (error) => res.status(500).json(response)
          );
        },
        (error) =>
          res.json({
            status: 0,
            message: "Record not found against the given Email.",
          })
      );
    }
  }

  resetPassword(req, res, next) {
    let requiredParameters = ["password", "passwordToken"];
    if (Helper.verifyRequiredParams(req.body, res, requiredParameters)) {
      const password = req.body.password;
      const passwordToken = req.body.passwordToken;
      userModel.getUserByPasswordToken(
        passwordToken,
        (response) =>
          bcrypt.hash(password, 10, (error, hash) =>
            userModel.updateUserPassword(
              response.id,
              hash,
              (resp) =>
                res.json({
                  status: 1,
                  message: "Your Password is updated successfully.",
                }),
              (err) => res.status(500).json({ message: err })
            )
          ),
        (error) =>
          res.status(500).json({
            status: 0,
            message:
              "Either you have already updated your password or token is expired.",
          })
      );
    }
  }
}

function generateToken() {
  let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  const string_length = 50;
  let randomstring = "";
  for (let i = 0; i < string_length; i++) {
    let rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum, rnum + 1);
  }
  return randomstring;
}

const usersController = new UsersController();
module.exports = usersController;
