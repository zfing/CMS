const proxy = require('http-proxy-middleware')
module.exports = function(app) {
  app.use(proxy('/api', 
    {
        target: "https://dev-cms.com/",
        changeOrigin: true
    }))
    //app.use(proxy(...)) //可以配置多个代理
}