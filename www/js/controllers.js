angular.module('mattemongot.controllers', [])

	.controller('DashCtrl', function ($scope, $localStorage, $location, $state) {

		$scope.$storage = $localStorage;
		$scope.$on('$ionicView.enter', function (e) {
		});

		$scope.selectLevel = function (level) {
			$state.go('tab.play', { levelIndex: level });
		};

	})

	.controller('PlayCtrl', function ($scope, $localStorage, $stateParams, $interval, MathService) {

		// Ionice enter & leave
		$scope.$on('$ionicView.enter', function (e) {

			// Local storage and routeparameters
			$scope.$storage = $localStorage;
			$scope.level = $scope.$storage.settings.levels[parseInt($stateParams.levelIndex)];
			$scope.userLevel = $scope.$storage.userSettings.levels[parseInt($stateParams.levelIndex)];
			$scope.lastClick;

			$scope.init();
			$scope.cancel = $interval(timerTick, 1000);
			console.log("Enter,start timer");
		});

		$scope.$on('$ionicView.leave', function (e) {
			console.log("Leave,shutdown timer");
			if(angular.isDefined($scope.cancel)) {
				$interval.cancel($scope.cancel);
				$scope.cancel = undefined;
			}
		});

		// Timer tick when started
		function timerTick() {
			
			if($scope.delta > 0) {
				var factor = $scope.delta/100 * 3;
				$scope.delta -= (1 + factor);
				if($scope.delta < 0) $scope.delta = 0;
			}
			
			// Check stats
			if($scope.delta > 70 && $scope.userLevel.stars < 3) {
				$scope.userLevel.stars = 3;
				console.log("Gold medal awarded");
			}
			if($scope.delta > 50 && $scope.userLevel.stars < 2) {
				$scope.userLevel.stars = 2;
				console.log("Silver medal awarded");
			}
			if($scope.delta > 30 && $scope.userLevel.stars < 1) {
				$scope.userLevel.stars = 1;
				console.log("Bronze medal awarded");
			}
			console.log("Timer... delta: " + $scope.delta);

						
		}

		$scope.onClickAnswer = function(index) {
			
			var spamClickCheck = Date.now() - $scope.lastClick;
			$scope.lastClick = Date.now();
			if (spamClickCheck < 500) {
				console.log("Spam click");
				return;
			}

			$scope.isCorrect = $scope.quiz.correctIndex == index;
			console.log("Answer is: " + ($scope.isCorrect ? "correct" : "incorrect"));
			$scope.delta += (100-$scope.delta)/8 * ($scope.isCorrect ? 1 : -1 );
			if($scope.delta < 0) $scope.delta = 0;
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

	.controller('SettingsCtrl', function ($scope, $rootScope, SettingsService, $ionicPopup, $localStorage) {

		$scope.$storage = $localStorage;
		$scope.$on('$ionicView.enter', function (e) {
		});


		$scope.reset = function () {

			$localStorage.userSettings = SettingsService.getUserSettings();
			$localStorage.settings = SettingsService.getSettings();
			$localStorage.settings.version = $rootScope.version;
			$localStorage.userSettings.version = $rootScope.version;
		};

		$scope.showConfirm = function () {
			var confirmPopup = $ionicPopup.confirm({
				title: 'Bekräfta återställning',
				template: 'Är du säker på att du vill börja om?',
				cancelText: 'Avbryt'
			});
			confirmPopup.then(function (res) {
				if (res) {
					$scope.reset();
				} else {
				}
			});
		};
	})
