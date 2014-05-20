var express = require('express');
var bodyParser = require('body-parser');

var links = require('./uiserverlib/links');

var app = express();

app.use(bodyParser());

app.use(function(req, res, next){
  console.log('%s %s', req.method, req.url);
  next();
});

app.use('/dashboard', express.static(__dirname));
app.get('/dashboard/:dashboardId/widgets', links.widgets);
app.get('/dashboard/apicall', links.apicall);
app.get('/dashboard/dashboards', links.dashboards);

app.listen(8080);