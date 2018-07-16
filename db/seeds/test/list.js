exports.seed = function (knex, Promise) {
  return knex('marslist').del()
    .then(function () {
      return Promise.all([
        knex('marslist').insert({
          title: 'Tacos',
          packed: false
        }, 'id'),
        knex('marslist').insert({
          title: 'Scooter',
          packed: false
        }, 'id')
      ])
    });
};