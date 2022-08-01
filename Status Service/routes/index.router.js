const express = require('express');
const router = express.Router();
const ctrPost = require('../controllers/post.controller');


const app=express();

app.use(express.static(__dirname + '/public'));

router.post('/savePost', ctrPost.savePost);
router.get('/getPosts',ctrPost.getPosts);

module.exports = router;



