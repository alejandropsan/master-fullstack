'use strict'

const express = require('express');
const TopicController = require('../controllers/topic');

const router = express.Router();
const md_auth = require('../middlewares/authentikated');

router.get('/test', TopicController.test);
router.post('/topic', md_auth.authentikated, TopicController.save);
router.get('/topics/:page?', TopicController.getTopics );
router.get('/user-topics/:user', TopicController.getTopicsByUser);
router.get('/topic/:id', TopicController.getTopic);
router.put('/topic/:id', md_auth.authentikated, TopicController.update);
router.delete('/topic/:id', md_auth.authentikated, TopicController.delete);
router.get('/search/:search', TopicController.search);

module.exports = router;