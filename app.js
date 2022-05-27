const path = require("path");
const Koa = require("koa");
const app = new Koa();
const static1 = require("koa-static");
const Pug = require("koa-pug");
const views = require("koa-views");
const pug = new Pug({
  viewPath: path.resolve(__dirname, "./views"),
  pretty: true,
  noCache: true,
  app: app
});

 const router = require("./routes");

app.use(static1(path.resolve(__dirname, "./public")));
app.use(views(path.resolve(__dirname,"./views"),{
  extension:"pug"
}))

app
  // .use(session(config.session, app))
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000, function() {
  console.log("Server start 3000");
});