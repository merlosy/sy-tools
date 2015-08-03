
'use strict';

angular.module('sy-tools', [
    'sy-tools.birthdate',
    'sy-tools.browser',
    'sy-tools.feedback',
    //'sy-tools.footer',
    'sy-tools.validation',
    //'sy-tools.password-strength'
]);


angular.module('sy-tools.birthdate', [])

.constant('BIRTHDATE', {
    lang: {
        placeholder_day: "DD",
        placeholder_month: "MM",
        placeholder_year: "YYYY",
        title_day: "Day of birth",
        title_month: "Month of birth",
        title_year: "Year of birth"
    },
    separator: '/'
})

.directive('birthdate', ['$log', '$timeout', 'BIRTHDATE', function($log, $timeout, BIRTHDATE) {
	
	var isEmpty = function(val) {
        return angular.isUndefined(val) || val===null || val==="";
    };
	
    return {
        restrict: 'E',
        require: 'ngModel',
        replace: true,
        transclude: true,
        templateUrl : "app/utils/birthdate.template.html",
		scope : {
			dateValue : '=ngModel'
		},
        link: function(scope, element, attrs, ctrl) {
        	scope.init = true;
            scope.lang = BIRTHDATE.lang;
        	
        	scope.setDateFromFields = function (){
        		scope.init = false;
        		scope.day =  angular.isDefined(scope.day)? scope.day.replace(/[^0-9]/g, '') : "";
        		scope.month =  angular.isDefined(scope.month)? scope.month.replace(/[^0-9]/g, '') : "";
        		scope.year =  angular.isDefined(scope.year)? scope.year.replace(/[^0-9]/g, '') : "";
        		
				scope.dateValue = scope.day +BIRTHDATE.separator+ scope.month +BIRTHDATE.separator+ scope.year;
        	};
        	
        	var setDateFromPage = function (date){
        		if (date) {
            		var comp = date.split(BIRTHDATE.separator);
    				scope.day = comp[0];
    				scope.month = comp[1];
    				scope.year = comp[2];
        		}
        		else {
        			scope.day = "";
                	scope.month = "";
                	scope.year = "";
        		}
        	};
        	setDateFromPage(scope.dateValue);
        	
            scope.$watch('day', function(newValue, oldValue){
            	if ( !isEmpty(newValue) || newValue!==oldValue ) {
            		var inputs = element.find('input');
                    if ( !isEmpty(newValue) && newValue.length === 2 && !scope.init) {
                        inputs[1].focus();
                    	inputs[1].select();
                    }
            	}
            });
            scope.$watch('month', function(newValue, oldValue){
            	if (newValue || newValue!==oldValue) {
                	var inputs = element.find('input');
                    if (!isEmpty(newValue) && newValue.length === 2 && !scope.init) {
                    	inputs[2].focus();
                    	inputs[2].select();
                    }
            	}
            });
            
            scope.$watch('dateValue', function(newValue, oldValue){
                if (newValue && newValue !== oldValue) {
                	setDateFromPage(newValue);
                }
            });
           
        }
    };
}]);

angular.module("sy-tools.browser",[])
.constant("DEVICES", {
	ANDROID: "android",
	IPAD: "ipad",
	IPHONE: "iphone",
	IPOD: "ipod",
	BLACKBERRY: "blackberry",
	FIREFOXOS: "firefoxos",
	WINDOWSPHONE: "windows-phone",
	PS4: "ps4",
	VITA: "vita",
	UNKNOWN: "unknown"
})
.constant("OS", {
	WINDOWS: "windows",
	MAC: "mac",
	IOS: "ios",
	ANDROID: "android",
	LINUX: "linux",
	UNIX: "unix",
	FIREFOXOS: "firefoxos",
	WINDOWSPHONE: "windows-phone",
	PS4: "ps4",
	VITA: "vita",
	UNKNOWN: "unknown"
})
.constant("BROWSERS", {
	CHROME: {
		name: "chrome",
		pattern: "Chrome",
		min_version: 36
	},
	FIREFOX: {
		name: "firefox",
		pattern: "Firefox",
		min_version: 30
	},
	SAFARI: {
		name: "safari",
		pattern: "Safari",
		min_version: 536	// equivalent to Safari 6, 537 for Safari 7
	},
	OPERA: {
		name: "opera",
		pattern: "Opera"
	},
	IE: {
		name: "IE",
		pattern: "MSIE",
		min_version: 9
	},
	IE11: {
		name: "IE-trident",
		pattern: "Trident",
		min_version: 5
	},
	PS4: {
		name: "ps4",
		pattern: "Mozilla 5.0 (PlayStation 4"
	},
	VITA: {
		name: "vita",
		pattern: "Mozilla 5.0 (PlayStation Vita"
	},
	UNKNOWN: {
		name: "unknown",
		pattern: "unknown"
	}
})
.factory("Device", ["$window", "DEVICES", "BROWSERS", "OS", function ($window, DEVICES, BROWSERS, OS) {
	var ua=$window.navigator.userAgent;

	var Device = function(){
		this.userAgent = ua;
		this.raw = {
			os: {},
			browser: {},
			device: {}
		};
		this.browser = { 
			name: null,
			version:null
		};
	
		this.raw.os[OS.WINDOWS]=/\bWindows\b/.test(ua) && !/\bWindows Phone\b/.test(ua);
		this.raw.os[OS.MAC]=/\bMac OS\b/.test(ua);
		this.raw.os[OS.IOS]=/\biPad\b/.test(ua) || /\biPhone\b/.test(ua) || /\biPod\b/.test(ua);
		this.raw.os[OS.ANDROID]=/\bAndroid\b/.test(ua);
		this.raw.os[OS.LINUX]=/\bLinux\b/.test(ua);
		this.raw.os[OS.UNIX]=/\bUNIX\b/.test(ua);
		this.raw.os[OS.FIREFOXOS]=/\bFirefox\b/.test(ua) && /\Mobile\b/.test(ua);
		this.raw.os[OS.WINDOWSPHONE]=/\bIEMobile\b/.test(ua);
		this.raw.os[OS.PS4]=/\bMozilla\/5.0 \(PlayStation 4\b/.test(ua);
		this.raw.os[OS.VITA]=/\bMozilla\/5.0 \(Play(S|s)tation Vita\b/.test(ua);
	
		this.raw.browser[BROWSERS.CHROME.name]=/\bChrome\b/.test(ua) || /\bCriOS\b/.test(ua);
		this.raw.browser[BROWSERS.FIREFOX.name]=/\Firefox\b/.test(ua);
		this.raw.browser[BROWSERS.SAFARI.name]=/^((?!CriOS).)*\Safari\b.*$/.test(ua) && !/\bChrome\b/.test(ua);
		this.raw.browser[BROWSERS.OPERA.name]=/\Opera\b/.test(ua);
		this.raw.browser[BROWSERS.IE.name]=/\bMSIE\b/.test(ua) || /\Trident\b/.test(ua);
		this.raw.browser[BROWSERS.PS4.name]=/\bMozilla\/5.0 \(PlayStation 4\b/.test(ua);
		this.raw.browser[BROWSERS.VITA.name]=/\bMozilla\/5.0 \(Play(S|s)tation Vita\b/.test(ua);

		this.raw.device[DEVICES.ANDROID]=/\bAndroid\b/.test(ua);
		this.raw.device[DEVICES.IPAD]=/\biPad\b/.test(ua);
		this.raw.device[DEVICES.IPHONE]=/\biPhone\b/.test(ua);
		this.raw.device[DEVICES.IPOD]=/\biPod\b/.test(ua);
		this.raw.device[DEVICES.BLACKBERRY]=/\bblackberry\b/.test(ua);
		this.raw.device[DEVICES.FIREFOXOS]=/\bFirefox\b/.test(ua) && /\Mobile\b/.test(ua);
		this.raw.device[DEVICES.WINDOWSPHONE]=/\bIEMobile\b/.test(ua);
		this.raw.device[DEVICES.PS4]=/\bMozilla\/5.0 \(PlayStation 4\b/.test(ua);
		this.raw.device[DEVICES.VITA]=/\bMozilla\/5.0 \(Play(S|s)tation Vita\b/.test(ua);

		// reduce to single OS
		var tmp_os = new Array(),
			tmp_raw_os = this.raw.os;
		for(var i in OS) {
			tmp_os.push( OS[i] );
		}
		this.os = tmp_os.reduce(function(previousValue, currentValue) {
        	 return (previousValue===OS.UNKNOWN && tmp_raw_os[currentValue])? currentValue : previousValue;
        },OS.UNKNOWN);
		
		// reduce to single browser
		var tmp_browser = new Array(),
			tmp_raw_browser = this.raw.browser;
		for(var i in BROWSERS) {
			tmp_browser.push( BROWSERS[i].name );
		}
		this.browser.name = tmp_browser.reduce(function(previousValue, currentValue) {
	    	  return (previousValue===BROWSERS.UNKNOWN.name && tmp_raw_browser[currentValue])? currentValue : previousValue;
	     },BROWSERS.UNKNOWN.name);
		
		// reduce to single device
		var tmp_devices = new Array(),
			tmp_raw_device = this.raw.device;
		for(var i in DEVICES) {
			tmp_devices.push( DEVICES[i] );
		}
		this.device = tmp_devices.reduce(function(previousValue, currentValue) {
        	 return (previousValue===DEVICES.UNKNOWN && tmp_raw_device[currentValue])? currentValue : previousValue;
        },DEVICES.UNKNOWN);
		
		// find version of deducted browser
		var browser = BROWSERS.UNKNOWN;
		for(var i in BROWSERS) {
			if (BROWSERS[i].name === this.browser.name)
				browser = BROWSERS[i];
		}
		var versionArray = ua.substr( ua.indexOf(browser.pattern) + browser.pattern.length ).match(/\d+(\.\d+)?/);
		this.browser.version = versionArray.length>0? versionArray[0] : "";
		
		// is it supported
		if ( angular.isDefined(browser.min_version) )
			this.isSupported = (browser.min_version <= parseFloat(this.browser.version) );
		else
			this.isSupported = false;

	};

	Device.prototype.isMobile = function () {
		return this.device !== DEVICES.UNKNOWN;
	};

	Device.prototype.isAndroid = function(){
		return (this.device === DEVICES.ANDROID || this.OS === OS.ANDROID);
	};

	Device.prototype.isIOS = function(){
		return (this.os === OS.IOS || this.device === DEVICES.IPOD || this.device === DEVICES.IPHONE);
	};

	return Device;
}])
.directive('deviceDetector', ["Device", "$log", "$window", "$sce", "$rootScope", function (Device, $log, $window, $sce, $rootScope) {
	return {
		restrict: "E",
		replace : true,
		template: '<div ng-show="!device.isSupported" class="alert alert-warning" role="alert" ng-bind-html="texte"></div>',
		link: function (scope, element, attrs) {
			
			scope.device = new Device();

	    	$log.debug(scope.device);
	    	
	    	scope.content = JSON.stringify(scope.device);
	    	scope.texte = $sce.trustAsHtml("The browser is not supported by this application.");
	    		    	
			element.addClass('os-'+scope.device.os);
			element.addClass('browser-'+scope.device.browser.name);
			element.addClass('device-'+scope.device.device);
		}
	};
}]);


angular.module('sy-tools.feedback', [])
    
.constant('FEEDBACK', {
	unavailable: "The server is currently unavailable. Please, try again later.",
	failure: "An error has occured. Please, contact support or try again later.",
    level : {
        'default' : "default",
        success : 'success',
        info : 'info',
        warning : 'warning',
        danger : 'danger'
    }
})

.constant('HTTP_CODE', {
	pattern_4XX: /^4[0-9]{2}$/
})

.directive('syFeedback', ['$log', 'Feedback', function($log, Feedback) {
    return {
        restrict: 'E',
        replace: true,
        template : '<div class="alert alert-{{alert.level}} alert-dismissible" role="alert" ng-repeat="alert in feedback.alerts">'
	           +' 	<button ng-show="alert.closable" type="button" class="close" title="{{lang.actions.fermer.titre}}" data-dismiss="alert" ng-click="closeAlert($index)"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'
	           +' 		{{alert.message}}'
	           +' 		<ul ng-show="alert.array">'
	           +'  			<li ng-repeat="message in alert.array track by $index" ng-show="message.length>0">{{message}}</li>'
	           +' 		</ul>'
	           +' 	</div>',
		scope : {
			feedback : '=model'
		},
        link: function(scope, element, attrs, ctrl) {

			scope.closeAlert = function(index) {
	    	    scope.feedback.alerts.splice(index, 1);
	    	};
        }
    };
}])

.factory('Feedback', [ '$rootScope', '$timeout', '$log', 'HTTP_CODE', 'FEEDBACK',
                            function ($rootScope, $timeout, $log, HTTP_CODE, FEEDBACK) {
	var isEmpty = function(val) {
        return angular.isUndefined(val) || val===null || val==="";
    };

	var arraysEqual =  function(a1,a2) {
	    return JSON.stringify(a1)===JSON.stringify(a2);
	};
	
	var formatMessage = function(messages, level, closable) {
		var data = {
            level: level || FEEDBACK.level.default,
            closable : angular.isDefined(closable)? closable : true
        };
		
		if ( !angular.isArray(messages) ) {
			data.message = isEmpty(messages)? FEEDBACK.failure : messages;
		}
		else {
      	  	switch (messages.length) {
      	  		case 0:
      	  			data.message = FEEDBACK.failure;
      	  			break;
      	  		case 1:
      	  			data.message = messages[0];
      	  			break;
      	  		default:
      	  			data.array = messages;
      	  			break;
      	  	}
		}
  	  	return data;
	};
	    	
	var hasDuplicates = function(alerts, contenu) {
		var duplicated = false;
		
		for (var i in alerts){
			if ( (angular.isDefined(contenu.message) 
                    && alerts[i].message===contenu.message
                    && alerts[i].level===contenu.level) 
  				  || (angular.isArray(contenu.array) 
                        && arraysEqual(alerts[i].array, contenu.array) 
                        && alerts[i].level===contenu.level)	 
  				){
  			  	$log.debug('Message duplicated');
  			  	duplicated = true;
  		  	}
  	  	}
		return duplicated;
	};

    var Feedback = function() {
        this.alerts = new Array();
    }
    
    Feedback.prototype.local = function (content, level, closable) {
        var toAdd = formatMessage(content, level, closable);
        if ( hasDuplicates(this.alerts, toAdd) ) return;
        this.alerts.push( toAdd );
    };

    Feedback.prototype.validation = function (content) {
        this.local(content, FEEDBACK.level.danger);
    };

    Feedback.prototype.error = function (validation, error) {
        $log.debug(error);
        var arrayMessages = new Array();

        switch(error.status) {
        	case 412:
        		if ( angular.isDefined(error.data) && angular.isArray(error.data) ){
        			for( var i=0; i<error.data.length; i++){
        			  	arrayMessages.push( error.data[i].message );
        			  
        			  	if ( angular.isDefined(error.data[i].nomParametres) && angular.isArray(error.data[i].nomParametres) ){
        				  	for( var j=0; j<error.data[i].nomParametres.length; j++) {
                			  	var champ = error.data[i].nomParametres[j];
                			  	validation[champ] = {passes :false};
        				  	}
        			  	}
        		  	}
        		}
        		break;
        	case HTTP_CODE.pattern_4XX.test( error.status ):
        	  	arrayMessages = FEEDBACK.failure;
          		break;
        	case 503:
        		arrayMessages = FEEDBACK.unavailable;
        		break;
        	default:
        		break;
        }

        var toAdd = formatMessage(arrayMessages, FEEDBACK.level.danger);
        if ( hasDuplicates(this.alerts, toAdd) ) return;
        this.alerts.push( toAdd );
    };
      
  return Feedback;

}]);


angular.module('sy-tools.footer', [])
    
.directive('footer', ['$log', '$window', '$timeout', function($log, $window, $timeout) {
    return {
        restrict: 'E',
        link: function(scope, element, attrs, ctrl) {
        	
        	function applyHeight() {
        		var height = element[0].offsetHeight;
            	
            	element.css("margin-top", "-"+height+"px");
            	angular.element("#page-wrapper > div:first-child").css("padding-bottom", height+"px");
            }

            angular.element($window).bind('resize', function() {
                $timeout(function() {
                    applyHeight();
                });
            });

            applyHeight();
	    	
        }
    };
}]);
    
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
			template: '<progressbar value="value" type="{{type}}" title="Password strength">{{niveau}}</progressbar>'
						+'<div>{{message}}</div>',
			restrict: 'E',
			replace: false,
			scope: {
				pwd: '=syPassword',
				value: '=syStrength'
			},
			link: function(scope /*, elem, attrs*/ ) {
				
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

						var repeatedChars = new Array();
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

(function () {
    'use strict';

    var validationModule = angular.module('sy-tools.validation', []);

    var INTEGER_REGEXP = /^\-?\d+$/;
    var FLOAT_REGEXP = /^\-?\d+((\.|\,)\d+)?$/;
    var FLOAT_REGEXP_FR = /^\-?\d+(\,\d+)?$/;
    var FLOAT_REGEXP_ENG = /^\-?\d+(\.\d+)?$/;
    var EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    var POST_CODE = /^[0-9]{5}$/;
    var NIR = /^[0-9]{6}([aAbB]|[0-9])[0-9]{6}$/;
    var ALPHA_NUMERIC = /^[0-9A-Za-z]*$/;
    var ALPHA_CHARS = /^[A-Za-zÀÂÄÇÉÈÊËÎÏÔÖÙÛÜŸàâäçéèêëîïôöùûüÿÆŒæœ\-\' ]*$/;
    var ALPHA_DASH_SPACE = /^[A-Za-z \-]*$/;
    var ALPHA = /^[A-Za-z]*$/;
    var TEL = /^(\+[1-9]|[0-9]{2})[0-9]{7,13}$/;
    
    
    validationModule.factory('Validation', ['$log', '$filter', function($log, $filter) {

    	var isEmpty = function(val) {
            return angular.isUndefined(val) || val===null || val==="";
        };

    	var check = function(field, rule){
    		var result = false;
    		
    		function isValidDate(d) {
			 	if ( Object.prototype.toString.call(d) !== "[object Date]" )
			    return false;
			  return !isNaN(d.getTime());
			}
    		
    		switch (rule.key) {
    			case "isTrue" :
    				result = (rule.value==true);
    				break;
    			case "integer" :
    				result = isEmpty(field) || INTEGER_REGEXP.test(field);
    				break;
    			case "nir" :
    				result = NIR.test(field);
    				break;
    			case "tel" :
    				result = isEmpty(field) || TEL.test(field);
    				break;
    			case "postcode" :
    				result = POST_CODE.test(field);
    				break;
    			case "alphadashspace" :
    				result = ALPHA_DASH_SPACE.test(field);
    				break;
    			case "alphanumeric" :
    				result = ALPHA_NUMERIC.test(field);
    				break;
    			case "alphachars" :
    				result = ALPHA_CHARS.test(field);
    				break;
    			case "alpha" :
    				result = ALPHA.test(field);
    				break;
    			case "floatfr" :
    				result = FLOAT_REGEXP_FR.test(field);
    				break;
    			case "floateng" :
    				result = FLOAT_REGEXP_ENG.test(field);
    				break;
    			case "array": 
    				result = angular.isArray(field);
    				break;
    			case "inarray": 
    				result = field!==undefined && rule.value.indexOf(field)>-1;
    				break;
    			case "email" :
    				result = EMAIL_REGEXP.test(field);
    				break;
    			case "date": 
    				// teste pour: jj/mm/aaaa
    				var date = new Date();
    				if ( field instanceof Date ) {
    					date = field;
    				}
    				else if ( field!==undefined ) {
	    				var comp = field.split('/');
	    				var d = parseInt(comp[0], 10);
	    				var m = parseInt(comp[1], 10);
	    				var y = parseInt(comp[2], 10);
	    				date = new Date(y,m-1,d);
    				}
    				var date_str = $filter('date')(date, 'dd/MM/yyyy');
    			
    				result = field!==undefined && isValidDate( date ) && (date_str==field);
    				break;
    			case "datebefore": 
    				// teste pour: jj/mm/aaaa
    				var date = new Date();
    				if ( field!==undefined ) {
	    				var comp = field.split('/');
	    				var d = parseInt(comp[0], 10);
	    				var m = parseInt(comp[1], 10);
	    				var y = parseInt(comp[2], 10);
	    				date = new Date(y,m-1,d);
    				}
    				result = date < rule.value;
    				break;
    			case "boolean": 
    				result = (field!==undefined && typeof field=='boolean');
    				break;
    			case "min": 
    				result = ( parseFloat(field)>=rule.value );
    				break;
    			case "max": 
    				result = ( parseFloat(field)<=rule.value );
    				break;
    			case "equal": 
    				result = (field==rule.value);
    				break;
    			case "length": 
    				result = (field!==undefined && String(field).length==rule.value);
    				break;
    			case "minlength": 
    				result = (field!==undefined && String(field).length>=rule.value);
    				break;
    			case "maxlength": 
    				result = (field==undefined || String(field).length<=rule.value);
    				break;
    			case "required": 
    				result = (field!==undefined && field!=="" && field!==null) || (angular.isArray(field) && field.length>0) || ( field instanceof Date ) || (typeof field == 'boolean');
    				break;
    		}
    		$log.debug( "check for "+field+" as "+rule.key+" is "+result);
    		return result;
    	};
    	
    	var allErrors = function (validation) {
    		var messages = new Array();
    		for (var field in validation) {
    			if (validation.hasOwnProperty(field)) {
    			    var val = validation[field];
    			    messages = messages.concat( val.messages );
    			  }
    		}
    		return messages;
    	};

        var Validation = function(){
            this.done = false;
            this.fields = new Array();
        };

        Validation.prototype.add = function( label, field, rules, skip) {
            var result = true;
            var messages = new Array();
            for( var i=0; i<rules.length; i++) {
                var temp = check(field, rules[i]);
                result = result && temp;
                if (!temp) {
                    if ( rules[i].message!==undefined && rules[i].message!=="" )
                        messages.push(rules[i].message);
                    if (skip!==undefined && skip) 
                        break;
                }
            }
            this.fields[label] = { passes : result, messages : messages };
            return this.fields[label];
        };

        Validation.prototype.get = function(label) {
            return this.fields[label];
        };

        Validation.prototype.isValid = function() {
            var valid = true;
            for (var field in this.fields) {
                if (this.fields.hasOwnProperty(field)) {
                    var val = this.fields[field];
                    valid = (valid && val.passes);
                  }
                else valid = false;
            }
            return valid;
        };

        Validation.prototype.errorsAsString = function() {
            return allErrors(this.fields).join(" ");
        };

        Validation.prototype.errorsAsArray = function() {
            return allErrors(this.fields);
        };
    
    	return Validation;
	}]);

   
    
})();
