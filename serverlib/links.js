var http = require('http');
var xpath = require('xpath');
var dom = require('xmldom').DOMParser;

exports.widgets = function(req, res) {
	res.send([{
		title: 'DEFECT DISTRIBUTION',
		type: 'CHART',
		dataUrl: ''
	}, {
		title: 'LINE COVERAGE',
		type: 'DELTA',
		dataUrl: ''
	}, {
		title: 'BRANCH COVERAGE',
		type: 'DELTA',
		dataUrl: ''
	}, {
		title: 'STATIC VIOLATIONS',
		type: 'DELTA',
		dataUrl: ''
	}, {
		title: 'DEFECTS COUNT',
		type: 'ABSOLUTE',
		dataUrl: ''
	}, {
		title: 'CI BUILD',
		type: 'ABSOLUTE',
		dataUrl: 'cibuild'
	}]);
};

exports.cibuild = function(req, res) {
	var request = http.request({
		host: 'bgl-ccbu-kabini',
		path: '/jenkins/view/CUIC_MAVEN/job/cuic_1051_ci/lastSuccessfulBuild/testReport/api/json',
		method: 'GET'
	}, function(response) {
		var output = '';

		response.on('data', function(chunk) {
            output += chunk;
        });

        response.on('end', function() {
        	var json = JSON.parse(output);

        	var durations = [];
        	var longestRunning = 0;
        	for(var i in json.childReports) {
        		var suites = json.childReports[i].result.suites;
        		for(var j in suites) {
        			var cases = suites[j].cases;
        			for(var k in cases) {
        				durations.push(parseFloat(cases[k].duration));
        				if(longestRunning < cases[k].duration) {
        					longestRunning = cases[k].duration;
        				}
        			}
        		}
        	}

        	durations.sort(function(a, b) {
        		return (b - a);
        	});

        	var toptests = 0.0;
        	for(var i = 0; i < 10; i++) {
        		toptests += durations[i];
        	}

        	var format = function(val) {
    			var hrs = parseInt(val / 3600);
    			hrs = hrs < 10 ? "0" + hrs : hrs;

    			var mins = parseInt((val - (hrs * 3600)) / 60);
    			mins = mins < 10 ? "0" + mins : mins;

    			var secs = val - (hrs * 3600) - (mins * 60);
    			secs = secs < 10 ? "0" + secs : secs;

    			return (hrs == "00" ? "" : hrs + ":") + mins + ":" + secs;
        	};

        	res.send({
        		values : [{
        			label: "Total Tests",
        			value: json.totalCount
        		}, {
        			label: "Failed Tests",
        			value: json.failCount
        		}, {
        			label: "Skipped Tests",
        			value: json.skipCount
        		}, {
        			label: "Longest Running Test",
        			value: format(Number(longestRunning).toFixed(0))
        		}, {
        			label: "Top 10 Tests",
        			value: format(Number(toptests).toFixed(0))
        		}],
        		threshold: 0,
        		attribute: 1        		
        	});
        });
	});

	request.end();
}