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
  let newItem = request.body

  for (let requiredParameter of ['title']) {
    if (!newItem[requiredParameter]) {
      return response.status(422).send({
        error: `You are missing a ${requiredParameter}`
      })
    }
  }

  database('marslist').insert(newItem, 'id')
    .then(item => {
      return response.status(201).json({
        id: item[0]
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
    .then(res => {
      if (res === 1) {
        return response.status(201).json({
          message: 'Success'
        })
      } else {
        return response.status(404).json({
          message: 'This item does not exist'
        })
      }
    })
    .catch((error) => {
      return response.status(500).json({
        error
      })
    })
})

app.put('/api/v1/marslist/:id', (request, response) => {
  const { id } = request.params;
  const { title, packed } = request.body;
  database('marslist').where("id", id)
    .update({
      title,
      packed
    })
    .then(updatedMarsItem => {
      response.status(200).send(`Updated ${updatedMarsItem} item.`);
    })
    .catch(error => response.status(400).send(error));
});


app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}`)
})

module.exports = {
  app,
  database
}