const Router = require('koa-router');
const router = new Router();

router.use('/', require('./main'))

 router.use('/login', require('./login'))

 router.use('/admin', require('./admin'))

module.exports = router
