var config = require('./../config/config');
var moment =  require('moment');
var knex = require('knex')({
  client: 'mysql',
  connection: {    
    host: config.mysqldb.host,
    user: config.mysqldb.user,
    password: config.mysqldb.password,
    database: config.mysqldb.database,
    port: config.mysqldb.port,
    timezone: 'UTC',
    typeCast: function (field, next) {
      if (field.type.trim().toLowerCase() == 'datetime') {
        return moment(field.string()).format('DD-MM-YYYY');
      }
      if (field.type.trim().toLowerCase() == 'date') {
        return moment(field.string()).format('DD-MM-YYYY');
      }
      if(field.type.trim().toLowerCase() == 'timestamp') {
        return moment(field.string()).format('DD-MM-YYYY [at] h:mm A z');
      }
      return next();
    }
  },
  pool: { min: 0, max: 10 }
});

module.exports = knex;