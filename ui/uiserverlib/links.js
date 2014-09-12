var http = require('http');

exports.getLogger = function() {
	var log4js = require('log4js');
	log4js.configure("log4js-ui-conf.json", {});

	var logger = log4js.getLogger("uiserver");
	logger.setLevel('DEBUG');

	return logger;
};

var logger = exports.getLogger();

var dashboards = [{
	id: "dashboard-0",
	title: "UCCX Risk to Ship"
},{
	id: "dashboard-1",
	title: "CUIC Risk to Ship"
},{
	id: "dashboard-2",
	title: "CVP Risk to Ship"
},{
	id: "dashboard-3",
	title: "Voice Browser Risk to Ship"
}];

var dashboardwidgets = {
		"dashboard-0": [{
			id: 'uccx-widget-id-0',
			title: 'UCCX DEFECT DISTRIBUTION',
			type: 'CHART',
			options: {draggable: false},
			dataUrl: 'http://localhost:8082/metrics/defectdistribution?product=uccx'
		}, {
			id: 'uccx-widget-id-1',
			title: 'DEFECTS COUNT',
			type: 'ABSOLUTE',
			options: {draggable: true},
			dataUrl: 'http://localhost:8082/metrics/defectcount?product=uccx'
		}, {
			id: 'uccx-widget-id-2',
			title: 'DEFECT STATISTICS',
			type: 'MULTISTAT',
			options: {draggable: true},
			dataUrl: 'http://localhost:8082/metrics/defectstatistics?product=uccx'
		}, {
			id: 'uccx-widget-id-3',
			title: 'STATIC VIOLATIONS',
			type: 'DELTA',
			options: {green: "down", draggable: true},
			dataUrl: 'http://localhost:8082/metrics/staticviolations?product=uccx'
		}, {
			id: 'uccx-widget-id-4',
			title: 'CI BUILD',
			type: 'MULTISTAT',
			options: {draggable: true},
			dataUrl: 'http://localhost:8082/metrics/cibuild?product=uccx'
		}, {
			id: 'uccx-widget-id-5',
			title: 'CODE COVERAGE',
			type: 'DELTA',
			options: {unit: "%", green: "up", draggable: true},
			dataUrl: 'http://localhost:8082/metrics/linecoverage?product=uccx'
		}, {
			id: 'uccx-widget-id-6',
			title: 'LOAD & AUTOMATION',
			type: 'MULTISTAT',
			options: {draggable: true},
			dataUrl: 'http://localhost:8082/metrics/teststatistics?product=uccx'
		}],
		"dashboard-1": [{
			id: 'cuic-widget-id-0',
			title: 'CUIC DEFECT DISTRIBUTION',
			type: 'CHART',
			options: {draggable: false},
			dataUrl: 'http://localhost:8082/metrics/defectdistribution?product=cuic'
		}, {
			id: 'cuic-widget-id-1',
			title: 'DEFECTS COUNT',
			type: 'ABSOLUTE',
			options: {draggable: true},
			dataUrl: 'http://localhost:8082/metrics/defectcount?product=cuic'
		}, {
			id: 'cuic-widget-id-2',
			title: 'DEFECT STATISTICS',
			type: 'MULTISTAT',
			options: {draggable: true},
			dataUrl: 'http://localhost:8082/metrics/defectstatistics?product=cuic'
		}, {
			id: 'cuic-widget-id-3',
			title: 'STATIC VIOLATIONS',
			type: 'DELTA',
			options: {green: "down", draggable: true},
			dataUrl: 'http://localhost:8082/metrics/staticviolations?product=cuic'
		}, {
			id: 'cuic-widget-id-4',
			title: 'CI BUILD',
			type: 'MULTISTAT',
			options: {draggable: true},
			dataUrl: 'http://localhost:8082/metrics/cibuild?product=cuic'
		}, {
			id: 'cuic-widget-id-5',
			title: 'CODE COVERAGE',
			type: 'DELTA',
			options: {unit: "%", green: "up", draggable: true},
			dataUrl: 'http://localhost:8082/metrics/linecoverage?product=cuic'
		}],
		"dashboard-2": [{
			id: 'cvp-widget-id-0',
			title: 'CVP DEFECT DISTRIBUTION',
			type: 'CHART',
			options: {draggable: false},
			dataUrl: 'http://localhost:8082/metrics/defectdistribution?product=cvp'
		}, {
			id: 'cvp-widget-id-1',
			title: 'DEFECTS COUNT',
			type: 'ABSOLUTE',
			options: {draggable: true},
			dataUrl: 'http://localhost:8082/metrics/defectcount?product=cvp'
		}, {
			id: 'cvp-widget-id-2',
			title: 'DEFECT STATISTICS',
			type: 'MULTISTAT',
			options: {draggable: true},
			dataUrl: 'http://localhost:8082/metrics/defectstatistics?product=cvp'
		}, {
			id: 'cvp-widget-id-3',
			title: 'STATIC VIOLATIONS',
			type: 'DELTA',
			options: {green: "down", draggable: true},
			dataUrl: 'http://localhost:8082/metrics/staticviolations?product=cvp'
		}, {
			id: 'cvp-widget-id-4',
			title: 'CI BUILD',
			type: 'MULTISTAT',
			options: {draggable: true},
			dataUrl: 'http://localhost:8082/metrics/cibuild?product=cvp'
		}, {
			id: 'cvp-widget-id-5',
			title: 'CODE COVERAGE',
			type: 'DELTA',
			options: {unit: "%", green: "up", draggable: true},
			dataUrl: 'http://localhost:8082/metrics/linecoverage?product=cvp'
		}],
		"dashboard-3": [{
			id: 'vb-widget-id-0',
			title: 'VB DEFECT DISTRIBUTION',
			type: 'CHART',
			options: {draggable: false},
			dataUrl: 'http://localhost:8082/metrics/defectdistribution?product=vb'
		}, {
			id: 'vb-widget-id-1',
			title: 'DEFECTS COUNT',
			type: 'ABSOLUTE',
			options: {draggable: true},
			dataUrl: 'http://localhost:8082/metrics/defectcount?product=vb'
		}, {
			id: 'vb-widget-id-2',
			title: 'DEFECT STATISTICS',
			type: 'MULTISTAT',
			options: {draggable: true},
			dataUrl: 'http://localhost:8082/metrics/defectstatistics?product=vb'
		}, {
			id: 'vb-widget-id-3',
			title: 'STATIC VIOLATIONS',
			type: 'DELTA',
			options: {green: "down", draggable: true},
			dataUrl: 'http://localhost:8082/metrics/staticviolations?product=vb'
		}, {
			id: 'vb-widget-id-4',
			title: 'CI BUILD',
			type: 'MULTISTAT',
			options: {draggable: true},
			dataUrl: 'http://localhost:8082/metrics/cibuild?product=vb'
		}, {
			id: 'vb-widget-id-5',
			title: 'CODE COVERAGE',
			type: 'DELTA',
			options: {unit: "%", green: "up", draggable: true},
			dataUrl: 'http://localhost:8082/metrics/linecoverage?product=vb'
		}]
	};

exports.dashboards = function(req, res) {
	res.send(dashboards);
};

exports.widgets = function(req, res) {
	var responseData = dashboardwidgets[req.params.dashboardId];
	res.send(responseData ? responseData : []);
};

exports.apicall = function(req, res) {
	var url = req.query.url;
	var output = "";

	http.get(url, function(apiresponse) {
		if(apiresponse.statusCode != 200) {
			logger.debug("Error: " + url + ": " + apiresponse.statusCode);
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
		logger.debug("Error: " + url);
		res.status(500).send({
			apiStatus: -1,
			error: "Internal Server Error!"
		});		
	});
};