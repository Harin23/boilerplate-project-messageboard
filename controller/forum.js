const mongoose = require('mongoose');

mongoose.connect(
  process.env.DB,
  {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify: false
  }, 
  (err)=>{
    if(err){
      console.log(err);
    }else{
      console.log("connected to DB!");
    }
  }
);

const replySchema = mongoose.Schema({
  text: {type: String, required: true},
  delete_password: {type: String, required: true},
  created_on: {type: Date, default: Date.now()},
  reported: {type: Boolean, default: false}
})

const threadsSchema = mongoose.Schema({
  board: {type: String, required: true},
  text: {type: String, required: true},
  created_on: {type: Date, default: Date.now()},
  bumped_on: {type: Date, default: Date.now()},
  reported: {type: Boolean, default: false},
  delete_password: {type: String, required: true},
  replies: [replySchema]
});

let Replies = mongoose.model('Replies', replySchema);
let Threads = mongoose.model('Threads', threadsSchema);


class Forum{

  createThread(data){
    return new Promise((resolve, reject)=>{
      let thread = new Threads(data);
      thread.save((err, thread)=>{
        if(err){
          reject(err)
        }else{
          resolve(thread._id);
        }
      })
    });
  };

  reply(data, threadID){
    return new Promise((resolve, reject)=>{
      let reply = new Replies(data);
      Threads.findByIdAndUpdate(
        threadID, 
        {$push: {replies: reply}, bumped_on: reply.created_on}, 
        {new: true},
        (err, thread)=>{
          if(err){
            reject(err)
          }else{
            resolve(reply._id);
          }
        })
    });
  };

  getThreads(board){
    return new Promise((resolve, reject)=>{
      Threads.find({board: board})
        .sort({bumped_on: 'desc'})
        .limit(10)
        .select('-reported -delete_password')
        .lean()
        .exec((err, threadArr)=>{
          if(err){
            reject(err)
          }else{
            resolve(threadArr)
          }
        })
    })
  }

  getThread(id){
    return new Promise((resolve, reject)=>{
      Threads.findById(id)
        .select('-reported -delete_password')
        .exec((err, thread)=>{
          if(err){
            reject(err)
          }else{
            resolve(thread)
          }
        })
    })
  }

  reportThread(id){
    return new Promise((resolve, reject)=>{
      Threads.findByIdAndUpdate(
        id,
        {reported: true},
        (err, thread)=>{
          if(err){
            reject(err)
          }else{
            resolve('success')
          }
        }
      )
    })
  }

  reportReply(thread_id, reply_id){
    return new Promise((resolve, reject)=>{
      Threads.findById(
        thread_id,
        (err, thread)=>{
          if(err){
            reject(err)
          }else{
            let reported = false;
            for(let i=0; i<thread.replies.length; i++){
              if(thread.replies[i]._id==reply_id){
                thread.replies[i].reported = true;
                reported = true;
                break;
              }
            }
            if(reported===true){
              thread.save((err, doc)=>{
                if(err){
                  reject(err)
                }else{
                  resolve('success')
                }
              });
            }else{
              reject('invalid reply id')
            }
          }
        }
      )
    })
  }

  deleteThread(data){
    return new Promise((resolve, reject)=>{
      data.delete_password = (typeof(delete_password)==='string')? data.delete_password:String(data.delete_password);
      Threads.findById(
        data.thread_id,
        (err, thread)=>{
          if(err){
            reject(err)
          }else{
            if(thread.delete_password===data.delete_password){
              Threads.findByIdAndDelete(data.thread_id, (err)=>{
                if(err){
                  reject(err);
                }else{
                  resolve('success');
                }
              })
            }else{
              reject('incorrect password');
            }
          }
        }
      )
    })
  }

  deleteReply(data){
    data.delete_password = (typeof(delete_password)==='string')? data.delete_password:String(data.delete_password);
    return new Promise((resolve, reject)=>{
      Threads.findById(
        data.thread_id,
        (err, thread)=>{
          if(err){
            reject(err)
          }else{
            let deleted = false;
            for(let i=0; i<thread.replies.length; i++){
              if(thread.replies[i]._id==data.reply_id
              && thread.replies[i].delete_password===data.delete_password){
                console.log(thread.replies[i].delete_password, data.delete_password)
                thread.replies[i].text = '[deleted]';
                deleted = true;
                break;
              }
            }
            if(deleted===true){
              thread.save((err, doc)=>{
                if(err){
                  reject(err)
                }else{
                  resolve('success')
                }
              });
            }else{
              reject('incorrect password')
            }
          }
        }
      )
    })
  }

  clearDB(){
    Threads.deleteMany({}, (err)=>{
      if(err){
        console.log(err)
      }else{
        console.log('db cleared')
      }
    })
  }

}

module.exports = Forum;