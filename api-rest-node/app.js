'use strict'

// REQUIRES
var express = require('express');
var bodyparser = require('body-parser');

// EJECUTAR EXPRESS
var app = express();
// CARGAR ARCHIVOS DE RUTAS

// MIDDLEWARES
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

// CORS

// REESCRIBIR RUTAS

// RUTA/MÉTODO DE PRUEBA
app.get('/prueba', (req, res) =>{
    return res.status(200).send("<h1>Hola mundo soy un backend</h1>")
    // return res.status(200).send({
    //     nombre: 'Alejandropsan',
    //     message: 'Hola mundo desde el backend con Node'
    // })
})

app.post('/prueba', (req, res) =>{
    
     return res.status(200).send({
         nombre: 'Alejandropsan',
         message: 'Hola mundo desde el backend con Node soy un metodo POST'
     });
});

// EXPORTAR EL MÓDULO
module.exports = app;