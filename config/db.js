const { Sequelize } = require('sequelize');
require('dotenv').config({ path: 'variables.env' });
const db = new Sequelize('heroku_2272ddedea7f0c8', process.env.HEROKUUSER, process.env.HEROKUPASS, {
    host:process.env.HOST ,
    dialect: 'mysql',
    port: '3306',
    operatorsAliases: false,
    define: {
        timestamps: false
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

db.sync().then(function(){
    console.log('Conexion Correecta Db');
},function(err){
    console.log(err);
})

module.exports = db;