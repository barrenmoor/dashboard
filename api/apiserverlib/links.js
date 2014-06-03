var http = require('http');
var fs = require('fs');

exports.getLogger = function() {
	var log4js = require('log4js');
	log4js.configure("log4js-api-conf.json", {});

	var logger = log4js.getLogger("apiserver");
	logger.setLevel('DEBUG');

	return logger;
};

var logger = exports.getLogger();

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
				return;
			}

			if(fs.existsSync(file)) {
				fs.readFile(file, function(err, data) {
					if(err) {
						error();
						return;
					} else {
						var prevResults = getValues(data + "");

						var prevDelta = prevResults.curr - prevResults.prev;
						var wasBetter = (green == "up") ? (prevDelta > 0) : (prevDelta < 0);

						if(value != prevResults.curr) {
							delta = wasBetter ? (value - prevResults.curr) : (value - prevResults.prev);
						} else {
							delta = value - prevResults.prev;
						}

						better = (green == "up") ? (delta > 0) : (delta < 0);

						if(value != prevResults.curr) {
							var updatedRecord = wasBetter ? getLine(prevResults.curr, value) : getLine(prevResults.prev, value);
							fs.writeFile(file, updatedRecord, success);
							return;
						} else {
							success();
							return;
						}
					}
				});
			} else {
				fs.writeFile(file, getLine(value, value), success);
				return;
			}
		}
	};
};

var ProductManagement = function(product) {
	var product = product ? product : "cuic";
	var allConf = {
		uccx: {
			product: product,
			staticviolations: {
				url: "http://bxb-ccbu-sonar.cisco.com:9000/drilldown/violations/392020"
			},
			defectcount: {
				href: "/enotify-v8/sites/ccbu/output/website/bug_list_2_buglist.html"
			},
			cibuild: {
				server: "bgl-ccbu-kabini",
				path: "/jenkins/view/UCCX_MAVEN/job/uccx_1051_fcs_ci/lastSuccessfulBuild/testReport/api/json"
			},
			linecoverage: {
				url: "http://bxb-ccbu-sonar.cisco.com:9000/components/index/392020"
			},
			branchcoverage: {
				url: "http://bxb-ccbu-sonar.cisco.com:9000/components/index/392020"
			},
			defectstatistics: {
				url: "http://enotify9-1.cisco.com/enotify-v8/sites/ccbu/output/website/bug_list_2_buglist.html"
			},
			defectdistribution: {
				url: "http://enotify9-1.cisco.com/enotify-v8/sites/ccbu/output/website/bug_list_2_buglist.html",
				teams: [{
					team: "Sparkles / Kaizen",
					members: ["sgowlika", "npasbola", "archinna", "anukuma3", "srikasri", "ashwmeno", "kavyvish", "azekhan", "raputta", "jramagir", "asingh6", "aditysin", "mamysore", "umshastr"]
				},{
					team: "Miracles / Crusaders",
					members: ["sashivra", "ragtk", "aharinat", "sdeviamm", "ansagar", "gisrikan", "kirachan", "supaturu", "mukuljai", "dchimata", "vdheenad", "rajkanda", "neeljain", "raarasu"]
				},{
					team: "Falcons",
					members: ["jyjoshi", "amarkum", "ckunjumo", "abhigup3", "chindcha", "satkadam", "nejm"]
				},{
					team: "DayDreamers / Mafia",
					members: ["vishashe", "amagniho", "usantra", "prukey", "anurjain", "jaslekau", "namahesh", "ravkota", "parmj", "ranjchan", "sandibha", "ssaikia"]
				},{
					team: "Yappers / Mavericks",
					members: ["mshet", "gopks", "jayas", "sharim", "jpannikk", "shivagar", "isdas", "praveesi", "fariff", "manabr", "mokathir", "shailesi"]
				},{
					team: "Smart / Garuda",
					members: ["smahesh", "racray", "jyos", "sabhiram", "bdoraisa", "sdandu", "rvj", "velanka", "gosivaku", "bhanprak"]
				}]
			},
			teststatistics: {
				file: "uccx-tests.txt"
			}
		},

		cuic: {
			product: product,
			staticviolations: {
				//10.5.1 url//url: "http://bxb-ccbu-sonar.cisco.com:9000/drilldown/violations/503756"
				url: "http://bxb-ccbu-sonar.cisco.com:9000/drilldown/violations/621533"
			},
			defectcount: {
				href: "/enotify-v8/sites/ccbu/output/website/bug_list_5_buglist.html"
			},
			cibuild: {
				server: "bgl-ccbu-kabini",
				//10.5.1 path//path: "/jenkins/view/CUIC_MAVEN/job/cuic_1051_ci/lastSuccessfulBuild/testReport/api/json"
				path: "/jenkins/view/CUIC_MAVEN/job/cuic_1101_ci/lastSuccessfulBuild/testReport/api/json"
			},
			linecoverage: {
				//10.5.1 url//url: "http://bxb-ccbu-sonar.cisco.com:9000/components/index/503756"
				url: "http://bxb-ccbu-sonar.cisco.com:9000/components/index/621533"
			},
			branchcoverage: {
				//10.5.1 url//url: "http://bxb-ccbu-sonar.cisco.com:9000/components/index/503756"
				url: "http://bxb-ccbu-sonar.cisco.com:9000/components/index/621533"
			},
			defectstatistics: {
				url: "http://enotify9-1.cisco.com/enotify-v8/sites/ccbu/output/website/bug_list_5_buglist.html"
			},
			defectdistribution: {
				url: "http://enotify9-1.cisco.com/enotify-v8/sites/ccbu/output/website/bug_list_5_buglist.html",
				teams: [{
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
				}]
			},
			teststatistics: {
				file: "cuic-tests.txt"
			}
		},
		cvp: {
			product: product,
			staticviolations: {
				url: "http://bxb-ccbu-sonar:9000/drilldown/violations/457335"
			},
			defectcount: {
				href: "/enotify-v8/sites/ccbu/output/website/bug_list_4_buglist.html"
			},
			cibuild: {
				server: "bigbend",
				path: "/jenkins/job/CVP_Marina_CI/lastSuccessfulBuild/testReport/api/json"
			},
			linecoverage: {
				url: "http://bxb-ccbu-sonar:9000/components/index/457335"
			},
			branchcoverage: {
				url: "http://bxb-ccbu-sonar:9000/components/index/457335"
			},
			defectstatistics: {
				url: "http://enotify9-1.cisco.com/enotify-v8/sites/ccbu/output/website/bug_list_4_buglist.html"
			},
			defectdistribution: {
				url: "http://enotify9-1.cisco.com/enotify-v8/sites/ccbu/output/website/bug_list_4_buglist.html",
				teams: [{
					team: "SAPTARISHI",
					members: ["manil", "aryanand", "sujunas", "pprabhan", "vanbalas", "ssamadda", "susdatta"]
				},{
					team: "F22-RAPTORS",
					members: ["radmohan", "ananpadm", "ankearor", "sunilku5", "samshar2", "sahramu", "avinkum2"]
				},{
					team: "COOL SHARKS",
					members: ["sumuthur", "amagulat", "kvarun", "sakssing", "sumuppal", "txavier", "shimoham"]
				},{
					team: "TYPHOONS",
					members: ["bbilas", "sanjeek5", "rvaliyap", "smogalis", "bmajumde", "ricsing2", "dbissa", "rguvvala"]
				}]
			},
			teststatistics: {
				file: "cvp-tests.txt"
			}
		}
	};

	return {
		getConf: function(type) {
			var conf = allConf[product][type];
			conf.product = allConf[product].product;

			return conf;
		}
	};
}

exports.cibuild = function(req, res) {
	var prodManagement = new ProductManagement(req.query.product);
	var conf = prodManagement.getConf("cibuild");

	var request = http.request({
		host: conf.server,
		path: conf.path,
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
        			style: json.failCount > 0 ? 'error' : ''
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
	var prodManagement = new ProductManagement(req.query.product);
	var conf = prodManagement.getConf("defectcount");

	phantom.create(function(ph) {
		logger.debug("opening enotify9-1");
		return ph.createPage(function(page) {
			return page.open("http://enotify9-1.cisco.com/enotify-v8/sites/ccbu/output/website/index.html", function(status) {
				logger.debug("opened enotify9-1? ", status);
				page.injectJs("scripts/thirdparty/jquery/jquery-1.11.0.min.js");

				page.evaluate(function(conf) {
					var outstanding = parseInt($("a[href='" + conf.href + "']").text());
					var threshold = parseInt($("a[href='" + conf.href + "']")
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
				}, conf);
			});
		});
	});
};

exports.linecoverage = function(req, res) {
	var prodManagement = new ProductManagement(req.query.product);
	var conf = prodManagement.getConf("linecoverage");

	var phantom = require('phantom');
	phantom.create(function(ph) {
		logger.debug("opening sonar");
		return ph.createPage(function(page) {
			return page.open(conf.url, function(status) {
				logger.debug("opened sonar? ", status);
				page.injectJs("scripts/thirdparty/jquery/jquery-1.11.0.min.js");

				page.evaluate(function() {
					var linecoverage = parseFloat($("th > span#m_line_coverage").text().replace("%", ""));

					return {
						value: linecoverage
					};
				}, function(result) {
					var util = new DeltaRecordUtil("up", result.value, conf.product + "-linecoverage.txt", 2);
					util.recordAndRespond(res);

					ph.exit();
				});
			});
		});
	});
};

exports.branchcoverage = function(req, res) {
	var prodManagement = new ProductManagement(req.query.product);
	var conf = prodManagement.getConf("branchcoverage");

	var phantom = require('phantom');
	phantom.create(function(ph) {
		logger.debug("opening sonar");
		return ph.createPage(function(page) {
			return page.open(conf.url, function(status) {
				logger.debug("opened sonar? ", status);
				page.injectJs("scripts/thirdparty/jquery/jquery-1.11.0.min.js");

				page.evaluate(function() {
					var branchcoverage = parseFloat($("th > span#m_branch_coverage").text().replace("%", ""));

					return {
						value: branchcoverage
					};
				}, function(result) {
					var util = new DeltaRecordUtil("up", result.value, conf.product + "-branchcoverage.txt", 2);
					util.recordAndRespond(res);

					ph.exit();
				});
			});
		});
	});
};

exports.staticviolations = function(req, res) {
	var phantom = require('phantom');
	var prodManagement = new ProductManagement(req.query.product);
	var conf = prodManagement.getConf("staticviolations");

	phantom.create(function(ph) {
		logger.debug("opening sonar");
		return ph.createPage(function(page) {
			// page.set('settings.resourceTimeout', 30000); //30 seconds
			// page.onResourceTimeout = function(e) {
			// 	logger.debug(e ? (e.url + ": " + e.errorCode + " " + e.errorString) : "Resource timeout: " + conf.url);
			// 	res.status(500).send({
			// 		error: "Internal Server Error"
			// 	});
			// 	ph.exit();
			// };
			return page.open(conf.url, function(status) {
				logger.debug("opened sonar? ", status);
				page.injectJs("scripts/thirdparty/jquery/jquery-1.11.0.min.js");

				page.evaluate(function() {
					var total = 0;
					var spanIds = ["m_blocker_violations", "m_critical_violations", "m_major_violations", "m_minor_violations", "m_info_violations"];

					for(var i = 0; i < spanIds.length; i++) {
						var val = parseInt($("span#" + spanIds[i]).text().replace(",", ""));
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
					var util = new DeltaRecordUtil("down", result.value, conf.product + "-staticviolations.txt");
					util.recordAndRespond(res);

					ph.exit();
				});
			});
		});
	});
};

exports.defectstatistics = function(req, res) {
	var prodManagement = new ProductManagement(req.query.product);
	var conf = prodManagement.getConf("defectstatistics");

	var phantom = require('phantom');
	phantom.create(function(ph) {
		logger.debug("opening enotify9-1");
		return ph.createPage(function(page) {
			return page.open(conf.url, function(status) {
				logger.debug("opened enotify9-1? ", status);
				page.injectJs("scripts/thirdparty/jquery/jquery-1.11.0.min.js");

				page.evaluate(function() {
					var cfdcount = 0;
					$("table#Severity table.solid_blue_border_full tr td:nth-child(17)").each(function() {
						var value = $(this).text().trim();
						if(value == "customer-use") {
							cfdcount++;
						}
					});

					var olddefectcount = 0;
					$("table#Severity table.solid_blue_border_full tr td:nth-child(11)").each(function() {
						var value = parseInt($(this).text().trim());
						if(value > 28) {
							olddefectcount++;
						}
					});

					var s1s2defectcount = 0;
					$("table#Severity table.solid_blue_border_full tr td:nth-child(7)").each(function() {
						var value = parseInt($(this).text().trim());
						if(value < 3) {
							s1s2defectcount++;
						}
					});

		        	return {
		        		values : [{
		        			label: "Customer Found Defects",
		        			value: cfdcount,
		        			style: cfdcount > 0 ? 'error' : 'success'
		        		}, {
		        			label: "> 28 Days Defects",
		        			value: olddefectcount,
		        			style: olddefectcount > 0 ? 'error' : 'success'
		        		}, {
		        			label: "S1-S2 Defects",
		        			value: s1s2defectcount,
		        			style: s1s2defectcount > 0 ? 'error' : 'success'
		        		}]
		        	};
				}, function(result) {
					res.send(result);
					ph.exit();
				});
			});
		});
	});
};

exports.defectdistribution = function(req, res) {
	var prodManagement = new ProductManagement(req.query.product);
	var conf = prodManagement.getConf("defectdistribution");

	var DefectDistributionCalc = function() {
		var teams = conf.teams;

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
		logger.debug("opening enotify9-1");
		return ph.createPage(function(page) {
			return page.open(conf.url, function(status) {
				logger.debug("opened enotify9-1? ", status);
				page.injectJs("scripts/thirdparty/jquery/jquery-1.11.0.min.js");

				page.evaluate(function() {
					var owners = [];
					$("table[style!='display: none'] table.solid_blue_border_full tr td:nth-child(3)").each(function() {
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

exports.teststatistics = function(req, res) {
	var prodManagement = new ProductManagement(req.query.product);
	var conf = prodManagement.getConf("teststatistics");

	var getStats = function(str) {
		var stats = {
			values: []
		};

		if(!str) {
			return stats;
		}

		var lines = str.split("\n");
		for(var i = 0; i < lines.length; i++) {
			if(lines[i] && lines[i].trim().length > 0) {
				var parts = lines[i].split(",");
				var value = {};
				var threshold, unit;
				for(var j = 0; j < parts.length; j++) {
					if(j == 0) {
						value.label = parts[j].trim().length == 0 ? "No Title" : parts[j].trim();
					} else if(j == 1) {
						threshold = parseFloat(parts[j].trim());
					} else if(j == 2) {
						unit = parts[j].trim();
						value.unit = unit;
					} else if(j == 3 && !isNaN(parseFloat(parts[j].replace("%")))) {
						value.value = Number(parseFloat(parts[j].replace("%"))).toFixed(2);
						value.style = value.value < threshold ? 'error' : 'success';
					}
				}
				if(value.label.length > 0) {
					stats.values.push(value);
				}
			}
		}

		return stats;
	}

	if(fs.existsSync(conf.file)) {
		fs.readFile(conf.file, function(err, data) {
			var stats = getStats(data + "");
			res.send(stats);
		});
	} else {
		res.status(500).send({
			error: "Internal Server Error!"
		});
	}
};