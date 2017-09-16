const Router = require('koa-router');
const roomController = require('../controllers/room');

const {
    join,
    status,
} = roomController;

const router = new Router({ prefix: '/room' });

router.get('/:roomname/status', status);
router.get('/:roomname/user/:username', join);

module.exports = router;
