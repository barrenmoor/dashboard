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
		path: '/jenkins/view/CUIC_MAVEN/job/cuic_1051_ci/lastSuccessfulBuild/testReport/',
		method: 'GET'
	}, function(response) {
		var output = '';

		response.on('data', function(chunk) {
            output += chunk;
        });

        response.on('end', function() {
            var xml = output;
            var doc = new dom().parseFromString(xml);
			var nodes = xpath.select("//td[@id='main-panel']/div/div", doc);

			var failCount = -1;
			var totalCount = -1;

			var splitFind = function(str) {
				str = str.split(" ");
				for(var i in str) {
					if(str[i].length != 0 && str[i] != '\n') {
						return str[i].replace(",", "");
					}
				}
				return '-1';
			};

			if(nodes) {
				failCount = splitFind(nodes[0].firstChild.data);
				totalCount = splitFind(nodes[2].firstChild.data);
			} else {
				console.log('nothing found');
			}

			res.send({
				total: totalCount,
				failed: failCount
			});
        });
	});

	request.end();
}