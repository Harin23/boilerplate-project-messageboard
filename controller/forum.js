const mongoose = require('mongoose');

mongoose.connect(process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true}, (err)=>{
  if(err){
    console.log(err);
  }else{
    console.log("connected to DB!");
  }
});

const Threads = mongoose.Schema({
  text: {type: String, required: true},
  created_on: {type: Date, default: Date.now()},
  bumped_on: {type: Date, default: Date.now()},
  reported: {type: Boolean, default: false},
  delete_password: {type: String, required: true},
  replies: []
});

let threads = mongoose.model('threads', Threads);


class Forum{

}

module.exports = Forum;