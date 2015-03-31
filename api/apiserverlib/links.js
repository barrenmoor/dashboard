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
				url: "http://bxb-ccbu-sonar.cisco.com:9000/drilldown/violations/799747"
			},
			defectcount: {
				href: "/enotify-v8/sites/ccbu/output/website/bug_list_2_buglist.html"
			},
			cibuild: {
				server: "bgl-ccbu-kabini",
				path: "/jenkins/view/UCCX_MAVEN/job/uccx_1101_ci/lastSuccessfulBuild/testReport/api/json"
			},
			linecoverage: {
				url: "http://bxb-ccbu-sonar.cisco.com:9000/components/index/799747"
			},
			branchcoverage: {
				url: "http://bxb-ccbu-sonar.cisco.com:9000/components/index/799747"
			},
			defectstatistics: {
				url: "http://enotify9-1.cisco.com/enotify-v8/sites/ccbu/output/website/bug_list_2_buglist.html"
			},
			defectdistribution: {
				url: "http://enotify9-1.cisco.com/enotify-v8/sites/ccbu/output/website/bug_list_2_buglist.html",
				teams: [{
					team: "Marut",
					members: ["anurjain", "mshet", "sridhcha", "velanka", "usantra", "kavpraka", "archinna"]
				},{
					team: "CaveMen",
					members: ["bdoraisa", "gopks", "mokathir", "smahesh", "gosivaku", "mgundapp"]
				},{
					team: "Crusaders",
					members: ["supaturu", "aharinat", "jhimdey", "anigopal", "karkarki", "mamysore"]
				},{
					team: "Yoddhas",
					members: ["raarasu", "neeljain", "siravind", "kavyvish", "gaurchau", "kareghu"]
				},{
					team: "Sparkles",
					members: ["kkakuman", "ragtk", "reparame", "anukum3", "ckunjumo", "chindcha"]
				},{
					team: "Falcons",
					members: ["amarkum", "satkadam", "nejm", "jyjoshi", "sabitasa"]
				}]
			},
			teststatistics: {
				file: "uccx-tests.txt"
			}
		},

		cuic: {
			product: product,
			staticviolations: {
				url: "http://bxb-ccbu-sonar.cisco.com:9000/drilldown/violations/660075"
			},
			defectcount: {
				href: "/enotify-v8/sites/ccbu/output/website/bug_list_5_buglist.html"
			},
			cibuild: {
				server: "bgl-ccbu-kabini",
				path: "/jenkins/view/CUIC_MAVEN/job/cuic_1101_staging_ci/lastSuccessfulBuild/testReport/api/json"
			},
			linecoverage: {
				url: "http://bxb-ccbu-sonar.cisco.com:9000/components/index/660075"
			},
			branchcoverage: {
				url: "http://bxb-ccbu-sonar.cisco.com:9000/components/index/660075"
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
					members: ["agartia", "cthadika", "shailjas", "vesane"]
				}, { 
					team: "Documentation",
					members: ["jnishant", "shsupriy"]
				}]
			},
			teststatistics: {
				file: "cuic-tests.txt"
			}
		},
		cvp: {
			product: product,
			staticviolations: {
				url: "http://bxb-ccbu-sonar:9000/drilldown/violations/609935"
			},
			defectcount: {
				href: "/enotify-v8/sites/ccbu/output/website/bug_list_4_buglist.html"
			},
			cibuild: {
				server: "bigbend",
				path: "/jenkins/view/CVP/job/CVP_AUROVILLE_CI/lastSuccessfulBuild/testReport/api/json"
			},
			linecoverage: {
				url: "http://bxb-ccbu-sonar:9000/components/index/609935"
			},
			branchcoverage: {
				url: "http://bxb-ccbu-sonar:9000/components/index/609935"
			},
			defectstatistics: {
				url: "http://enotify9-1.cisco.com/enotify-v8/sites/ccbu/output/website/bug_list_4_buglist.html"
			},
			defectdistribution: {
				url: "http://enotify9-1.cisco.com/enotify-v8/sites/ccbu/output/website/bug_list_4_buglist.html",
				teams: [{
        				team: "Cool Sharks",
        				members: ["sumuthur", "kvarun", "txavier", "rvaliyap", "ricsing2", "bmajumde", "sdoddali", "sudhgaur"]
				},{
        				team: "F22 Raptors",
        				members: ["radmohan", "ananpadm", "bbilas", "visyadav", "samshar2", "sumuppal"]
				},{
        				team: "Saptarishi",
        				members: ["manil", "sujunas", "pprabhan", "vanbalas", "ssamadda"]
				},{
        				team: "Whitewater",
        				members: ["avinkum2", "rguvvala", "shimoham"]
				}]
			},
			teststatistics: {
				file: "cvp-tests.txt"
			}
		},
		vb: {
			product: product,
			staticviolations: {
				url: "http://bxb-ccbu-sonar:9000/drilldown/violations/648965"
			},
			defectcount: {
				href: "/enotify-v8/sites/ccbu/output/website/bug_list_47_buglist.html"
			},
			cibuild: {
				server: "bgl-ccbu-kabini",
				path: "/jenkins/view/VOICEBROWSER/job/BANSURI_r11.0.1_CI/lastSuccessfulBuild/testReport/api/json"
			},
			linecoverage: {
				url: "http://bxb-ccbu-sonar:9000/components/index/648965"
			},
			branchcoverage: {
				url: "http://bxb-ccbu-sonar:9000/components/index/648965"
			},
			defectstatistics: {
				url: "http://enotify9-1.cisco.com/enotify-v8/sites/ccbu/output/website/bug_list_47_buglist.html"
			},
			defectdistribution: {
				url: "http://enotify9-1.cisco.com/enotify-v8/sites/ccbu/output/website/bug_list_47_buglist.html",
				teams: [{
					team: "Falcons",
					members: ["anjeelan", "gubt", "mallikar", "sundravi", "vijgupt2"]
				},{
					team: "Finch",
					members: ["chacktho", "ndreddy", "pachaita", "varampra", "sujimoha", "bagoswam"]
				},{
					team: "Flamingos",
					members: ["amagniho", "goujain", "ranjeetk", "viknaik", "ajisrini", "psuyambu"]
				}]
			},
			teststatistics: {
				file: "vb-tests.txt"
			}
		},
                sm: {
                        product: product,
                        staticviolations: {
                                url: "http://bxb-ccbu-sonar.cisco.com:9000/drilldown/violations/45368"
                        },
                        defectcount: {
                                href: "/enotify-v8/sites/ccbu/output/website/bug_list_7_buglist.html"
                        },
                        cibuild: {
                                server: "bigbend",
                                path: "/jenkins/view/CCP/job/SocialMiner_Master_Branch_Deploy/lastSuccessfulBuild/testReport/api/json"
                        },
                        linecoverage: {
                                url: "http://bxb-ccbu-sonar.cisco.com:9000/components/index/45368"
                        },
                        branchcoverage: {
                                url: "http://bxb-ccbu-sonar.cisco.com:9000/components/index/45368"
                        },
                        defectstatistics: {
                                url: "http://enotify9-1.cisco.com/enotify-v8/sites/ccbu/output/website/bug_list_7_buglist.html"
                        },
                        defectdistribution: {
                                url: "http://enotify9-1.cisco.com/enotify-v8/sites/ccbu/output/website/bug_list_7_buglist.html",
                                teams: [{
                                        team: "Charlie",
                                        members: ["krlakshm","manabr","parmj","prukey","ravkota","rvj","sandibha"]
                                },{
                                        team: "Tango",
                                        members: ["fariff","jaslekau","namahesh","racray","ranjchan"]
                                }]
                        },
                        teststatistics: {
                                file: "sm-tests.txt"
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
        	try {
        		var json = JSON.parse(output);
        	} catch (e) {
				res.status(500).send({
					error: "CI build data is not parseable."
				});

				return;
        	}

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
		var series = [];

		var findTeam = function(member) {
			if(member === 'unassigned') {
				return "Unassigned";
			} else if(member === 'resolved') {
				return "Resolved";
			}

			for(var i in teams) {
				if(teams[i].members.indexOf(member) != -1) {
					return teams[i].team;
				}
			}

			return "Others";
		};


		return {
			updateSeries : function(owner) {
				var team = findTeam(owner);
				var stat;

				for(var i in series) {
					if(series[i].label == team) {
						stat = series[i];
						break;
					}
				}

				if(stat) {
					stat.value++;
				} else {
					series.push({
						label: team,
						value: 1
					});
				}
			},

			getGoogleChartSeries : function() {
				var googleChartSeries = [];
				for(var i in series) {
					if(series[i].label === 'Unassigned') {
						googleChartSeries.push({
							name : series[i].label,
							y: series[i].value,
							sliced: true,
							selected: true
						});
					} else {
						googleChartSeries.push([series[i].label, series[i].value]);
					}
				}

				return googleChartSeries;
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
					var result = [];
					$("table[style!='display: none'] table.solid_blue_border_full tr td:nth-child(3)").each(function() {
						var status = $(this).parent().find("td:nth-child(13)").text().trim();
						var owner = $(this).text().trim();

						result.push({
							owner: owner,
							status: status
						});
					});
					return result;
				}, function(result) {
					var calculator = new DefectDistributionCalc();

					for(var i in result) {
						if(result[i].status == 'N') {
							calculator.updateSeries('unassigned');
						} else if(result[i].status == 'R') {
							calculator.updateSeries('resolved');
						} else {
							calculator.updateSeries(result[i].owner);
						}
					}
					res.send({
						values: calculator.getGoogleChartSeries()
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
