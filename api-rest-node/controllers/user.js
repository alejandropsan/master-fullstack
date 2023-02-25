'use strict'

const validator = require('validator');
const bcrypt = require('bcrypt-nodejs');
const fs = require('fs');
const path = require('path');
const User = require('../models/user');
const jwt = require('../services/jwt');


const controller = {
    probando: function(req, res){
        return res.status(200).send({
            message: 'Soy el método PROBANDO'
        });
    },

    testeando: function(req, res){
        return res.status(200).send({
            message: 'Soy el método TESTEANDO'
        });
    },

    save: function(req, res){
        //? RECOGER LOS PARÁMETROS DE LA PETICIÓN
        const params = req.body;

        //? VALIDAR LOS DATOS
        try{
            var validate_name = !validator.isEmpty(params.name);
            var validate_surname = !validator.isEmpty(params.surname);;
            var validate_email = validator.isEmail(params.email) && !validator.isEmpty(params.email);
            var validate_password = !validator.isEmpty(params.password);
        }catch(err){
            return res.status(400).send({
                message: "Faltan datos por enviar"
            });
            
        }

        // console.log(validate_name, validate_surname, validate_email, validate_password);
        if(validate_name && validate_surname && validate_email && validate_password){
        //? CREAR EL OBJETO DE USUARIO
        const user = new User();

        //? ASIGNAR VALORES AL OBJETO
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email.toLowerCase();
        user.role = 'ROLE_USER';
        user.image = null;

        //? COMPROBAR SI EL USUARIO YA EXISTE
            User.findOne({email: user.email}, (err, issetUser) => {
                if(err){
                    return res.status(500).send({
                        message: "Error al comprobar duplicidad de usuario"
                    });
                }

                if(!issetUser){
                    //? SI NO EXISTE, CIFRAR LA CONTRASEÑA
                    bcrypt.hash(params.password, null, null, (err, hash) => {
                        user.password = hash;

                    //? GUARDAR EL USUARIO
                    user.save((err, userStored) => {
                        if(err){
                            return res.status(500).send({
                                message: "Error al guardar el usuario"
                            });
                        }

                        if(!userStored){
                            return res.status(400).send({
                                message: "El usuario no se ha podido guardar"
                            })
                        }
                        //? DEVOLVER RESPUESTA
                        return res.status(200).send({
                            status: 'success',
                            user: userStored
                        });
                    }); // close save
                    }); //close bcrypt
                    
                }else{
                    return res.status(400).send({
                        message: 'El usuario ya está registrado'
                    });
                }
            });
        
        }else{
            return res.status(400).send({
                message: 'Validación de los datos de usuario incorrecta'
            });
        }
        
    },




    login: function(req, res){
        // RECOGER LOS PARÁMETROS DE LA PETICIÓN
        const params = req.body;

        // VALIDAR LOS DATOS
        try{
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var validate_password = !validator.isEmpty(params.password);
        }catch(err){
            return res.status(400).send({
                message: "Faltan datos por enviar"
            });
        }
        

        if(!validate_email || !validate_password){
            return res.status(400).send({
                message: "Los datos no coinciden o son incorrectos, vuelve a enviar los datos correctamente"
            });
        }

        // BUSCAR USUARIOS QUE COINCIDAN CON EL EMAIL
        User.findOne({email: params.email.toLowerCase()}, (err, user) => {

            if(err){
                return res.status(500).send({
                    message: 'Error en el intento de login'
                });
            }
        
            if(!user){
                return res.status(404).send({
                    message: 'El usuario no existe'
                })
            }
        // SI LO ENCUENTRA,
        // COMPROBAR LA CONTRASEÑA (COINCIDENCIA DE EMAIL Y PASSWORD / BCRYPT)
            bcrypt.compare(params.password, user.password, (err, check) => {
                // SI ES CORRECTO,
                if(check){
                    // GENERAR TOKEN DE JWT Y DEVOLVERLO
                    if(params.getToken){

                        // DEVOLVER LOS DATOS
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        });
                    }else{
                            // LIMPIAR EL OBJETO
                        user.password = undefined;

                        // DEVOLVER LOS DATOS
                        return res.status(200).send({
                            status: "success",
                            user
                        });
                    }
                }else{
                    return res.status(404).send({
                        status: "error",
                        message: 'Las credenciales no son correctas'
                    });
                }
                
            });
        });
    },





    update: function(req, res){
        // *****CREAR MIDDLEWARE PARA COMPROBAR EL JWT TOKEN QUE PONEMOS A LA RUTA*****
        // ?RECOGER DATOS DEL USUARIO
        var params = req.body;

        // ?VALIDAR DATOS
        try{
            var validate_name = !validator.isEmpty(params.name);
            var validate_surname = !validator.isEmpty(params.surname);
            var validate_email = validator.isEmail(params.email) && !validator.isEmpty(params.email);
        }catch(err){
            res.status(400).send({
                message: "Faltan datos por enviar",
            });
        }
        
        // ? ELIMINAR PROPIEDADES INNECESARIAS
        delete params.password;

        const userId = req.user.sub;

        // ? COMPROBAR SI EL EMAIL ES ÚNICO
        if(req.user.email != params.email){

            User.findOne({email: params.email.toLowerCase()}, (err, user) => {

                if(err){
                    return res.status(500).send({
                        message: 'Error al intentar actualizar'
                    });
                }
            
                if(user && user.email == params.email){
                    return res.status(400).send({
                        message: 'El email ya existe y no puede ser modificado'
                    });
                }
            });    
        }else{

            // ? BUSCAR Y ACTUALIZAR DOCUMENTO
            // ? User.findOneAndUpdate(condicion, datos a actualizar, opciones, callback)
            User.findOneAndUpdate({_id: userId}, params, {new:true},(err, userUpdated) => {
                    
                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar usuario'
                    });
                }

                if(!userUpdated){
                    return res.status(400).send({
                        status: 'error',
                        message: 'No se ha podido actualizar el usuario'
                    });
                }
                
                // ? DEVOLVER UNA RESPUESTA
                return res.status(200).send({
                    status: 'success',
                    user: userUpdated
                });
            });
        }   
    },

    uploadAvatar: function(req, res){
        // CONFIGURAR EL MÓDULO MULTIPARTY (MD)  Realizado en routes/user.js

        // RECOGER EL FICHERO DE LA PETICIÓN
        
        if(!req.files){
            return res.status(404).send({
                status: 'error',
                message: 'Avatar no subido'
            });
        }

        // CONSEGUIR EL NOMBRE Y LA EXTENSIÓN DEL ARCHIVO SUBIDO
        const file_path = req.files.file0.path;
        const file_split = file_path.split('\\');
        //! ***ADVERTENCIA*** En Linux o Mac
        // const file_split = file_path.split('/');

        // NOMBRE DEL ARCHIVO
        const file_name = file_split[file_split.length - 1];
        // EXTENSIÓN DEL ARCHIVO
        const ext_split = file_name.split('.');
        const file_ext = ext_split[ext_split.length - 1];

        // COMPROBAR LA EXTENSIÓN (SOLO IMÁGENES), SI NO ES VÁLIDA, BORRAR EL FICHERO SUBIDO
        if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
            fs.unlink(file_path, (err) => {

               return res.status(404).send({
                    status: 'error',
                    message: 'La extensión del archivo no es válida'
               });

            });
        }else {
            // SACAR EL ID DEL USUARIO IDENTIFICADO
            const userId = req.user.sub;

            // BUSCAR Y ACTUALIZAR DOCUMENTO
            User.findOneAndUpdate({_id: userId}, {image: file_name}, {new: true}, (err, userUpdated) => {
                
                if(err || !userUpdated){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al guardar la imagen de usuario',
                        file_ext
                    });
                }
                
                // DEVOLVER UNA RESPUESTA
                return res.status(200).send({
                    status: 'success',
                    userUpdated
                });

            });
        }   
    },

    avatar: function(req, res){
        const fileName = req.params.fileName;
        const pathFile = './uploads/users/' + fileName;

        if(fs.existsSync(pathFile)){
            return res.sendFile(path.resolve(pathFile));
        } else {
            return res.status(404).send({
                message: 'La imagen no existe'
            });
        }
    },



    getUsers: function(req, res){
        User.find().exec((err, users) => {
            if(err || !users){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay usuarios para mostrar'
                });
            }

            return res.status(200).send({
                status: 'success',
                users
            });
        });
    },



    getUser: function(req, res){
        const userId = req.params.userId;

        User.findById(userId).exec((err, user) => {
            if(err || !user){
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el usuario'
                });
            }

            return res.status(200).send({
                status: 'success',
                user
            });
        });
    }

};

module.exports = controller;