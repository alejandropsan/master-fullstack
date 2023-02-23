'use strict'

const express = require('express');
const UserController = require('../controllers/user');

const router = express.Router();
const md_auth = require('../middlewares/authentikated');

const multipart = require('connect-multiparty');
const md_upload = multipart({ uploadDir: './uploads/users' });

// RUTAS DE PRUEBA
router.get('/probando', UserController.probando);
router.post('/testeando', UserController.testeando);

// RUTAS DE USUARIOS
router.post('/register', UserController.save);
router.post('/login', UserController.login);
router.put('/update', md_auth.authentikated, UserController.update);
router.post('/upload-avatar', [md_auth.authentikated, md_upload], UserController.uploadAvatar);
router.get('/avatar/:fileName', UserController.avatar);
router.get('/users', UserController.getUsers);
router.get('/user/:userId', UserController.getUser);

module.exports = router;