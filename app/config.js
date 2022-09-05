const cookie = require('./cookie');
const clientId = process.env.CLIENT_ID;
const LOCALHOST_CLIENT_ID = 'cd4c36646ee716425840';

module.exports = {
  api: 'https://api.github.com',
  apiStatus: 'https://status.github.com/api/status.json',
  site: 'https://github.com',
  OAuthTokenEndpoint: '/.netlify/functions/oauth?code=',
  id: clientId || LOCALHOST_CLIENT_ID,
  username: cookie.get('username'),
  auth: 'oauth'
};
