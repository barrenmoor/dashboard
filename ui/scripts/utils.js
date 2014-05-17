var DashContentUtil = function() {
	var MIN_HEIGHT = 850;
	var MIN_WIDTH = 1450;

	var HEIGHT_PADDING = 60;
	var WIDTH_PADDING = 250;

	var layoutManagers = {
		"DOUBLE_HEIGHT" : {
			getSize : function(index, dashboardSize) {
				var width = (dashboardSize.width - 84) / 5;
				width = index == 0 ? ((width * 2) + 16) : width;

				var height = (dashboardSize.height - 36) / 2;
				height = index == 0 ? ((height * 2) + 16) : height;

				return {
					height : height,
					width : width
				};
			}
		}
	};

	return {
		getDashboardSize : function() {
			var windowHeight = $(window).height();
			var windowWidth = $(window).width();

			var height = (windowHeight - HEIGHT_PADDING) > MIN_HEIGHT ? (windowHeight - HEIGHT_PADDING) : MIN_HEIGHT;
			var width = (windowWidth - WIDTH_PADDING) > MIN_WIDTH ? (windowWidth - WIDTH_PADDING) : MIN_WIDTH;			
			
			return {
				height : height,
				width : width
			};
		},

		getLayoutManager : function(layout) {
			return layoutManagers[layout];
		}
	};
};

var RefreshUtil = function(timerStartValue) {
	var remaining = timerStartValue ? timerStartValue : 900;

	var format = function(val) {
		var hrs = parseInt(val / 3600);
		hrs = hrs < 10 ? "0" + hrs : hrs;

		var mins = parseInt((val - (hrs * 3600)) / 60);
		mins = mins < 10 ? "0" + mins : mins;

		var secs = val - (hrs * 3600) - (mins * 60);
		secs = secs < 10 ? "0" + secs : secs;

		return (hrs == "00" ? "" : hrs + ":") + mins + ":" + secs;
	};

	var updateMessage = function() {
		remaining--;

		$("#remaining-id").text(format(remaining));

		if(remaining > 0) {
			setTimeout(updateMessage, 1000);
		} else {
			location.reload();
		}
	};

	return {
		startTimer: function() {
			setTimeout(updateMessage, 1000);
		}
	};
};