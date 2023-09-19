require('dotenv').config()
const knex = require('knex')({
    client: 'mysql',
    connection: {
    host : process.env.HOST,
    user : process.env.USER_DB,
    password : process.env.PASS_DB,
    database : process.env.NAME_DB
    },
    pool : {
        min : 0,
        max : 7
    }
})

module.exports = knex