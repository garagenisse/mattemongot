angular.module('mattemongot.controllers', [])

.controller('DashCtrl', function ($scope, $localStorage, $location, $state) {

	$scope.$storage = $localStorage;
	$scope.$on('$ionicView.enter', function (e) {
	});

	$scope.selectLevel = function (level) {
		$state.go('tab.play', { levelIndex: level });
	};

})

.controller('PlayCtrl', function ($scope, $localStorage, $stateParams) {

	$scope.$storage = $localStorage;
	$scope.$on('$ionicView.enter', function (e) {
	});

	$scope.levelIndex = parseInt($stateParams.levelIndex);
})

.controller('SettingsCtrl', function ($scope, $localStorage) {

	$scope.$storage = $localStorage;

	$scope.$on('$ionicView.enter', function (e) {
	});
});
