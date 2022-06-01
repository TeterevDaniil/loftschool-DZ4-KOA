const db = require('../models/db')
const psw = require('../libs/password')
var Jimp = require('jimp');
const { products, skills } = require('../data.json')
const nodemailer = require('nodemailer')
const config = require('../configMail.json')
const Path = require('path');

module.exports.index = async (ctx, next) => {
  ctx.render('pages/index', {
    products,
    skills
    , title: 'Home page', msgemail: ctx.flash('mail')[0]
  })
}

module.exports.uploadWork = async (ctx, next) => {
  const nameProduct = ctx.request.body.name;
  const priceProduct = ctx.request.body.price;
  const { name, path } = ctx.request.files.photo
  const uploadDir = Path.join('.','upload', name);
  const fileName = Path.join('.','public','upload', name); 
  await Jimp.read(path)
  .then(image => {
    console.log("here");
    return image
    .resize(378, 526) 
    .quality(75) 
    .write(fileName); 
  })
  .catch(err => {
    console.error(err);
});
  db
    .get('products')
    .push({
      src: uploadDir,
      name: nameProduct,
      price: Number(priceProduct),
    })
    .write()
  ctx.flash('msgskillfile', 'Картинка успешно загружена');
  return ctx.redirect('/admin')
}

module.exports.login = async (ctx, next) => {
  if (ctx.session.isAuthorized) {
    ctx.redirect('/admin')
    return;
  }
  ctx.render('pages/login', { title: 'SigIn page', msglogin: ctx.flash('msglogin')[0] })
}

module.exports.admin = async (ctx, next) => {
  if (ctx.session.isAuthorized) {
    ctx.render('pages/admin', { title: 'Admin page', msgskill: ctx.flash('msgskill')[0], msgfile: ctx.flash('msgskillfile')[0] });
    return;
  }
  ctx.redirect('/login')
}

module.exports.adminSkills = async (ctx, next) => {
  const { age, concerts, cities, years } = ctx.request.body;
  if (!age || !concerts || !cities || !years) {
    ctx.flash('msgskill', 'Заполните все поля');
    return ctx.redirect('/admin')
  }
  db.set('skills[0]', { number: age, text: 'Возраст начала занятий на скрипке' }).write();
  db.set('skills[1]', { number: concerts, text: 'Концертов отыграл' }).write();
  db.set('skills[2]', { number: cities, text: 'Максимальное число городов в туре' }).write();
  db.set('skills[3]', { number: years, text: 'Лет на сцене в качестве скрипача' }).write();
  ctx.flash('msgskill', 'Данные обновленны');
  return ctx.redirect('/admin')

}

module.exports.mail = async (ctx, next) => {
  const { name, email, message } = ctx.request.body;
  if (!name || !email || !message) {
    ctx.flash('mail', 'Заполните все поля');
    return ctx.redirect('/#mail')
  }
  const transporter = nodemailer.createTransport(config.mail.smtp)
  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: config.mail.smtp.auth.user,
    subject: config.mail.subject,
    text: message.trim().slice(0, 500) +
      `\n Отправлено с: <${email}>`
  }
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      ctx.flash('mail', 'При отправке письма произошла ошибка!');
      return ctx.redirect('/#mail')
    }
  })
  ctx.flash('mail', 'Письмо успешно отправлено!');
     return ctx.redirect('/#mail')
}

module.exports.auth = async (ctx, next) => {
  const { email, password } = ctx.request.body
  const user = db
    .getState()
    .user
  if (user.login === email && psw.validPassword(password)) {
    ctx.session.isAuthorized = true
    ctx.redirect('/admin');
    ctx.body = {
      mes: 'Done',
      status: 'OK'
    }
    return;
  } else {
    ctx.session.isAuthorized = false;
    ctx.flash('msglogin', 'Неверный логин или пароль');
    return ctx.redirect('/login')
  }
}
