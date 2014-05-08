var express = require('express');
var links = require('./serverlib/links');

var app = express();

app.use(function(req, res, next){
  console.log('%s %s', req.method, req.url);
  next();
});

app.use(express.urlencoded());
app.use(express.json());

app.use('/dashboard', express.static(__dirname));
app.get('/dashboard/widgets', links.widgets);
app.get('/dashboard/cibuild', links.cibuild);
app.get('/dashboard/defectcount', links.defectcount);

app.listen(8080);