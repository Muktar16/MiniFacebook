const express = require('express');
const router = express.Router();
const multer = require('multer');
const ctrStory = require('../controllers/story.controller');
//const jwtHelper = require('../config/jwtHelper');

const app=express();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })

app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));

router.post('/saveStory',upload.single("files"),ctrStory.saveStory);
router.get('/getStories',ctrStory.getStories);
router.get('/photos',ctrStory.storyInd);


module.exports = router;
