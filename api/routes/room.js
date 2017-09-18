const Router = require('koa-router');
const roomController = require('../controllers/room');

const {
    join,
    status,
    start,
} = roomController;

const router = new Router({ prefix: '/room' });

router.get('/:roomname/status', status);
router.get('/:roomname/user/:username', join);
router.get('/:roomname/start', start);

module.exports = router;
