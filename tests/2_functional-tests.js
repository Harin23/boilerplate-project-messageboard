const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

    test('Creating a new thread', (done)=>{
      chai
        .post('/api/threads/test')
        .send({
          'text': "hello",
          'delete_password': 1234,
        })
        .end((err, res)=>{
          done();
        })
    });

    test('Viewing the 10 most recent threads with 3 replies each', (done)=>{
      chai
        .get('/api/threads/test')
        .end((err, res)=>{
          done();
        })
    });

    test('Deleting a thread with the incorrect password', (done)=>{
      chai
        .delete('/api/threads/test')
        .send({
          'thread_id': 1,
          'delete_password': 12,
        })
        .end((err, res)=>{
          done();
        })
    });

    test('Deleting a thread with the correct password', (done)=>{
      chai
        .delete('/api/threads/test')
        .send({
          'thread_id': 1,
          'delete_password': 1234,
        })
        .end((err, res)=>{
          done();
        })
    });

    test('Reporting a thread', (done)=>{
      chai
        .put('/api/threads/test')
        .send({
          'thread_id': 1234
        })
        .end((err, res)=>{
          done();
        })
    });

    test('Creating a new reply', (done)=>{
      chai
        .post('/api/threads/test')
        .send({
          'thread_id': 1221,
          'text': "hello",
          'delete_password': 1234,
        })
        .end((err, res)=>{
          done();
        })
    });

    test('Viewing a single thread with all replies:', (done)=>{
      chai
        .get('/api/replies/{board}?thread_id={thread_id}')
        .end((err, res)=>{
          done();
        })
    });

    test('Deleting a reply with the incorrect password', (done)=>{
      chai
        .delete('/api/threads/test')
        .send({
          'thread_id': 1,
          'reply_id':12,
          'delete_password': 12,
        })
        .end((err, res)=>{
          done();
        })
    });

    test('Deleting a reply with the correct password', (done)=>{
      chai
        .delete('/api/threads/test')
        .send({
          'thread_id': 1,
          'reply_id':12,
          'delete_password': 1234,
        })
        .end((err, res)=>{
          done();
        })
    });

    test('Reporting a reply', (done)=>{
      chai
        .put('/api/threads/test')
        .send({
          'thread_id': 1234,
          'reply_id': 12
        })
        .end((err, res)=>{
          done();
        })
    });

});
