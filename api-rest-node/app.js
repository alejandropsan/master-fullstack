'use strict'

// REQUIRES
const express = require('express');
const bodyparser = require('body-parser');

// EJECUTAR EXPRESS
const app = express();
// CARGAR ARCHIVOS DE RUTAS
const user_routes = require('./routes/user');
const topic_routes = require('./routes/topic');
const comment_routes = require('./routes/comment');

// MIDDLEWARES
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

// CORS
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


// REESCRIBIR RUTAS

// RUTA/MÉTODO DE PRUEBA
app.use('/api', user_routes);
app.use('/api', topic_routes);
app.use('/api', comment_routes);

// EXPORTAR EL MÓDULO
module.exports = app;