exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('marslist', function (table) {
      table.increments('id').primary();
      table.string('title');
      table.string('');
      table.timestamps(true, true)
    })
  ])
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('marslist')
  ])
};