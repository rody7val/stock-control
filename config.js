module.exports = {
  database: process.env.MONGO_DB || 'mongodb://localhost:27017/insumos',
  port: process.env.PORT || 3000,
  secretKey: process.env.SECRETKEY || '123456789',
  cookie: process.env.COOKIE || 'myCookie',
  session: process.env.SESSION || 'mySession',
  raiz: __dirname
};
