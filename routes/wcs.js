let express = require('express');
let router = express.Router();
let wcsController = require('../controllers/wcsController');


//----------- Women Cannabis Study ------------------
router.post('/join', wcsController.join);
router.post('/contact', wcsController.contact);
router.post('/vctcontact', wcsController.vctcontact);
module.exports = router;