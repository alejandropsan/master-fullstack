'use strict'

const express = require('express');
const CommentController = require('../controllers/comment');

const router = express.Router();
const md_auth = require('../middlewares/authentikated');

router.post('/comment/topic/:topicId', md_auth.authentikated, CommentController.add);
router.put('/comment/:commentId', md_auth.authentikated, CommentController.update);
router.delete('/comment/:topicId/:commentId', md_auth.authentikated, CommentController.delete);

module.exports = router;