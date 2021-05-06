const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const Forum = require('../controller/forum');
let forum = new Forum();

suite('Functional Tests', function() {

  let threadID;
  let replyID; 

  test('Creating a new thread', (done)=>{
    chai
      .request(server)
      .post('/api/threads/test')
      .send({
        'text': "hello",
        'delete_password': 1234,
      })
      .end((err, res)=>{
        assert.equal(res.status, 200);
        threadID = res.redirects[0].split('/')[res.redirects[0].split('/').length-1];
        done();
      })
  });

  test('Creating a new reply', (done)=>{
    chai
      .request(server)
      .post('/api/replies/test')
      .send({
        'thread_id': threadID,
        'text': "reply",
        'delete_password': 1234,
      })
      .end((err, res)=>{
        assert.equal(res.status, 200);
        replyID = res.redirects[0].split('=')[1]
        // console.log(threadID, replyID)
        done();
      })
  });

  test('Viewing the 10 most recent threads with 3 replies each', (done)=>{
    chai
      .request(server)
      .get('/api/threads/test')
      .end((err, res)=>{
        assert.equal(res.status, 200);
        done();
      })
  });

  test('Viewing a single thread with all replies:', (done)=>{
    chai
      .request(server)
      .get('/api/replies/test?thread_id='+threadID)
      .end((err, res)=>{
        assert.equal(res.status, 200);
        done();
      })
  });

  test('Reporting a thread', (done)=>{
    chai
      .request(server)
      .put('/api/threads/test')
      .send({
        'thread_id': threadID
      })
      .end((err, res)=>{
        assert.equal(res.status, 200);
        assert.equal(res.body, 'success');
        done();
      })
  });

  test('Reporting a reply', (done)=>{
    chai
      .request(server)
      .put('/api/replies/test')
      .send({
        'thread_id': threadID,
        'reply_id': replyID
      })
      .end((err, res)=>{
        assert.equal(res.status, 200);
        assert.equal(res.body, 'success');
        done();
      })
  });

  test('Deleting a reply with the incorrect password', (done)=>{
    chai
      .request(server)
      .delete('/api/replies/test')
      .send({
        'thread_id': threadID,
        'reply_id': replyID,
        'delete_password': 12,
      })
      .end((err, res)=>{
        assert.equal(res.status, 200);
        assert.equal(res.body, 'incorrect password');
        done();
      })
  });

  test('Deleting a reply with the correct password', (done)=>{
    chai
      .request(server)
      .delete('/api/replies/test')
      .send({
        'thread_id': threadID,
        'reply_id': replyID,
        'delete_password': 1234,
      })
      .end((err, res)=>{
        assert.equal(res.status, 200);
        assert.equal(res.body, 'success');
        done();
      })
  });

  test('Deleting a thread with the incorrect password', (done)=>{
    chai
      .request(server)
      .delete('/api/threads/test')
      .send({
        'thread_id': threadID,
        'delete_password': 12,
      })
      .end((err, res)=>{
        assert.equal(res.status, 200);
        assert.equal(res.body, 'incorrect password');
        done();
      })
  });

  test('Deleting a thread with the correct password', (done)=>{
    chai
      .request(server)
      .delete('/api/threads/test')
      .send({
        'thread_id': threadID,
        'delete_password': 1234,
      })
      .end((err, res)=>{
        assert.equal(res.status, 200);
        assert.equal(res.body, 'success');
        done();
      })
  });

  forum.clearDB();

});
