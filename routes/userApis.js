let express = require('express');
let constants = require('../config/constants');
let router = express.Router();
let usersController = require('../controllers/usersController');

// router.use('/', (req, res, next) => {
//   if (req.get('Authorization') === '' || req.get('Authorization') === null || req.get('Authorization') === undefined)
//         return res.json({ status: 401, status_message: `FIRST AUTHENTICATION_FAILED` });

//   if (req.get('apiKey') === '' || req.get('apiKey') === null || req.get('apiKey') === undefined)
//         return res.json({ status: 401, status_message: `FIRST API_KEY_MISSING` });

//   if (req.get('apiKey') != constants.API_KEY)
//         return res.json({ status: 401, status_message: `SECOND API_KEY_MISMATCHED` });

//   if (req.get('Authorization') != constants.AUTHORIZATION_TOKEN)
//         return res.json({ status: 401, status_message: `SECOND AUTHENTICATION_FAILED` });

//   return next();
// });

router.route('/').get(usersController.getUsers);
router.route('/').post(usersController.addUser);
router.route('/:userId').put(usersController.updateUserStatusById);
router.route('/:userId').delete(usersController.deleteUserById);

module.exports = router;
