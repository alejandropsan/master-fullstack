'use strict'

const validator = require('validator');

const Topic = require('../models/topic');

const controller = {

    add: function(req, res){

        // RECOGER EL ID DEL TOPIC DE A URL
        const topicId = req.params.topicId;

        // FIND POR ID DEL TOPIC
        Topic.findById(topicId).exec((err, topic) => {

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la petición'
                });
            }

            if(topic <= 0){
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el tema'
                });
            }

            // COMPROBAR OBJETO USUARIO Y VALIDAR DATOS
            if(req.body.content){

                try{
                    var validate_content = !validator.isEmpty(req.body.content);
        
                }catch(err){
                    return res.status(404).send({
                        status: 'error',
                        message: 'Tu comentario está vacío'
                    });
                }

                if(validate_content){

                    const comment = {
                        user: req.user.sub,
                        content: req.body.content
                    }

                    // EN LA PROPIEDAD COMMENTS DEL OBJETO RESULTANTE HACER UN PUSH
                    topic.comments.push(comment);

                    // GUARDAR EL TOPIC COMPLETO
                    topic.save((err) => {

                        if(err){
                            return res.status(500).send({
                                status: 'error',
                                message: 'Error al guardar el comentario'
                            });
                        }

                        Topic.findById(topic._id)
                        .populate('user')
                        .populate('comments.user')
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

                    });


                    
                }else{
                    return res.status(400).send({
                        status: 'error',
                        message: 'No se han validado los datos del comentario'
                    });
                }
            }
        });
    },




    update: function(req, res){

        // ? CONSEGUIR ID DEL COMENTARIO QUE LLEGA POR LA URL
        const commentId = req.params.commentId;

        // ? RECOGER DATOS Y VALIDAR
        const params = req.body;

        try{
            var validate_content = !validator.isEmpty(params.content);

        }catch(err){
            return res.status(404).send({
                status: 'error',
                message: 'Tu comentario está vacío'
            });
        }

        // ? FIND AND UPDATE DE UN SUBDOCUMENTO
        Topic.findOneAndUpdate(
            { "comments._id": commentId },
            {
                "$set": {
                    "comments.$.content": params.content
                }
            },
            { new: true },
            (err, topicUpdated) => {

                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar el comentario'
                    });
                }

                if(!topicUpdated){
                    return res.status(404).send({
                        status: 'error',
                        message: 'No se ha podido actualizar tu comentario'
                    })
                }

                // ? DEVOLVER LOS DATOS
                return res.status(200).send({
                    status: 'success',
                    topic: topicUpdated
                });
        });
    },




    delete: function(req, res){
        // SACAR EL ID DEL TOPIC Y DEL COMENTARIO A BORRAR
        const topicId = req.params.topicId;
        const commentId = req.params.commentId;

        // BUSCAR EL TOPIC
        Topic.findById(topicId, (err, topic) => {

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la petición'
                });
            }

            if(!topic){
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el tema'
                });
            }

            // SELECCIONAR EL SUBDOCUMENTO (COMENTARIO)
            const comment = topic.comments.id(commentId);

            // BORRAR EL COMENTARIO
            if(comment){
                comment.remove();

                // GUARDAR EL TOPIC
                topic.save((err) => {

                    if(err){
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error en la petición'
                        });
                    }

                    Topic.findById(topic._id)
                        .populate('user')
                        .populate('comments.user')
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
                });

            }else {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el comentario'
                });
            }
        }); 
    }  
};

module.exports = controller;