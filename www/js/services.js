angular.module('mattemongot.services', ['ngStorage'])

// Service for math generator
	.service('MathService', function () {

		this.getQuiz = function (timesTable) {
			
			// Get random 0-10 * level
			var r = Math.round(Math.random() * 10);
			var quiz = r + " * " + timesTable;
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
				
			var correctIndex = _.findIndex(answers, function(a) { return a == r*timesTable;});
			
			return { quizDisplay: quiz, answers: answers, correctIndex: correctIndex};
		};
	})

// Service for settings
	.service('SettingsService', function ($localStorage) {

		this.updateFrom_1_0_0 = function (version) {
			// Nästa gång görs uppdatering här och då följer allt med från tidigare... men man kan också hoppa in på rätt nivå och löser alla fall nedan i switch
		};

		this.checkUpgrade = function (version) {

			// App settings
			$localStorage.userSettings = $localStorage.userSettings || this.getUserSettings();
			$localStorage.settings = $localStorage.settings || this.getSettings();

			// Migration of settings data
			var existingSettingsVersion = $localStorage.settings.version;

			if (version != existingSettingsVersion) {

				switch (existingSettingsVersion) {
					//case "1.0.0":
					//	{
					//		this.upgradeFrom_2_0_0(version);
					//		this.upgradeFrom_2_1_0(version);
					//	}
					//	break;
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
				levels: [
					{ level: 2, stars: 1, stats: [] },
					{ level: 3, stars: 2, stats: [] },
					{ level: 4, stars: 3, stats: [] },
					{ level: 5, stars: 0, stats: [] },
					{ level: 6, stars: 0, stats: [] },
					{ level: 7, stars: 0, stats: [] },
					{ level: 8, stars: 0, stats: [] },
					{ level: 9, stars: 0, stats: [] },
					{ level: 10, stars: 0, stats: [] }
				]
			}
		};

		this.getSettings = function () {
			return {
				levels: [
					{ level: 2, display: '2. Tvåans tabell' },
					{ level: 3, display: '3. Treans tabell' },
					{ level: 4, display: '4. Fyrans tabell' },
					{ level: 5, display: '5. Femmans tabell' },
					{ level: 6, display: '6. Sexans tabell' },
					{ level: 7, display: '7. Sjuans tabell' },
					{ level: 8, display: '8. Åttans tabell' },
					{ level: 9, display: '9. Nians tabell' },
					{ level: 10, display: '10. Tians tabell' }
				],
			};
		}
	})
;