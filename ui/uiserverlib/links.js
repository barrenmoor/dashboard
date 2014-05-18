var http = require('http');

var dashboardwidgets = [{
		id: 'cuic-widget-id-0',
		title: 'CUIC DEFECT DISTRIBUTION',
		type: 'CHART',
		options: {draggable: false},
		dataUrl: 'http://localhost:8082/metrics/defectdistribution'
	}, {
		id: 'cuic-widget-id-1',
		title: 'DEFECTS COUNT',
		type: 'ABSOLUTE',
		options: {draggable: true},
		dataUrl: 'http://localhost:8082/metrics/defectcount'
	}, {
		id: 'cuic-widget-id-2',
		title: 'DEFECT STATISTICS',
		type: 'MULTISTAT',
		options: {draggable: true},
		dataUrl: 'http://localhost:8082/metrics/defectstatistics'
	}, {
		id: 'cuic-widget-id-3',
		title: 'STATIC VIOLATIONS',
		type: 'DELTA',
		options: {green: "down", draggable: true},
		dataUrl: 'http://localhost:8082/metrics/staticviolations'
	}, {
		id: 'cuic-widget-id-4',
		title: 'CI BUILD',
		type: 'MULTISTAT',
		options: {draggable: true},
		dataUrl: 'http://localhost:8082/metrics/cibuild'
	}, {
		id: 'cuic-widget-id-5',
		title: 'CODE COVERAGE',
		type: 'DELTA',
		options: {unit: "%", green: "up", draggable: true},
		dataUrl: 'http://localhost:8082/metrics/linecoverage'
	}];

exports.widgets = function(req, res) {
	res.send(dashboardwidgets);
};

exports.apicall = function(req, res) {
	var url = req.query.url;
	var output = "";

	http.get(url, function(apiresponse) {
		if(apiresponse.statusCode != 200) {
			console.log("Error: " + url + ": " + apiresponse.statusCode);
			res.status(500).send({
				apiStatus: apiresponse.statusCode,
				error: "Internal Server Error!"
			});
		} else {
			apiresponse.on('data', function(chunk) {
				output += chunk;
			}).on('end', function() {
				var json = JSON.parse(output);
				res.send(json);
			});
		}
	});
};