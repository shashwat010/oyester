const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true 
    },
    password : {
        type : String,
        required : true
    },
    phone : {
        type : Number,
        required : true
    }
})

const user = mongoose.model('user',userSchema);
user.createIndexes();
module.exports = user;