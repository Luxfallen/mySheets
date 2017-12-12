const controllers = require('./controllers');
const middle = require('./middleware');

const router = (app) => {
  app.get('/getToken', middle.requiresSecure, controllers.Account.getToken);
  app.get('/login', middle.requiresSecure, middle.requiresLogout, controllers.Account.renderLogin);
  app.post('/login', middle.requiresSecure, middle.requiresLogout, controllers.Account.login);
  app.get('/logout', middle.requiresLogin, controllers.Account.logout);
  app.post('/signup', middle.requiresSecure, middle.requiresLogout, controllers.Account.signup);
  app.post('/changePass', middle.requiresSecure, middle.requiresLogin,
    controllers.Account.changePass);
  app.post('/new', middle.requiresSecure, middle.requiresLogin, controllers.Character.makeChar);
  // app.get('/char', middle.requiresSecure, middle.requiresLogin, controllers.Character.getChar);
  // app.post('/char', middle.requiresSecure, middle.requiresLogin, controllers.Character.editChar);
  app.get('/*', controllers.Account.renderLogin);
};

module.exports = router;
