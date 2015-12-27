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
			
			// Nu hantering av översättningar, tabort den gamla display propertyn från alla settings.levels och lägg dit labels
			$localStorage.settings = this.getSettings();
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
						}
						break;
					case "1.2.0":
						{
							//this.upgradeFrom_1_2_0(version);
						}
						break;
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
					{ level: 1, label: "1_table" },
					{ level: 2, label: "2_table" },
					{ level: 3, label: "3_table" },
					{ level: 4, label: "4_table" },
					{ level: 5, label: "5_table" },
					{ level: 6, label: "6_table" },
					{ level: 7, label: "7_table" },
					{ level: 8, label: "8_table" },
					{ level: 9, label: "9_table" },
					{ level: 10, label: "10_table" },
					{ level: 11, label: "11_table" },
					{ level: 12, label: "12_table" },
					{ level: 13, label: "13_table" },
					{ level: 14, label: "14_table" },
					{ level: 15, label: "15_table" },
					{ level: 16, label: "16_table" },
					{ level: 17, label: "17_table" },
					{ level: 18, label: "18_table" },
					{ level: 19, label: "19_table" },
					{ level: 20, label: "20_table" }
				],
			};
		}
	})
;