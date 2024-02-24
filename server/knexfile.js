const config = require('./configs');

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: config.development.database
};

