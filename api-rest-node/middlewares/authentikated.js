'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'clave-secreta-para-generar-el-token-3351';

exports.authentikated = function(req, res, next){

    // COMPROBAR SI LLEGA LA CABECERA DE AUTORIZACIÓN
    if(!req.headers.authorization){
        return res.status(403).send({
            message: 'La petición no tiene la cabecera de authorization'
        });
    }
    // LIMPIAR EL TOKEN Y QUITAR COMILLAS
    const token = req.headers.authorization.replace(/['"]+/g, '');

    
    try{
        // DECODIFICAR EL TOKEN
        const payload = jwt.decode(token, secret);

        // COMPROBAR SI EL TOKEN HA EXPIRADO
        if(payload.exp <= moment().unix()){
            return res.status(404).send({
                message: 'El token ha expirado'
            });
        }else {
            // ADJUNTAR USUARIO IDENTIFICADO A LA REQUEST
        req.user = payload;
        }

    }catch(ex){
        return res.status(404).send({
            message: 'El token no es válido'
        });
    }

    

    // PASAR A LA ACCIÓN
    next();
};