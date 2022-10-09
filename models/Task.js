const mongoose=require('mongoose');
const {Schema}=mongoose;

const taskSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    desc:{
        type:String,
    },
    assignedTo:{
        type:String,
        required:true
    },
    deadline:{
        type:Date
    },
    assignedAt:{
        type:Date,
        default:Date.now
    },
    assignedBy:{
        type:String,
        required:true
    },
})

const Notes=mongoose.model('task',taskSchema);
module.exports=Notes;