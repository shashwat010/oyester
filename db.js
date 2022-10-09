const mongoose=require('mongoose');

const mongoURI='mongodb+srv://shashwat010:shashwatjain@cluster0.ytqalcg.mongodb.net/?retryWrites=true&w=majority'

const connectToMongo= ()=>{
    mongoose.connect(mongoURI,()=>{
        console.log('Connected to mongoose successfully');
    })
}

module.exports= connectToMongo;