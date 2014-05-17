var http = require('http');

var dashboardwidgets = [{
		id: 'cuic-widget-id-0',
		title: 'CUIC DEFECT DISTRIBUTION',
		type: 'CHART',
		options: {draggable: false},
		dataUrl: 'http://localhost:8082/metrics/defectdistribution'
	}, {
		id: 'cuic-widget-id-1',
		title: 'LINE COVERAGE',
		type: 'DELTA',
		options: {unit: "%", green: "up", draggable: true},
		dataUrl: 'http://localhost:8082/metrics/linecoverage'
	}, {
		id: 'cuic-widget-id-2',
		title: 'BRANCH COVERAGE',
		type: 'DELTA',
		options: {unit: "%", green: "up", draggable: true},
		dataUrl: 'http://localhost:8082/metrics/branchcoverage'
	}, {
		id: 'cuic-widget-id-3',
		title: 'STATIC VIOLATIONS',
		type: 'DELTA',
		options: {green: "down", draggable: true},
		dataUrl: 'http://localhost:8082/metrics/staticviolations'
	}, {
		id: 'cuic-widget-id-4',
		title: 'DEFECTS COUNT',
		type: 'ABSOLUTE',
		options: {draggable: true},
		dataUrl: 'http://localhost:8082/metrics/defectcount'
	}, {
		id: 'cuic-widget-id-5',
		title: 'CI BUILD',
		type: 'MULTISTAT',
		options: {draggable: true},
		dataUrl: 'http://localhost:8082/metrics/cibuild'
	}];

exports.widgets = function(req, res) {
	res.send(dashboardwidgets);
};

exports.apicall = function(req, res) {
	var url = req.query.url;
	var output = "";

	http.get(url, function(apiresponse) {
		console.log(apiresponse.statusCode);

		apiresponse.on('data', function(chunk) {
			output += chunk;
		}).on('end', function() {
			var json = JSON.parse(output);
			res.send(json);
		});
	}).on('error', function(e) {
		console.log("Error: " + url + ": " + e.message);
		res.status(500).send({
			error: "Internal Server Error!"
		});
	});
};