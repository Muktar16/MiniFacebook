var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    userName : {type:String, require:true},
    email : {type:String, require:true},
    text:{type:String, require:true},
    creation_dt:{type:Date, require:true}
});

module.exports = mongoose.model('Post',schema);