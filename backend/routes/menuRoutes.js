const express = require('express');
const { getMenuItems } = require('../controllers/menuController');
const router = express.Router();

router.get('/menu', getMenuItems)

module.exports = router;