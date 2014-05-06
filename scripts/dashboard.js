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
		});

		setDashboardArea();
	});
});

angular.module('widgets', [])

.directive('widget', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {title: '@'},
		template: '<table class="widget-table">' +
			'<tr class="widget-title">' +
				'<td class="widget-cell">{{title}}</td>' +
			'</tr>' +
			'<tr>' +
				'<td class="widget-cell widget-content"><img src="images/loading-4.gif"></td>' +
			'</tr>' +
		'</table>',
		replace: true,
		controller: function ($scope, $element) {
			$scope.title = $element.attr('title');
		}
	}
});