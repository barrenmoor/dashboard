var express = require('express');
var links = require('./apiserverlib/links');

var app = express();

app.use(function(req, res, next){
  console.log('%s %s', req.method, req.url);
  next();
});

app.use(express.urlencoded());
app.use(express.json());

app.get('/metrics/cibuild', links.cibuild);
app.get('/metrics/defectcount', links.defectcount);
app.get('/metrics/linecoverage', links.linecoverage);
app.get('/metrics/branchcoverage', links.branchcoverage);
app.get('/metrics/staticviolations', links.staticviolations);
app.get('/metrics/defectdistribution', links.defectdistribution);
app.get('/metrics/s1s2defectcount', links.s1s2defectcount);
app.get('/metrics/cfdcount', links.cfdcount);
app.get('/metrics/olddefectcount', links.olddefectcount);

app.listen(8082);