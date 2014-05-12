var http = require('http');
var fs = require('fs');

var dashboardwidgets = [{
		id: 'cuic-widget-id-0',
		title: 'DEFECT DISTRIBUTION',
		type: 'CHART',
		options: {draggable: false},
		dataUrl: 'defectdistribution'
	}, {
		id: 'cuic-widget-id-1',
		title: 'LINE COVERAGE',
		type: 'DELTA',
		options: {unit: "%", green: "up", draggable: true},
		dataUrl: 'linecoverage'
	}, {
		id: 'cuic-widget-id-2',
		title: 'BRANCH COVERAGE',
		type: 'DELTA',
		options: {unit: "%", green: "up", draggable: true},
		dataUrl: 'branchcoverage'
	}, {
		id: 'cuic-widget-id-3',
		title: 'STATIC VIOLATIONS',
		type: 'DELTA',
		options: {green: "down", draggable: true},
		dataUrl: 'staticviolations'
	}, {
		id: 'cuic-widget-id-4',
		title: 'DEFECTS COUNT',
		type: 'ABSOLUTE',
		options: {draggable: true},
		dataUrl: 'defectcount'
	}, {
		id: 'cuic-widget-id-5',
		title: 'CI BUILD',
		type: 'MULTISTAT',
		options: {draggable: true},
		dataUrl: 'cibuild'
	}];

var DeltaRecordUtil = function(green, value, file, precision) {
	var response;
	var delta = 0;
	var better = false;
	var precision = precision ? precision : 0;

	var success = function() {
		response.send({
			value: Number(value).toFixed(precision),
			delta: Number(delta).toFixed(precision),
			better: better
		});
	};

	var error = function() {
		response.status(500).send({
			error: "Internal Server Error!"
		});						
	};

	var getLine = function(prev, curr) {
		return prev + "," + curr;
	};

	var getValues = function(line) {
		var values = line.split(",");
		return {
			prev: parseFloat(values[0]),
			curr: parseFloat(values[1])
		};
	}

	return {
		recordAndRespond: function(res) {
			response = res;

			if(isNaN(value)) {
				error();
			}

			if(fs.existsSync(file)) {
				fs.readFile(file, function(err, data) {
					if(err) {
						error();
					} else {
						var prevResults = getValues(data + "");

						delta = value - (value == prevResults.curr ? prevResults.prev : prevResults.curr);
						better = (green == "up") ? (delta > 0) : (delta < 0);

						if(value != prevResults.curr) {
							fs.writeFile(file, getLine(prevResults.curr, value), success);
						} else {
							success();
						}
					}
				});
			} else {
				fs.writeFile(file, getLine(value, value), success);
			}
		}
	};
};

exports.widgets = function(req, res) {
	res.send(dashboardwidgets);
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
	var phantom = require('phantom');
	phantom.create(function(ph) {
		console.log("opening enotify9-1");
		return ph.createPage(function(page) {
			return page.open("http://enotify9-1.cisco.com/enotify-v8/sites/ccbu/output/website/index.html", function(status) {
				console.log("opened enotify9-1? ", status);
				page.injectJs("scripts/thirdparty/jquery/jquery-1.11.0.min.js");

				page.evaluate(function() {
					var outstanding = parseInt($("a[href='/enotify-v8/sites/ccbu/output/website/bug_list_5_buglist.html']").text());
					var threshold = parseInt($("a[href='/enotify-v8/sites/ccbu/output/website/bug_list_5_buglist.html']")
													.parent().parent().parent().parent()
													.children(":nth-child(5)")
													.children("font").text());

					return {
						actual: outstanding,
						threshold: threshold
					};
				}, function(result) {
					if(isNaN(result.actual) || isNaN(result.threshold)) {
						res.status(500).send({
							error: "Internal Server Error!"
						});						
					} else {
						res.send(result);
					}
					ph.exit();
				});
			});
		});
	});
};

exports.linecoverage = function(req, res) {
	var phantom = require('phantom');
	phantom.create(function(ph) {
		console.log("opening sonar");
		return ph.createPage(function(page) {
			return page.open("http://bxb-ccbu-sonar.cisco.com:9000/components/index/503756", function(status) {
				console.log("opened sonar? ", status);
				page.injectJs("scripts/thirdparty/jquery/jquery-1.11.0.min.js");

				page.evaluate(function() {
					var linecoverage = parseFloat($("th > span#m_line_coverage").text().replace("%", ""));

					return {
						value: linecoverage
					};
				}, function(result) {
					var util = new DeltaRecordUtil("up", result.value, "linecoverage.txt", 2);
					util.recordAndRespond(res);

					ph.exit();
				});
			});
		});
	});
};

exports.branchcoverage = function(req, res) {
	var phantom = require('phantom');
	phantom.create(function(ph) {
		console.log("opening sonar");
		return ph.createPage(function(page) {
			return page.open("http://bxb-ccbu-sonar.cisco.com:9000/components/index/503756", function(status) {
				console.log("opened sonar? ", status);
				page.injectJs("scripts/thirdparty/jquery/jquery-1.11.0.min.js");

				page.evaluate(function() {
					var branchcoverage = parseFloat($("th > span#m_branch_coverage").text().replace("%", ""));

					return {
						value: branchcoverage
					};
				}, function(result) {
					var util = new DeltaRecordUtil("up", result.value, "branchcoverage.txt", 2);
					util.recordAndRespond(res);

					ph.exit();
				});
			});
		});
	});
};

exports.staticviolations = function(req, res) {
	var phantom = require('phantom');
	phantom.create(function(ph) {
		console.log("opening sonar");
		return ph.createPage(function(page) {
			return page.open("http://bxb-ccbu-sonar.cisco.com:9000/drilldown/violations/503756", function(status) {
				console.log("opened sonar? ", status);
				page.injectJs("scripts/thirdparty/jquery/jquery-1.11.0.min.js");

				page.evaluate(function() {
					var total = 0;
					var spanIds = ["m_blocker_violations", "m_critical_violations", "m_major_violations", "m_minor_violations", "m_info_violations"];

					for(var i = 0; i < spanIds.length; i++) {
						var val = parseInt($("span#" + spanIds[i]).text());
						if(isNaN(val)) {
							return {
								value: "Internal Server Error"
							};
						} else {
							total += val;
						}
					}
					return {
						value: total
					};
				}, function(result) {
					var util = new DeltaRecordUtil("down", result.value, "staticviolations.txt");
					util.recordAndRespond(res);

					ph.exit();
				});
			});
		});
	});
};

exports.defectdistribution = function(req, res) {
	var DefectDistributionCalc = function() {
		var teams = [{
			team: "Evoque",
			members: ["asrambik", "rottayil", "vandatho", "vgahoi"]
		}, {
			team: "Snipers",
			members: ["serrabel", "mevelu", "pperiasa", "rmurugan", "ycb"]
		}, {
			team: "Vipers",
			members: ["srevunur", "ssonnad", "visgiri", "rajagkri"]
		}, {
			team: "Range Rover",
			members: ["agartia", "cthadika", "sasivana", "shailjas", "vesane"]
		}, {
			team: "Hummer",
			members: ["dihegde", "karajase", "mandhing", "shidas", "sobenny"]
		}, {
			team: "Documentation",
			members: ["jnishant"]
		}];

		var series = [{
			label: "Others",
			value: 0,
			perc: 0.0
		}];

		for(var i in teams) {
			series.push({
				label: teams[i].team,
				value: 0,
				perc: 0.0
			});
		}

		var findTeam = function(member) {
			for(var i in teams) {
				if(teams[i].members.indexOf(member) != -1) {
					return teams[i].team;
				}
			}
			return "Others";
		};

		var getColorAt = function(at) {
			var steps = 100;
			var from = 1, to = 0;
			at = at > steps ? steps : at;

			var howMany = parseInt(Number(511 * at / steps).toFixed(0));

			var rgb = ["00", "00", "00"];
			rgb[from] = "ff";

			if(howMany < 256) {
				var increased = parseInt(howMany).toString(16);
				increased = increased.length == 1 ? "0" + increased : increased;

				rgb[to] = increased;
			} else {
				var reduced = parseInt(511 - howMany).toString(16);
				reduced = reduced.length == 1 ? "0" + reduced : reduced;

				rgb[to] = "ff";
				rgb[from] = reduced;
			}

			return "#" + rgb[0] + rgb[1] + rgb[2];
		};


		var updatePercentages = function() {
			series.sort(function(a, b) {
				return b.value - a.value;
			});

			var max = series[0].value;

			for(var i in series) {
				if(series[i].value == 0) {
					break;
				}

				series[i].perc = parseFloat(Number((series[i].value * 100.0) / max).toFixed(2));
				series[i].color = getColorAt(series[i].perc);
			}

			series.sort(function(a, b) {
				return a.value - b.value;
			});
		};

		return {
			updateSeries : function(owner) {
				var team = findTeam(owner);
				for(var i in series) {
					if(series[i].label == team) {
						series[i].value++;
					}
				}
			},

			getSeries : function() {
				updatePercentages();
				return series;
			}
		};	
	};

	var phantom = require('phantom');
	phantom.create(function(ph) {
		console.log("opening enotify9-1");
		return ph.createPage(function(page) {
			return page.open("http://enotify9-1.cisco.com/enotify-v8/sites/ccbu/output/website/bug_list_5_buglist.html", function(status) {
				console.log("opened enotify9-1? ", status);
				page.injectJs("scripts/thirdparty/jquery/jquery-1.11.0.min.js");

				page.evaluate(function() {
					var owners = [];
					$("table#Severity table.solid_blue_border_full tr td:nth-child(3)").each(function() {
						owners.push($(this).text().trim());
					});
					return owners;
				}, function(result) {
					var calculator = new DefectDistributionCalc();
					for(var i in result) {
						calculator.updateSeries(result[i]);
					}
					res.send({
						values: calculator.getSeries()
					});

					ph.exit();
				});
			});
		});
	});
};