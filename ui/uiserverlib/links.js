var http = require('http');

var dashboardwidgets = [{
		id: 'cuic-widget-id-0',
		title: 'UCCX DEFECT DISTRIBUTION',
		type: 'CHART',
		options: {draggable: false},
		dataUrl: 'http://localhost:8082/metrics/defectdistribution?product=uccx'
	}, {
		id: 'cuic-widget-id-1',
		title: 'DEFECTS COUNT',
		type: 'ABSOLUTE',
		options: {draggable: true},
		dataUrl: 'http://localhost:8082/metrics/defectcount?product=uccx'
	}, {
		id: 'cuic-widget-id-2',
		title: 'DEFECT STATISTICS',
		type: 'MULTISTAT',
		options: {draggable: true},
		dataUrl: 'http://localhost:8082/metrics/defectstatistics?product=uccx'
	}, {
		id: 'cuic-widget-id-3',
		title: 'STATIC VIOLATIONS',
		type: 'DELTA',
		options: {green: "down", draggable: true},
		dataUrl: 'http://localhost:8082/metrics/staticviolations?product=uccx'
	}, {
		id: 'cuic-widget-id-4',
		title: 'CI BUILD',
		type: 'MULTISTAT',
		options: {draggable: true},
		dataUrl: 'http://localhost:8082/metrics/cibuild?product=uccx'
	}, {
		id: 'cuic-widget-id-5',
		title: 'CODE COVERAGE',
		type: 'DELTA',
		options: {unit: "%", green: "up", draggable: true},
		dataUrl: 'http://localhost:8082/metrics/linecoverage?product=uccx'
	}, {
		id: 'cuic-widget-id-6',
		title: 'LOAD & AUTOMATION',
		type: 'MULTISTAT',
		options: {draggable: true},
		dataUrl: 'http://localhost:8082/metrics/teststatistics?product=uccx'
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
	}).on('error', function(e) {
		console.log("Error: " + url);
		console.log(e);
		res.status(500).send({
			apiStatus: -1,
			error: "Internal Server Error!"
		});		
	});
};