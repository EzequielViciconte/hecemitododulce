const { Sequelize } = require('sequelize');

const db = new Sequelize('ezequiel12_hecemitododulce', '277893', 'Bocala122014', {
    host: 'mysql-ezequiel12.alwaysdata.net',
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
module.exports = db;