var express = require('express');

var app = express();

app.use(function(req, res, next){
  console.log('%s %s', req.method, req.url);
  next();
});

app.use(express.urlencoded());
app.use(express.json());

app.use('/dashboard', express.static(__dirname));

app.listen(8080);