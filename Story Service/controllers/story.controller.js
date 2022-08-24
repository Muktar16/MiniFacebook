const mongoose = require('mongoose');
var Minio = require("minio");
var story = require('../models/story');
const crypto = require('crypto');
//const User = mongoose.model('User');
const axios = require('axios');

const authUrl = "http://localhost:3000/auth/verifyJWT"

async function verifyToken(request) {
    let response;
    await axios.post(authUrl, request)
        .then(res => {
            //console.log('tt2: ', res);
            response = res;
        })
        .catch(error => {
            console.log(error);
        });
    //console.log("response",response);
    return response;
  }


module.exports.saveStory = ( async(req, res) => {
    console.log("saveStory backend");
    var result = await verifyToken({token: req.headers['authorization'].split(' ')[1]});

    if(result.data.status)
    {
        var uuidName = crypto.randomUUID();
        //Create a new story and save to mongodb
        const newStory = new story({
            userName:result.data.user.userName,
            email: result.data.user.email,
            storyUUID: uuidName
        });
        //connect to minio
        const minioClient = new Minio.Client({
            endPoint: '127.0.0.1',
            port: 9000,
            useSSL: false,
            accessKey: '4AgjeEKZxVvp92jb',
            secretKey: 'UQqPD9AcQxVAA0pE2teObULkDy4863vc'
        });

        minioClient.fPutObject('photos', uuidName, req.file.path, function (err, objInfo) {
            if(err) {return console.log(err)}
        });

        try {
            const savedStory = await newStory.save();
            res.send({ ResponeseMessage: 'Story file Uploaded Successfully' });
        } catch (err) {
            res.status(400).send(err);
        }
    }
    else{
        return res.status(404).json({ status: false, message: 'User record not found.' });
    }

    // User.findOne({ _id: req._id }, async(err, user) => {
    //     if (!user)
    //         return res.status(404).json({ status: false, message: 'User record not found.' });
    //     else
    //     {
    //         var uuidName = crypto.randomUUID();
    //         //Create a new story and save to mongodb
    //         const newStory = new story({
    //             userName:user.userName,
    //             email: user.email,
    //             storyUUID: uuidName
    //         });
    //         //connect to minio
    //         const minioClient = new Minio.Client({
    //             endPoint: '127.0.0.1',
    //             port: 9000,
    //             useSSL: false,
    //             accessKey: '4AgjeEKZxVvp92jb',
    //             secretKey: 'UQqPD9AcQxVAA0pE2teObULkDy4863vc'
    //         });

    //         minioClient.fPutObject('photos', uuidName, req.file.path, function (err, objInfo) {
    //             if(err) {return console.log(err)}
    //         });

    //         try {
    //             const savedStory = await newStory.save();
    //             res.send({ ResponeseMessage: 'Story file Uploaded Successfully' });
    //         } catch (err) {
    //             res.status(400).send(err);
    //         }
    //     }
    // }
    //);
});

module.exports.getStories = (async (req,res) =>{
    var result = await verifyToken({token: req.headers['authorization'].split(' ')[1]});
    currentUser = result.data.user.email;
    try{
        const Stories = await story.find({email:{$ne: currentUser}}).sort({$natural:-1}).limit(10); 
        res.send(Stories);
    } catch(err){
        res.status(400).send({ResponeseMessage: 'Missing Image File'});
    }
});
