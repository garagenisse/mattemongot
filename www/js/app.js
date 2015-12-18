// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('mattemongot', ['ionic', 'mattemongot.controllers', 'mattemongot.services', 'ngStorage', 'ngCordova','pascalprecht.translate'])

.run(function ($ionicPlatform, SettingsService, $localStorage, $rootScope, $cordovaAppVersion, $translate) {
	$ionicPlatform.ready(function () {

		// http://robferguson.org/2015/07/22/internationalisation-i18n-and-localisation-l10n-for-ionic-apps/
		// Se över denna och kontrollera
		if (typeof navigator.globalization !== "undefined") {
			navigator.globalization.getPreferredLanguage(function (language) {
				$translate.use((language.value).split("-")[0]).then(function (data) {
					console.log("SUCCESS -> " + data);
				}, function (error) {
					console.log("ERROR -> " + error);
				});
			}, null);
		}

		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);

		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}

		// App version from cordova
		if (window.cordova && window.cordova.plugins) {
			$cordovaAppVersion.getVersionNumber().then(function (version) {
				$rootScope.version = version;

				// Upgrade settings
				SettingsService.checkUpgrade($rootScope.version);

			});

			//// turn on debug mode
			//$cordovaGoogleAnalytics.debugMode();

			//// Google analytics
			//$cordovaGoogleAnalytics.startTrackerWithId('UA-66615919-1');


		} else {

			// Kör alltid med senaste settings i Chrome för jag får inte ut versionsnummret...
			//alert("Reset settings");
			$localStorage.userSettings = SettingsService.getUserSettings();
			$localStorage.settings = SettingsService.getSettings();
			$localStorage.settings.version = "0.0.1";
			$localStorage.userSettings.version = "0.0.1";
			$rootScope.version = "0.0.1";
		}
	});
})

.config(function ($stateProvider, $urlRouterProvider, $translateProvider) {

	// Ionic uses AngularUI Router which uses the concept of states
	// Learn more here: https://github.com/angular-ui/ui-router
	// Set up the various states which the app can be in.
	// Each state's controller can be found in controllers.js
	$stateProvider

	// setup an abstract state for the tabs directive
	  .state('tab', {
	  	url: '/tab',
	  	abstract: true,
	  	templateUrl: 'templates/tabs.html'
	  })

	// Each tab has its own nav history stack:

	.state('tab.dash', {
		url: '/dash',
		views: {
			'tab-dash': {
				templateUrl: 'templates/tab-dash.html',
				controller: 'DashCtrl'
			}
		}
	})

	.state('tab.play', {
		url: '/play/:levelIndex',
		views: {
			'tab-play': {
				templateUrl: 'templates/tab-play.html',
				controller: 'PlayCtrl'
			}
		}
	})

	.state('tab.settings', {
		url: '/settings',
		views: {
			'tab-settings': {
				templateUrl: 'templates/tab-settings.html',
				controller: 'SettingsCtrl'
			}
		}
	});

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/tab/dash');

	// Translations
	$translateProvider.translations('en', {
		title_level: "Level",
		title_settings: "Settings",
		title_play: "Play",

		label_version: "Version:",

		panel_reset_title: 'Confirm reset',
		panel_reset_message: 'Are you sure you want to start over?',

		button_reset: "Reset",
		button_cancel: "Cancel",
		button_ok: "Ok"

	});
	$translateProvider.translations('se', {
		title_level: "Nivå",
		title_settings: "Inställningar",
		title_play: "Spela",

		label_version: "Version:",

		panel_reset_title: 'Bekräfta återställning',
		panel_reset_message: 'Är du säker på att du vill börja om?',

		button_reset: "Nollställ",
		button_cancel: "Avbryt",
		button_ok: "Ok"
});
	$translateProvider.preferredLanguage("en");
	$translateProvider.fallbackLanguage("en");
});
