exports.widgets = function(req, res) {
	res.send([{
		title: 'DEFECT DISTRIBUTION',
		type: 'CHART',
		data: ''
	}, {
		title: 'LINE COVERAGE',
		type: 'DELTA',
		data: ''
	}, {
		title: 'BRANCH COVERAGE',
		type: 'DELTA',
		data: ''
	}, {
		title: 'STATIC VIOLATIONS',
		type: 'DELTA',
		data: ''
	}, {
		title: 'DEFECTS COUNT',
		type: 'ABSOLUTE',
		data: ''
	}]);
};