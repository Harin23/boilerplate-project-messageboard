'use strict';

const Forum = require('../controller/forum');
let forum = new Forum();

module.exports = function (app) {
  
  app.route('/api/threads/:board')
    .post(async (req, res)=>{
      try{
        let board = req.params.board;
        let id = await forum.createThread({...req.body, board: board});
        res.redirect('/b/'+board+'/'+id);
      }catch(err){
        res.json(err)
      }
    })
    .get(async (req, res)=>{
      try{
        let board = req.params.board;
        let threads = await forum.getThreads(board);
        res.json(threads)
      }catch(err){
        res.json(err)
      }
    })
    .put(async (req, res)=>{
      try{
        let report = await forum.reportThread(req.body.thread_id);
        res.json(report);
      }catch(err){
        res.json(err)
      }
    })
    .delete(async (req, res)=>{
      try{
        let deleted = await forum.deleteThread(req.body);
        res.json(deleted)
      }catch(err){
        console.log(err)
        res.json(err)
      }
    })
    
  app.route('/api/replies/:board')
    .post(async (req, res)=>{
      try{
        let board = req.params.board;
        let threadID = req.body.thread_id;
        let id = await forum.reply(
          {text: req.body.text, 
          delete_password: req.body.delete_password}, 
          threadID);
        res.redirect('/b/'+board+'/'+threadID+'?reply_id='+id)
      }catch(err){
        res.json(err)
      }
    })
    .get(async (req, res)=>{
      try{
        let thread = await forum.getThread(req.query.thread_id);
        res.json(thread)
      }catch(err){
        res.json(err)
      }
    })
    .put(async (req, res)=>{
      try{
        let report = await forum.reportReply(req.body.thread_id, req.body.reply_id);
        res.json(report);
      }catch(err){
        res.json(err)
      }
    })
    .delete(async (req, res)=>{
      try{
        let deleted = await forum.deleteReply(req.body);
        res.json(deleted)
      }catch(err){
        console.log(err)
        res.json(err)
      }
    })

};
