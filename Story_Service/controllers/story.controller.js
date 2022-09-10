const mongoose = require('mongoose');
var Minio = require("minio");
var story = require('../models/story');
const crypto = require('crypto');
//const User = mongoose.model('User');
const axios = require('axios');

const minioClient = new Minio.Client({
    endPoint: 'storyobjectdb',
    port: 9000,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin'
});

const authUrl = "http://user-service:3000/auth/verifyJWT"

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
        // const minioClient = new Minio.Client({
        //     endPoint: 'storyobjectdb',
        //     port: 9000,
        //     useSSL: false,
        //     accessKey: '4AgjeEKZxVvp92jb',
        //     secretKey: 'UQqPD9AcQxVAA0pE2teObULkDy4863vc'
        // });

        minioClient.makeBucket('photos', 'us-east-1', function(err) {
            if (err) return console.log(err)
    
            console.log('Bucket created successfully');
        });

        

      
        minioClient.fPutObject('photos', uuidName, req.file.path, function (err, objInfo) {
            if(err) {return console.log(err)}
            else console.log("Object successfully saved");
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

});



module.exports.getStories = (async (req,res) =>{
    var result = await verifyToken({token: req.headers['authorization'].split(' ')[1]});

    currentUser = result.data.user.email;
    try{
        const Stories = await story.find({email:{$ne: currentUser}}).sort({$natural:-1}).limit(10); 
        //const Stories = await story.find().sort({$natural:-1}).limit(10);
        res.send(Stories);
    } catch(err){
        res.status(400).send({ResponeseMessage: 'Missing Image File'});
    }
});


module.exports.storyInd = ((req, res) =>{
    try {
        let data;

        minioClient.getObject('photos', req.params.id, (err, objStream) => {

            console.log('DHUKSEE');
            if(err) {
               
                return res.status(404).send({ message: "Image not found" });
            } 
            //console.log("req is " + req.params.id);
            objStream.on('data', (chunk) => {
                data = !data ? new Buffer(chunk) : Buffer.concat([data, chunk]);
            });
            objStream.on('end', () => {
                res.writeHead(200, { 'Content-Type': 'image/png' });
                res.write(data);
                res.end();
            });
        });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error at fetching image" });
    }
});
