var express = require('express');
var bodyParser = require('body-parser');

var links = require('./apiserverlib/links');

var app = express();

app.use(bodyParser());

app.use(function(req, res, next){
  console.log('%s %s', req.method, req.url);
  next();
});

app.get('/metrics/cibuild', links.cibuild);
app.get('/metrics/defectcount', links.defectcount);
app.get('/metrics/linecoverage', links.linecoverage);
app.get('/metrics/branchcoverage', links.branchcoverage);
app.get('/metrics/staticviolations', links.staticviolations);
app.get('/metrics/defectdistribution', links.defectdistribution);
app.get('/metrics/defectstatistics', links.defectstatistics);
app.get('/metrics/teststatistics', links.teststatistics);

app.listen(8082);