const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.post('/', usersController.addUser);

router.put('/:id/score', usersController.updateScore);

router.get('/leaderboard', usersController.getTopUsers);

router.get('/leaderboard/lowest', usersController.getLowestUsers);

router.get('/:id/rank', usersController.getUserRank);

module.exports = router;
