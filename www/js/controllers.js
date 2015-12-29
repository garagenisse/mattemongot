angular.module('mattemongot.controllers', [])

	.controller('DashCtrl', function ($scope, $localStorage, $location, $state, $translate, $cordovaGoogleAnalytics) {

		$scope.$storage = $localStorage;
		$scope.$on('$ionicView.enter', function (e) {
			if (typeof window.analytics !== 'undefined'){
				$cordovaGoogleAnalytics.trackView('Dashboard');
			}
		});

		$scope.selectLevel = function (level) {
			$state.go('tab.play', { levelIndex: level });
		};

		$scope.translateLevel = function (label) {
			return $translate.instant('levels.' + label);
		}

	})

	.controller('PlayCtrl', function ($scope, $localStorage, $stateParams, $interval, MathService, $translate, $cordovaGoogleAnalytics) {

		// Ionice enter & leave
		$scope.$on('$ionicView.enter', function (e) {

			if (typeof window.analytics !== 'undefined'){
				$cordovaGoogleAnalytics.trackView('Play');
			}
			// Local storage and routeparameters
			$scope.$storage = $localStorage;
			$scope.level = $scope.$storage.settings.levels[parseInt($stateParams.levelIndex)];
			$scope.userLevel = $scope.$storage.userSettings.levels[parseInt($stateParams.levelIndex)];
			$scope.lastClick;
			$scope.levelDesc = $translate.instant('levels.' + $scope.level.label);

			$scope.init();
			if ($localStorage.userSettings.timed) {
				$scope.cancel = $interval(timerTick, 1000);
				console.log("Enter,start timer");
			}
		});

		$scope.$on('$ionicView.leave', function (e) {
			console.log("Leave,shutdown timer");
			if (angular.isDefined($scope.cancel)) {
				$interval.cancel($scope.cancel);
				$scope.cancel = undefined;
			}
		});

		// Timer tick when started
		function timerTick() {

			if ($scope.delta > 0) {
				var factor = $scope.delta / 100 * 3;
				$scope.delta -= (1 + factor);
				if ($scope.delta < 0) $scope.delta = 0;
			}
			
			// Check stats
			if ($scope.delta > 70 && $scope.userLevel.stars < 3) {
				$scope.userLevel.stars = 3;
				console.log("Gold medal awarded");
			}
			if ($scope.delta > 50 && $scope.userLevel.stars < 2) {
				$scope.userLevel.stars = 2;
				console.log("Silver medal awarded");
			}
			if ($scope.delta > 30 && $scope.userLevel.stars < 1) {
				$scope.userLevel.stars = 1;
				console.log("Bronze medal awarded");
			}
			console.log("Timer... delta: " + $scope.delta);


		}

		$scope.onClickAnswer = function (index) {

			var spamClickCheck = Date.now() - $scope.lastClick;
			$scope.lastClick = Date.now();
			if (spamClickCheck < 500) {
				console.log("Spam click");
				return;
			}

			$scope.isCorrect = $scope.quiz.correctIndex == index;
			console.log("Answer is: " + ($scope.isCorrect ? "correct" : "incorrect"));

			if ($localStorage.userSettings.timed) {
				$scope.delta += (100 - $scope.delta) / 8 * ($scope.isCorrect ? 1 : -1);
				if ($scope.delta < 0) $scope.delta = 0;
			}
			$scope.createQuiz();
		};
		$scope.init = function () {
			$scope.createQuiz();
			$scope.delta = 0;
			$scope.isCorrect = true;
		};

		$scope.createQuiz = function () {
			$scope.quiz = MathService.getQuiz($scope.level.level);
		}
	})

	.controller('SettingsCtrl', function ($scope, $rootScope, SettingsService, $ionicPopup, $localStorage, $translate, $cordovaGoogleAnalytics) {

		$scope.$storage = $localStorage;
		$scope.$on('$ionicView.enter', function (e) {
			if (typeof window.analytics !== 'undefined'){
				$cordovaGoogleAnalytics.trackView('Settings');
			}
		});


		$scope.reset = function () {

			$localStorage.userSettings = SettingsService.getUserSettings();
			$localStorage.settings = SettingsService.getSettings();
			$localStorage.settings.version = $rootScope.version;
			$localStorage.userSettings.version = $rootScope.version;
		};

		$scope.showConfirm = function () {
			var confirmPopup = $ionicPopup.confirm({
				title: $translate.instant('reset_panel.title'),
				template: $translate.instant('reset_panel.message'),
				cancelText: $translate.instant('buttons.cancel'),
				okText: $translate.instant('buttons.ok')

			});
			confirmPopup.then(function (res) {
				if (res) {
					$scope.reset();
				} else {
				}
			});
		};
	})
