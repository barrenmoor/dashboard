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
app.get('/dashboard/linecoverage', links.linecoverage);
app.get('/dashboard/branchcoverage', links.branchcoverage);
app.get('/dashboard/staticviolations', links.staticviolations);
app.get('/dashboard/defectdistribution', links.defectdistribution);
app.get('/dashboard/s1s2defectcount', links.s1s2defectcount);
app.get('/dashboard/cfdcount', links.cfdcount);

app.listen(8080);