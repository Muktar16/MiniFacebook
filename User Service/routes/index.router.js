const express = require('express');
const router = express.Router();
const ctrlUser = require('../controllers/user.controller');

//const app=express();
//app.use(express.static(__dirname + '/public'));

router.post('/register', ctrlUser.register);
router.post('/authenticate', ctrlUser.authenticate);
router.get('/userProfile', ctrlUser.userProfile);
router.post('/verifyJWT', ctrlUser.verifyJwtToken);

module.exports = router;