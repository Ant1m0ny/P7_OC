const express = require('express');
const router = express.Router();
const controllers = require('../controllers/user.controllers');

router.post('/login', controllers.login);
router.post('/signup', controllers.signup);