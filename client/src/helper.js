const superagent = require('superagent');
const nocache = require('superagent-no-cache');

const handleError = (message) => {
  const eMess = document.querySelector('#errorMessage');
  eMess.innerHTML = message;
  eMess.parentElement.style.visibility = 'visible';
};

// Redirect now needs to change App.state - how?!
const redirect = (page) => {
  window.page = page;
};

// ADD: Do something with the response! As is,
// you get the body but don't do SHIT with it

const sendAjax = (type, action, data, success) => {
  // I was making promises, but never making TO anything.
  // if it's a promise, remember to return it
  switch (type) {
    case 'POST':
      return superagent
        .post(action)
        .use(nocache)
        .set('Content-Type', 'application/json')
        .send(data)
        .then(success, (err) => {
          console.log(err);
          handleError('An error occurred');
        });
      // break;
    case 'GET':
      return superagent
        .get(action)
        .use(nocache)
        .set('Content-Type', 'application/json')
        .query(data)
        .then(success, (err) => {
          console.log(err);
          handleError('An error occurred');
        });
      // break;
    default:
      return handleError('Something went wrong');
      // break;
  }
};

// .then!~ need to return all the good stuff once we have it and not sooner
const getToken = () => sendAjax('GET', '/getToken', null).then((result) => result.body.csrfToken);

module.exports = {
  handleError,
  redirect,
  sendAjax,
  getToken,
};
