const controllers = require('./controllers');

const router = (app) => {
  app.get('/getToken', controllers.Account.getToken);
  app.get('/login', controllers.Account.renderLogin);
  app.post('/login', controllers.Account.login);
  app.get('/logout', controllers.Account.logout);
  app.post('/signup', controllers.Account.signup);
  app.post('/changePass', controllers.Account.changePass);
  app.post('/new', controllers.Character.makeChar);
  // app.get('/char', controllers.Character.getChar);
  // app.post('/char', controllers.Character.editChar);
  app.get('/*', controllers.Account.renderLogin);
};

module.exports = router;
