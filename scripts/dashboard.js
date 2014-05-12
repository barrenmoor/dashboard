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
		scope: {title: '@', dataUrl: '@', type: '@', id: '@'},
		templateUrl: 'widget.html',
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
					$http.get(dataUrl).success(function(data) {
						$scope.widget.data = data;
						$scope.widget.loaded = true;
					}).error(function() {
						//TODO: revisit later on
						//how do we refresh a gadget?
						$scope.widget.data = {};
						$scope.widget.loaded = true;
					});
				} else {
					//TODO: remove else case later
					var data = {};
					$scope.widget.data = data;
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
		templateUrl: 'datagadget.html',
		replace: true
	};
});

