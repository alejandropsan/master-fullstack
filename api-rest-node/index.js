'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3999;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/api_rest_node', { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log('La conexión a la base de datos de Mongo se ha realizado correctamente!!');

            // CREAR EL SERVIDOR
            app.listen(port, () => {
                console.log('El servidor http://localhost:3999 está escuchando en el puerto ' + port);
            })


        })
        .catch(error => console.log(error));