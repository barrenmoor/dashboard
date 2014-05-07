angular.module('dashboard', ['ngRoute', 'widgets'])

.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			controller : 'MainCtrl',
			templateUrl : 'dashboard.html'
		});
})

.controller('MainCtrl', function($scope, $http) {
	$http.get('widgets').success(function(widgetData) {
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
		};

		$(document).ready(function() {
			$(window).on("resize", setDashboardArea);

			$(".widget").draggable({
				revert: true,
				opacity: 0.7,
				zIndex: 100
			});

			$(".widget").droppable({
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
		});

		setDashboardArea();
	});
});

angular.module('widgets', [])

.directive('widget', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {title: '@', dataUrl: '@'},
		template: '<table class="widget-table">' +
			'<tr class="widget-title">' +
				'<td class="widget-cell">{{title}}</td>' +
			'</tr>' +
			'<tr>' +
				'<td class="widget-cell widget-content">' +
					'<img src="images/loading-3.gif" ng-hide="widget.loaded"/>' +
					'<datagadget ng-show="widget.loaded" data="widget.data">' +
				'</td>' +
			'</tr>' +
		'</table>',
		replace: true,
		controller: function ($scope, $element, $http) {
			$scope.widget = {};
			$scope.widget.loaded = false;

			setTimeout(function() {
				var dataUrl = $element.attr('dataUrl');

				if(dataUrl.length != 0) {
					$http.get(dataUrl).success(function(data) {
						$scope.widget.data = data;
						$scope.widget.loaded = true;
					});
				}
			}, 1000);
		}
	};
})
	
.directive('datagadget', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {data: '='},
		template: '<span><span>Total Tests: {{data.total}}</span><br><span>Failed Tests: {{data.failed}}</span></span>',
		replace: true
	};
});

