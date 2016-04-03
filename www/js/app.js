// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('mattemongot', ['ionic', 'mattemongot.controllers', 'mattemongot.services', 'ngStorage', 'ngCordova', 'pascalprecht.translate', 'tmh.dynamicLocale'])

	.constant('availableLanguages', ['en-us', 'sv-se'])
	.constant('defaultLanguage', 'en-us')

	.run(function ($ionicPlatform, SettingsService, $localStorage, $rootScope, $cordovaAppVersion, $cordovaGlobalization, $translate, defaultLanguage, tmhDynamicLocale, $window) {

		$ionicPlatform.ready(function () {

			// https://medium.com/@skounis/internationalize-and-localize-your-ionic-application-e16b4db1907b#.ryaerfrin
			// Se över denna och kontrollera
			if (typeof navigator.globalization !== "undefined") {
				navigator.globalization.getPreferredLanguage(function (language) {
					$translate.use(language.value.toLowercase().substring(0,2)).then(function (data) {
					//$translate.use(language.value.toLowercase()).then(function (data) {
						console.log("SUCCESS -> " + data);
						tmhDynamicLocale.set(language.value.toLowercase());
					}, function (error) {
						console.log("ERROR -> " + error);
						tmhDynamicLocale.set(defaultLanguage);
					});
				}, null);
			} else {
				var locale = "sv"; // $window.navigator.language.toLocaleLowerCase();
				$translate.use(locale).then(function (data) {
					console.log("SUCCESS -> " + data);
					tmhDynamicLocale.set(locale);
				}, function (error) {
					console.log("ERROR -> " + error);
					tmhDynamicLocale.set(defaultLanguage);
				});
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
				$cordovaAppVersion.getAppName().then(function (name) {
					$rootScope.name = name;
				});

				// turn on debug mode
				$cordovaGoogleAnalytics.debugMode();

				// Google analytics
				$cordovaGoogleAnalytics.startTrackerWithId('UA-66615919-2');
			} else {

				// Dummysetting för browserdebug, denna version failar uppgradering och återställer till default
				$localStorage.userSettings = SettingsService.getUserSettings();
				$localStorage.settings = SettingsService.getSettings();
				$localStorage.settings.version = "0.0.1";
				$localStorage.userSettings.version = "0.0.1";
				$rootScope.version = "0.0.1";		
				$rootScope.name = "Mattemongot";
			}
		});
	})

	.config(function ($stateProvider, $urlRouterProvider, $translateProvider, tmhDynamicLocaleProvider, defaultLanguage, availableLanguages) {

		// Localization
		tmhDynamicLocaleProvider.localeLocationPattern('js/locales/angular-locale_{{locale}}.js');
		$translateProvider.useStaticFilesLoader({
			'prefix': 'js/i18n/',
			'suffix': '.json'
		});
		$translateProvider
			.registerAvailableLanguageKeys(availableLanguages)
			.preferredLanguage(defaultLanguage)
			.fallbackLanguage('en-us')
			.useSanitizeValueStrategy('escapeParameters');


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

		// Android lang codes:
		//http://stackoverflow.com/questions/7973023/what-is-the-list-of-supported-languages-locales-on-android
		
		// Språk en-us
//		 Level
//		 Settings
//		 Play
//		 Version
//		 Timed?
//		 Reset
//		 Cancel
//		 Ok
//		 Confirm reset
//		 Are  you sure you want to start over?
//		 First table
//		 Second table
//		 Third table
//		 Fourth table
//		 Fifth table
//		 Sixth table
//		 Seventh table
//		 Eighth table
//		 Ninth table
//		 Tenth table
//		 Eleventh table
//		 Twelfth table
//		 Thirteenth table
//		 Fourteenth table
//		 Fifteenth table
//		 Sixteenth table
//		 Seventeenth table
//		 Eighteenth table
//		 Nineteenth table
//		 Twentieth table


	});
