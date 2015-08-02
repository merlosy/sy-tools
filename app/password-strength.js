(function () {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name ngPasswordStrengthApp.directive:ngPasswordStrength
	 * @description version simplifiée de la jauge ci-dessous, dépendance avec underscore.js enlevée
	 * @see https://raw.githubusercontent.com/subarroca/ng-password-strength/master/app/scripts/directives/ng-password-strength.js
	 * # ngPasswordStrength
	 */
	var passStrengthModule = angular.module('sy-tools.password-strength', [
	     'ui.bootstrap.progressbar',
	     'template/progressbar/progress.html',
	     'template/progressbar/progressbar.html'
	]);

	passStrengthModule.directive('syPasswordStrength', ['$log', '$rootScope', function($log, $rootScope) {
		return {
			template: '<progressbar value="value" type="{{type}}" title="Password strength">{{niveau}}</progressbar><div>{{message}}</div>',
			restrict: 'E',
			//replace: false,
			scope: {
				pwd: '=password',
				value: '=strength'
			},
			link: function(scope ) {
				
				var displayedMessage = "Weak";

				var mesureStrength = function(p) {
					var counts = {
							all : {},
							consec : {}
					},
					matches = {},
					tmp,
					strength = 0,
					i,
					pArray,
					consec,
					previous = null,
					rule = {
						variete : 0,
						consecutif : 0,
						caracteresDifferents : 0
					};

					if (p) {
						pArray = p.split("");

						// variete du mot de passe
						matches.lower = p.match(/[a-z]/g);
						matches.upper = p.match(/[A-Z]/g);
						matches.numbers = p.match(/\d/g);
						matches.symbols = p.match(/[^a-zA-Z0-9_]/g);

						counts.all.lower = matches.lower ? matches.lower.length : 0;
						counts.all.upper = matches.upper ? matches.upper.length : 0;
						counts.all.numbers = matches.numbers ? matches.numbers.length : 0;
						counts.all.symbols = matches.symbols ? matches.symbols.length : 0;

						angular.forEach(counts.all, function(value, key) {
							if (value>0)
								this.variete ++;
						}, rule);
//						$log.debug(rule.variete+' correspondance parmi (au moins 1 MAJ, au moins 1 MIN, au moins 1 symbole, au moins 1 nombre)');

						// compte nombre caracteres consecutifs
						for ( i=0 ; i<pArray.length ; i++) {
							consec = (previous == pArray[i])? consec+1 : 1;
							previous = pArray[i];
							rule.consecutif = Math.max(consec, rule.consecutif);
						}
//						$log.debug(rule.consecutif+' caractères consécutifs trouvés');

						var repeatedChars = [];
						var repeatedMax = 0;
						for ( i=0 ; i<pArray.length ; i++) {
							if (angular.isUndefined( repeatedChars [ pArray[i] ] ))
								repeatedChars [ pArray[i] ] = 0;
							// nombre d'occurence de chaque caractère
							repeatedChars [ pArray[i] ] ++;

							repeatedMax = Math.max(repeatedChars [ pArray[i] ], repeatedMax);
						}
						rule.caracteresDifferents = Object.keys(repeatedChars).length;
						//             	$log.debug(repeatedMax+' occurences du caractère le plus présent');
//						$log.debug(rule.caracteresDifferents+' caractères différents');


					}


					return Math.max(0, Math.min(100, Math.round(strength)));;
				},


				getType = function(s) {
					switch (Math.round(s / 33)) {
					case 0:
					case 1:
						return 'danger';
					case 2:
						return 'warning';
					case 3:
						return 'success';
					}
				},

				getMessage = function(s, message) {
					return s==0? $rootScope.lang.jauge.message.taille_nulle : message;
				},

				getLevel = function(s) {
					switch (Math.round(s / 33)) {
					case 0: return $rootScope.lang.jauge.niveau.faible;
					case 1:
						return $rootScope.lang.jauge.niveau.faible;
					case 2:
						return $rootScope.lang.jauge.niveau.moyen;
					case 3:
						return $rootScope.lang.jauge.niveau.fort;
					}
				};

				scope.$watch('pwd', function(newValue, oldValue) {
					if (newValue !== oldValue) {
						scope.value = mesureStrength(scope.pwd);
						scope.type = getType(scope.value);
						scope.level = getLevel(scope.value);
						scope.message = getMessage(scope.value, displayedMessage);
					}
				});

			}
		};
	}]);

})();
