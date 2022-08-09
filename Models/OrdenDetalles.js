const Sequelize = require('sequelize');
const Productos = require('./Productos');
const Orden = require('./Orden');
const db = require('../config/db');

const OrdenDetalles = db.define('OrdenDetalles', {
    Id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    Cantidad: Sequelize.INTEGER(11),
    Precio: Sequelize.DECIMAL(10, 2)
});


OrdenDetalles.belongsTo(Productos);
OrdenDetalles.belongsTo(Orden);



module.exports = OrdenDetalles