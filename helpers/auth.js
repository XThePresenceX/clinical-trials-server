let constants = require('../config/constants');
let jwt = require('jsonwebtoken');

class Auth {
  isAuthenticated(req, res, next) {
      let token = req.get('session_token');
      jwt.verify(token, constants.JWT_SECRET_TOKEN, (err, decoded) => {
          if (err) {
              res.json({ status: 302, message: "INVALID_SESSION_TOKEN" });
              return false;
          }
          let obj = {
              userId: decoded.userId,
          }
          res.locals.user = obj;
          next();
      });
  }

  generateToken(user, callBack) {
      let token = jwt.sign(
          user,
          constants.JWT_SECRET_TOKEN,
          { expiresIn: '500 days' }
      );
      return callBack(token)
  }
}

const auth = new Auth();
module.exports = auth;
