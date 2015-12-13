angular.module('mattemongot.services', ['ngStorage'])

// Service for math generator
	.service('MathService', function () {

		this.getQuiz = function (timesTable) {
			
			// Get random 0-10 * level
			var r = Math.round(Math.random() * 10);

			// x * y || y * x
			var quiz = (Math.random() < 0.5) ? r + " * " + timesTable : timesTable + " * " + r;

			console.log("New quiz: " + quiz);

			var answers = [r * timesTable];
			while (answers.length <= 2) {

				var g = Math.round(Math.random() * 10) * timesTable;

				if (false == _.contains(answers, g)) {
					answers.push(g);
				}
			};

			console.log("Answers: " + answers[0] + ", " + answers[1] + ", " + answers[2]);

			answers = _.shuffle(answers);
			console.log("Answers shuffled: " + answers[0] + ", " + answers[1] + ", " + answers[2]);

			var correctIndex = _.findIndex(answers, function (a) { return a == r * timesTable; });

			return { quizDisplay: quiz, answers: answers, correctIndex: correctIndex };
		};
	})

// Service for settings
	.service('SettingsService', function ($localStorage) {

		this.upgradeFrom_1_0_0 = function (version) {
			
			// 1.0.0 => 1.1.0 Add timed setting to userSettings, default to "true"		
			$localStorage.userSettings.timed = true;
		};

		this.upgradeFrom_1_1_0 = function (version) {
			
			// Nästa gång görs uppdatering här och då följer allt med från tidigare... men man kan också hoppa in på rätt nivå och löser alla fall nedan i switch
			
			// OBS OBS Gör en ny upgrade from vid uppgradering
		};
		
		

		this.checkUpgrade = function (version) {

			// App settings
			$localStorage.userSettings = $localStorage.userSettings || this.getUserSettings();
			$localStorage.settings = $localStorage.settings || this.getSettings();

			// Migration of settings data
			var existingSettingsVersion = $localStorage.settings.version;

			if (version != existingSettingsVersion) {

				switch (existingSettingsVersion) {
					case "1.0.0":
						{
							this.upgradeFrom_1_0_0(version);
							this.upgradeFrom_1_1_0(version);
							// Bygg på här nästa gång
						}
						break;
					case "1.1.0":
						{
							this.upgradeFrom_1_1_0(version);
							// Bygg på här nästa gång
							// OBS OBS Gör en ny upgrade from vid uppgradering
						}
						break;
					// case "X.X.X"
					default:
						{
							// Ingen vettig information, restora allt
							$localStorage.userSettings = this.getUserSettings();
							$localStorage.settings = this.getSettings();
						}
				}

				// Skriv rätt information nu när version uppdaterats
				$localStorage.settings.version = version;
				$localStorage.userSettings.version = version;
			}
		};

		this.getUserSettings = function () {
			return {
				sound: true,
				timed: true,
				levels: [
					{ level: 1, stars: 0, stats: [] },
					{ level: 2, stars: 0, stats: [] },
					{ level: 3, stars: 0, stats: [] },
					{ level: 4, stars: 0, stats: [] },
					{ level: 5, stars: 0, stats: [] },
					{ level: 6, stars: 0, stats: [] },
					{ level: 7, stars: 0, stats: [] },
					{ level: 8, stars: 0, stats: [] },
					{ level: 9, stars: 0, stats: [] },
					{ level: 10, stars: 0, stats: [] },
					{ level: 11, stars: 0, stats: [] },
					{ level: 12, stars: 0, stats: [] },
					{ level: 13, stars: 0, stats: [] },
					{ level: 14, stars: 0, stats: [] },
					{ level: 15, stars: 0, stats: [] },
					{ level: 16, stars: 0, stats: [] },
					{ level: 17, stars: 0, stats: [] },
					{ level: 18, stars: 0, stats: [] },
					{ level: 19, stars: 0, stats: [] },
					{ level: 20, stars: 0, stats: [] }
				]
			}
		};

		this.getSettings = function () {
			return {
				levels: [
					{ level: 1, display: 'Ettans tabell' },
					{ level: 2, display: 'Tvåans tabell' },
					{ level: 3, display: 'Treans tabell' },
					{ level: 4, display: 'Fyrans tabell' },
					{ level: 5, display: 'Femmans tabell' },
					{ level: 6, display: 'Sexans tabell' },
					{ level: 7, display: 'Sjuans tabell' },
					{ level: 8, display: 'Åttans tabell' },
					{ level: 9, display: 'Nians tabell' },
					{ level: 10, display: 'Tians tabell' },
					{ level: 11, display: 'Elvans tabell' },
					{ level: 12, display: 'Tolvans tabell' },
					{ level: 13, display: 'Trettons tabell' },
					{ level: 14, display: 'Fjortons tabell' },
					{ level: 15, display: 'Femtons tabell' },
					{ level: 16, display: 'Sextons tabell' },
					{ level: 17, display: 'Sjuttons tabell' },
					{ level: 18, display: 'Artons tabell' },
					{ level: 19, display: 'Nittons tabell' },
					{ level: 20, display: 'Tjugos tabell' }
				],
			};
		}
	})
;