const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  // ...You can now register proxies as you wish!
  app.use(proxy('/api', {
    target: 'http://172.26.16.78',
    secure: false,
    changeOrigin: true,
    pathRewrite: {"^/api": "/"}
  }));
  app.use(proxy('/apj', {
    target: 'http://172.26.16.79:8080',
    secure: false,
    changeOrigin: true,
    pathRewrite: {"^/apj": "/"}
  }));
};