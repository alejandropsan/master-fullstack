'use strict'

const validator = require('validator');
const Topic = require('../models/topic');

const controller = {

    test: function(req, res){
        return res.status(200).send({
            message: 'Hola desde TOPIC CONTROLLER'
        });
    },


    save: function(req, res){

        // RECOGER PARÁMETROS POR POST
        const params = req.body;

        // VALIDAR LOS DATOS
        try{
        var validate_title = !validator.isEmpty(params.title);
        var validate_content = !validator.isEmpty(params.content);
        var validate_lang = !validator.isEmpty(params.lang);

        }catch(err){
            return res.status(404).send({
                message: 'Faltan datos por enviar, rellena todos los campos'
            });
        }

        if(validate_title && validate_content && validate_lang){

            // CREAR EL OBJETO
            const topic = new Topic();

            // ASIGNAR VALORES
            topic.title = params.title;
            topic.content = params.content;
            topic.code = params.code;
            topic.lang = params.lang;
            topic.user = req.user.sub;

            // GUARDAR EL TOPIC 
            topic.save((err, topicStored) => {
                
                if(err || !topicStored){
                    return res.status(404).send({
                        status: 'error',
                        message: 'El tema no se ha guardado'
                    });
                }else {
                    // DEVOLVER UNA RESPUESTA
                    return res.status(200).send({
                    status: 'success',
                    topicStored
                    });
                } 
            });   
        }
    },



    getTopics: function(req, res){

        // ? CARGAR LA LIBRERÍA DE PAGINACIÓN EN LA CLASE (modelo topic)

        // ? RECOGER LA PÁGINA ACTUAL
        if(req.params.page == null || req.params.page == 0 || req.params.page == "0" || req.params.page == undefined || req.params.page == false){
            var page = 1;
        }else {
            var page = parseInt(req.params.page);
        }

        // ? INDICAR LAS OPCIONES DE PAGINACIÓN
        const options = {
            sort: { date: -1 },
            populate: 'user',
            limit: 5,
            page: page
        }

        // ? FIND PAGINADO
        Topic.paginate({}, options, (err, topics) => {

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al hacer la consulta'
                });
            }

            if(topics <= 0){
                return res.status(404).send({
                    status: 'error',
                    message: 'No existen topics registrados'
                });
            }

            // ? DEVOLVER RESULTADO (TOPICS, TOTAL DE TOPIC, TOTAL DE PÁGINAS)
            return res.status(200).send({
                status: 'success',
                topics: topics.docs,
                totalDocs: topics.totalDocs,
                totalPages: topics.totalPages
            });
        });
    },



    getTopicsByUser: function(req, res){

        // CONSEGUIR EL ID DEL USUARIO
        const userId = req.params.user;

        // FIND CON UNA CONDICIÓN DE USUARIO
        Topic.find({
            user: userId
        })
        .sort([['date', 'descending']])
        .exec((err, topics) => {
            
            if(err){
                // DEVOLVER RESULTADO
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la petición'
                });
            }

            if(topics <= 0){
                // DEVOLVER RESULTADO
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay temas para mostrar'
                });
            }


            // DEVOLVER UNA RESPUESTA
        return res.status(200).send({
            status: 'success',
            topics
        });

        });
    },



    getTopic: function(req, res){

        // ? SACAR EL ID DEL TOPIC DE LA URL
        const topicId = req.params.id;

        // ? FIND POR ID DEL TOPIC
        Topic.findById(topicId)
             .populate('user')
             .exec((err, topic) => {

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'No existe el tema'
                });
            }

        // ? DEVOLVER RESULTADO
        return res.status(200).send({
            status: 'success',
            topic
        });
        });
    },




    update: function(req, res){

        // RECOGER EL ID DEL TOPIC
        const topicId = req.params.id;

        // RECOGER LOS DATOS QUE LLEGAN POR POST
        const data = req.body;
        // VALIDAR LOS DATOS
        try{
            var validate_title = !validator.isEmpty(data.title);
            var validate_content = !validator.isEmpty(data.content);
            var validate_lang = !validator.isEmpty(data.lang);

        }catch(err){
            return res.status(404).send({
                message: 'Faltan datos por enviar, rellena todos los campos'
            });
        }

        if(validate_title && validate_content && validate_lang){
            // MONTAR UN JSON CON LOS DATOS MODIFICABLES
            const update = {
                title: data.title,
                content: data.content,
                code: data.code,
                lang: data.lang
            };
            // FIND AND UPDATE DEL TOPIC POR ID Y POR ID DE USUARIO
            Topic.findOneAndUpdate({_id: topicId, user: req.user.sub}, update, {new: true}, (err, topicUpdate) => {

                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error en la petición'
                    });
                }

                if(!topicUpdate){
                    return res.status(404).send({
                        status: 'error',
                        message: 'No se ha podido actualizar el tema'
                    })
                }

                // DEVOLVER UNA RESPUESTA
                return res.status(200).send({
                    status: 'success',
                    topic: topicUpdate
                });

            });

        }else{
            return res.status(400).send({
                status: 'error',
                message: 'La validación de los datos no es correcta'
            });
        }
    },




    delete: function(req, res){

        // ? SACAR EL ID DEL TOPIC DE LA URL
        const topicId = req.params.id;

        // ? FIND AND DELETE POR TOPICID Y POR USERID
        Topic.findOneAndDelete({_id: topicId, user: req.user.sub}, (err, topicRemoved) => {
            
                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error en la petición'
                    });
                }

                if(!topicRemoved){
                    return res.status(404).send({
                        status: 'error',
                        message: 'No se ha podido eliminar el tema'
                    })
                }
            
            // ? DEVOLVER RESPUESTA
            return res.status(200).send({
                status: 'success',
                topic: topicRemoved
            });
        });
    },





    search: function(req, res){

        // SACAR EL STRING A BUSCAR DE LA URL
        const searchString = req.params.search;

        // HACER UN FIND PERO CON EL OPERADOR OR
        Topic.find({ "$or": [
            { "title": { "$regex": searchString, "$options": 'i' } },
            { "content": { "$regex": searchString, "$options": 'i' } },
            { "code": { "$regex": searchString, "$options": 'i' } },
            { "lang": { "$regex": searchString, "$options": 'i' } },
        ]})
        .sort([['date', 'descending']])
        .exec((err, topics) => {

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la petición'
                });
            }

            if(topics <= 0){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay temas disponibles'
                });
            }

            // DEVOLVER EL RESULTADO
            return res.status(200).send({
                status: 'success',
                topics: topics
            });
        });
        
    }

};

module.exports = controller;