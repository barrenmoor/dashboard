var http = require('http');

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
		dataUrl: 'defectcount'
	}, {
		title: 'CI BUILD',
		type: 'MULTISTAT',
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
        			label: "Passed Tests",
        			value: json.totalCount - json.failCount,
        			style: 'success'
        		}, {
        			label: "Failed Tests",
        			value: json.failCount,
        			style: 'error'
        		}, {
        			label: "Skipped Tests",
        			value: json.skipCount,
        			style: 'warning'
        		}, {
        			label: "Longest Running Test",
        			value: format(Number(longestRunning).toFixed(0))
        		}, {
        			label: "Top 10 Tests",
        			value: format(Number(toptests).toFixed(0))
        		}]
        	});
        });
	});

	request.end();
};

exports.defectcount = function(req, res) {
	var Browser = require('zombie');
	var browser = new Browser({ debug: true, runScripts: true });

	browser.visit("http://enotify9-1.cisco.com/enotify-v8/sites/ccbu/output/website/index.html")
		.then(function() {
			var outstanding = parseInt(browser.text("a[href='/enotify-v8/sites/ccbu/output/website/bug_list_5_buglist.html']"));
			var threshold = parseInt(browser.text("tr:nth-child(2) > td > table > tbody td:nth-child(2) tr:nth-child(23) > td:nth-child(5) > font"));

			if(isNaN(outstanding) || isNaN(threshold)) {
				res.status(500).send({});
			} else {
				res.send({
					actual: parseInt(outstanding),
					threshold: parseInt(threshold)
				});					
			}
		})
		.then(function() {
			browser.close();
		});
};

