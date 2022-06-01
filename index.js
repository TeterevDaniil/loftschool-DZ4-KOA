const Koa = require('koa');
const app = new Koa();
const fs = require('fs');
const static = require('koa-static');
const session = require('koa-session');
const Pug = require('koa-pug');
const flash = require('koa-connect-flash');

require('dotenv').config()
const pug = new Pug({
  viewPath: './views',
  pretty: false,
  basedir: './views',
  noCache: true,
  app: app,
});
const errorHandler = require('./libs/error');
const config = require('./config');
const router = require('./routes');
const port = process.env.PORT || 5000;
app.use(flash());
app.use(static('./public'));

app.use(errorHandler);

app.on('error', (err, ctx) => {
  ctx.request
  ctx.response.body = {}
  ctx.render('error', {
    status: ctx.response.status,
    error: ctx.response.message,
  });
});

app
  .use(session(config.session, app))
  .use(router.routes())
  .use(router.allowedMethods());


app.listen(port, () => {
  if (!fs.existsSync(config.upload)) {
    fs.mkdirSync(config.upload);
  }
  console.log(`> Ready On Server http://localhost:${port}`);
});

