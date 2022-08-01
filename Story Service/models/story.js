const mongoose = require('mongoose');

const schema = mongoose.Schema({
    userName:{type:String,required:true},
    email:{type: String,required: true},
    storyUUID:{type: String,required: true},
    time:{type: Date,default: Date.now,required: true}
});

module.exports = mongoose.model('Story',schema); 