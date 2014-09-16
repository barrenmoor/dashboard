angular.module('dashboard', ['ngRoute', 'widgets'])

.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			controller : 'MainCtrl',
			templateUrl : 'templates/main.html'
		})
		.when('/:dashboardId', {
			controller: 'DashboardCtrl',
			templateUrl: 'templates/dashboard.html'
		});
})

.controller('MainCtrl', function($scope, $http) {
	$("body").removeClass("dashboard-body-bg");
	$http.get('dashboards').success(function(dashboards) {
		$scope.dashboards = dashboards;
	})
	.error(function(){
		//handle this
	});
})

.controller('DashboardCtrl', function($scope, $http, $routeParams) {	
	$http.get($routeParams.dashboardId + '/widgets').success(function(widgetData) {
		$scope.widgets = widgetData;

		var setDashboardArea = function() {
			var u = new DashContentUtil();
			var dashboardSize = u.getDashboardSize();

			$("#dash-content-id").height(dashboardSize.height);
			$("#dash-content-id").width(dashboardSize.width);

			if(widgetData.length != 0) {
				var layoutManager = u.getLayoutManager("DOUBLE_HEIGHT");

				for(var i = 0; i < widgetData.length; i++) {
					var widgetSize = layoutManager.getSize(i, dashboardSize);

					$("#widget" + i).height(widgetSize.height);
					$("#widget" + i).width(widgetSize.width);
				}
			}
			$("body").addClass("dashboard-body-bg");
		};

		$(document).ready(function() {
			var refreshUtil = new RefreshUtil(90 * 60);
			refreshUtil.startTimer();
		});

		setDashboardArea();
	})
	.error(function() {
		//handle this
	});
});

var setDraggable = function(id) {
	$("#" + id).parent().draggable({
		revert: true,
		opacity: 0.7,
		zIndex: 1
	});

	$("#" + id).parent().addClass("widget-draggable");

	$("#" + id).parent().droppable({
		hoverClass: 'droppable-hover',
		tolerance: 'pointer',
		accept: '.widget',
		drop: function(event, ui) {
			var destHtml = $("#" + this.id).html();
			var srcHtml = $("#" + ui.helper[0].id).html();

			$("#" + this.id).empty();
			$("#" + ui.helper[0].id).empty();

			$("#" + this.id).append(srcHtml);
			$("#" + ui.helper[0].id).append(destHtml);
		}
	});
};

angular.module('widgets', [])

.directive('widget', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {title: '@', dataUrl: '@', type: '@', id: '@'},
		templateUrl: 'templates/widget.html',
		replace: true,
		controller: function ($scope, $element, $http) {
			$scope.widget = {};
			$scope.widget.loaded = false;

			setTimeout(function() {
				var dataUrl = $element.attr('dataUrl');
				var type = $element.attr('type');
				var id = $element.attr('id');

				var options = {};

				for(var i in $scope.$parent.widgets) {
					if(id == $scope.$parent.widgets[i].id) {
						options = $scope.$parent.widgets[i].options;
						break;
					}
				}

				$scope.widget.type = type;
				$scope.widget.options = options;

				if(dataUrl.length != 0) {
					$http.get("apicall?url=" + dataUrl).success(function(data) {
						$scope.widget.data = data;
						$scope.widget.loaded = true;
						if(options.draggable) {
							setDraggable(id);
						}
						if(type == 'CHART') {
							setTimeout(function() {
								$('#pie_container').highcharts({
								    chart: {
								        plotBackgroundColor: '#333333',
								        margin: [0, 0, 0, 0],
								        plotShadow: false,
								        options3d: {
								        	enabled: true,
								        	alpha: 45,
								        	beta: 0
								        }
								    },
								    title: {
								        text: ''
								    },
								    tooltip: {
								        pointFormat: '<b>{point.y}</b>'
								    },
								    plotOptions: {
								        pie: {
								            dataLabels: {
								                enabled: true,
								                format: '{point.y}',
								                style: {
								                	color: "#DEDEDE",
								                	fontSize: "32px"
								                },
								                distance: 30
								            },
								            depth: 35,
								            showInLegend: true
								        }
								    },
								    navigation: {
								    	buttonOptions: {
								    		enabled: false
								    	}
								    },
								    legend: {
								    	labelFormat: "{y} - {name}",
								    	itemStyle: {
								    		color: '#ffffff',
								    		fontSize: '16px',
								    		fontWeight: 'normal'
								    	},
								    	layout: 'horizontal',
								    	align: 'left',
								    	verticalAlign: 'top',
								    	y: -10
								    },
								    series: [{
								        type: 'pie',
								        data: data.values
								    }]
								});
							}, 100);
						}
					}).error(function() {
						$scope.widget.type = 'ERROR';
						$scope.widget.data = {
							id: id,
							details: "Error loading data from URL: " + dataUrl
						};
						$scope.widget.loaded = true;
					});
				} else {
					$scope.widget.type = 'ERROR';
					$scope.widget.data = {
						id: id,
						details: "No data URL specified for this widget."
					};
					$scope.widget.loaded = true;
				}
			}, 1000);
		}
	};
})
	
.directive('datagadget', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {data: '=', type: '=', options: '='},
		templateUrl: 'templates/datagadget.html',
		replace: true
	};
});

