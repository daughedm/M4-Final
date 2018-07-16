process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const {app, database} = require('../server');

chai.use(chaiHttp);

describe('client routes', () => {
  it('should receive a response of index.html when we hit the root endpoint', done => {
    chai.request(app)
      .get('/')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.html;
        done();
      })
  })

  it('should return a 404 for a route that does not exist', done => {
    chai.request(app)
      .get('/ihatefinals')
      .end((error, response) => {
        response.should.have.status(404);
        done();
      })
  })
})

describe('Endpoint tests', () => {

  beforeEach((done) => {
    database.migrate.rollback()
      .then(() => {
        database.migrate.latest()
          .then(() => {
            return database.seed.run()
              .then(() => {
                done()
              })
          })
      })
  })

  it('should GET all the list items', (done) => {
    chai.request(app)
      .get('/api/v1/marslist')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(2);
        response.body[0].should.have.property('id');
        response.body[0].id.should.equal(1);
        response.body[0].should.have.property('title');
        response.body[0].title.should.equal('Tacos');
        response.body[0].should.have.property('packed');
        response.body[0].packed.should.equal(false)
        done()
      })
  })

    it('should POST a new mars list item', (done) => {
      chai.request(app)
        .post('/api/v1/marslist')
        .send({
          title: 'bigfoot',
          packed: false
        })
        .end((error, response) => {
          response.should.have.status(201);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('id');
          response.body.id.should.equal(3);
          done()
        })
    })

    it('should not POST a new mars list item if missing a title', (done) => {
      chai.request(app)
        .post('/api/v1/marslist')
        .send({
          packed: false
        })
        .end((error, response) => {
          response.should.have.status(422);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.equal('You are missing a title');
          done()
        })
    })

    it('should DELETE a mars item', (done) => {
      chai.request(app)
        .delete('/api/v1/marslist/2')
        .end((error, response) => {
          response.should.have.status(201);
          response.body.should.have.property('message');
          response.body.message.should.equal('Success')
          done()
        })
    })

    it('should not DELETE a mars item if Id does not exist', (done) => {
      chai.request(app)
        .delete('/api/v1/marslist/666')
        .end((error, response) => {
          response.should.have.status(404);
          response.body.should.have.property('message');
          response.body.message.should.equal('This item does not exist')
          done()
        })
    })

    it('should PUT a mars list item', (done) => {
      chai.request(app)
        .put('/api/v1/marslist/2')
        .send({
          title: 'instagram',
          packed: true
        })
         .end((err, response) => {
           response.should.have.status(200);
           response.text.should.equal('Updated 1 item.');
           done();
         })
    })
});