const mongoose = require('mongoose');
var Minio = require("minio");
var story = require('../models/story');
const crypto = require('crypto');
const User = mongoose.model('User');

module.exports.saveStory = ( (req, res) => {

    User.findOne({ _id: req._id }, async(err, user) => {
        if (!user)
            return res.status(404).json({ status: false, message: 'User record not found.' });
        else
        {
            var uuidName = crypto.randomUUID();
            //Create a new story and save to mongodb
            const newStory = new story({
                userName:user.userName,
                email: user.email,
                storyUUID: uuidName
            });
            //connect to minio
            const minioClient = new Minio.Client({
                endPoint: '127.0.0.1',
                port: 9000,
                useSSL: false,
                accessKey: 'p5K6iMr8vA5OkthO',
                secretKey: 'nSFvxXOh8U6me3GKadM0f8N4RarvfEo3'
            });

            minioClient.fPutObject('stories', uuidName, req.file.path, function (err, objInfo) {
                if(err) {return console.log(err)}
            });

            try {
                const savedStory = await newStory.save();
                res.send({ ResponeseMessage: 'Story file Uploaded Successfully' });
            } catch (err) {
                res.status(400).send(err);
            }
        }
    }
    );
});

module.exports.getStories = (async (req,res) =>{
    try{
        const Stories = await story.find({email:{$ne: req.params.currentUser}}).sort({$natural:-1}).limit(10); 
        res.send(Stories);
    } catch(err){
        res.status(400).send({ResponeseMessage: 'Missing Image File'});
    }
});
