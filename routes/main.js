const Router = require('koa-router');
const router = new Router();

const controllers = require("../views/pages");
const { products, skills } = require('../data.json')




router.get("/", async ctx => {
  await
    ctx.render(controllers.index,{
      title: 'Main page',products,skills
    })
})

// router.get("/", async (ctx, next) => {
//   ctx.render('pages/index', {title: 'Main page', products, skills });
// });
// router.get('/', (req, res, next) => {
//   res.render('pages/index', { title: 'Main page', products, skills })
// })

// router.post('/', (req, res, next) => {
//   // TODO: Реализовать функционал отправки письма.
//   res.send('Реализовать функционал отправки письма')
// })

module.exports = router
