const mongoose = require('mongoose');
var Post = require('../models/post');
const User = mongoose.model('User');

module.exports.savePost = (req, res, next) => {
    User.findOne({ _id: req._id }, (err, user) => {
        if (!user)
            return res.status(404).json({ status: false, message: 'User record not found.' });
        else
            {
                var newPost = new Post({
                    userName: user.userName,
                    email: user.email,
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
        }
    );
   
}

module.exports.getPosts = (req, res, next) => {
    console.log(req.params.currentUser);
    let posts = Post.find({email:{$ne: req.params.currentUser}}).limit(10).sort({$natural:-1});
    posts.exec((req, doc) =>{
        return res.status(200).json(doc);
    })
}