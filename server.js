const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Mars Packing List';

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/api/v1/marslist', (request, response) => {
  database('marslist').select()
    .then((marslist) => {
      response.status(200).json(marslist);
    })
    .catch((error) => {
      response.status(500).json({
        error
      })
    })
})

app.post('/api/v1/marslist', (request, response) => {
  let newPhoto = request.body

  for (let requiredParameter of ['title', 'link']) {
    if (!newPhoto[requiredParameter]) {
      return response.status(422).send({
        error: `You are missing a ${requiredParameter}`
      })
    }
  }

  database('marslist').insert(newPhoto, 'id')
    .then(photo => {
      return response.status(201).json({
        id: photo[0]
      })
    })
    .catch((error) => {
      return response.status(500).json({
        error
      })
    });
});

app.delete('/api/v1/marslist/:id', (request, response) => {
  let id = request.params.id

  database('marslist').where('id', id).del()
    .then(resp => {
      if (resp === 1) {
        return response.status(201).json({
          message: 'Success'
        })
      } else {
        return response.status(404).json({
          message: 'No photo exists'
        })
      }
    })
    .catch((error) => {
      return response.status(500).json({
        error
      })
    })
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}`)
})

module.exports = {
  app,
  database
}