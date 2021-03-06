const Router = require('koa-router')
const router = new Router()
const koaBody = require('koa-body')
const controllers = require('../controllers')
router.get('/', controllers.index)
router.post('/admin/upload', koaBody(
  {
    multipart: true
  }
), controllers.uploadWork)

router.post('/', koaBody(), controllers.mail)
router.get('/login', controllers.login)
router.post('/login', koaBody(), controllers.auth)
router.get('/admin', controllers.admin)
router.post('/admin/skills', koaBody(), controllers.adminSkills)


module.exports = router