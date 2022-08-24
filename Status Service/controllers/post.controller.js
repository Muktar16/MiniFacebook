const mongoose = require('mongoose');
//const { verifyJwtToken } = require('../../User Service/config/jwtHelper');
var Post = require('../models/post');
const User = mongoose.model('User');
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

module.exports.savePost = async(req, res, next) => {
    var result = await verifyToken({token: req.headers['authorization'].split(' ')[1]});
    //console.log("result ",result.data.user.userName);
    if(result.data.status)
    {
        var newPost = new Post({
            userName: result.data.user.userName,
            email: result.data.user.email,
            text: req.body.text,
            creation_dt: Date.now()
        });
    
        let promise = newPost.save();
    
        promise.then((doc=>{
            return res.status(201).json(doc);
        }))
    
        promise.catch((err=>{
            return res.status(501).json(err);
        }))
    }
    else{
        return res.status()
    }
}

module.exports.getPosts = async(req, res, next) => {
    var result = await verifyToken({token: req.headers['authorization'].split(' ')[1]});
    currentUser = result.data.user.email;
    let posts = Post.find({email:{$ne: currentUser}}).limit(10).sort({$natural:-1});
    posts.exec((req, doc) =>{
        return res.status(200).json(doc);
    })
}