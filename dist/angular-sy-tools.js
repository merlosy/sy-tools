
'use strict';

angular.module('sy-tools', [
    'sy-tools.birthdate',
    'sy-tools.browser',
    'sy-tools.feedback',
    //'sy-tools.footer',
    'sy-tools.validation',
    'sy-tools.railway'
]);

'use strict';

angular.module('sy-tools.birthdate', [])

.run(["$templateCache", function($templateCache) {
    $templateCache.put('sy-tools/template/birthdate.html', 
        ['<div class="row" ng-cloak>',
            '<div class="col-sm-4 col-xs-4" style="width:30%">',
                '<input type="text" name="day" class="form-control" ng-model="day" maxlength=2 ',
                    'id="birthdate-jour" ng-change="setDateFromFields()" ',
                    'title="{{lang.title_day}}" placeholder="{{lang.placeholder_day}}" />',
           '</div>',
            '<div class="col-sm-4 col-xs-4" style="width:30%">',
                '<input type="text" name="month" class="form-control" ng-model="month" maxlength=2',
                    'id="birthdate-mois" ng-change="setDateFromFields()" ',
                    'title="{{lang.title_month}}" placeholder="{{lang.placeholder_month}}" />',
            '</div>',
            '<div class="col-sm-4 col-xs-4" style="width:40%">',
                '<div class="form-group has-feedback" style="margin-bottom:0">',
                    '<input type="text" name="year" class="form-control" ng-model="year" maxlength=4 ',
                        'id="birthdate-annee" ng-change="setDateFromFields()" ',
                        'title="{{lang.title_year}}" placeholder="{{lang.placeholder_year}}" />',
                    '<span class="glyphicon form-control-feedback glyphicon-asterisk"></span>',
                '</div>',
            '</div>',
        '</div>'
        ].join('')
    );
}])

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
        templateUrl : "sy-tools/template/birthdate.html",
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

'use strict';
/**
 * based on 
 * https://github.com/srfrnk/ng-device-detector/blob/master/ng-device-detector.js
 */

angular.module('sy-tools.browser',[])
.constant('DEVICES', {
	ANDROID: 'android',
	IPAD: 'ipad',
	IPHONE: 'iphone',
	IPOD: 'ipod',
	BLACKBERRY: 'blackberry',
	FIREFOXOS: 'firefoxos',
	WINDOWSPHONE: 'windows-phone',
	PS4: 'ps4',
	VITA: 'vita',
	UNKNOWN: 'unknown'
})
.constant('OS', {
	WINDOWS: 'windows',
	MAC: 'mac',
	IOS: 'ios',
	ANDROID: 'android',
	LINUX: 'linux',
	UNIX: 'unix',
	FIREFOXOS: 'firefoxos',
	WINDOWSPHONE: 'windows-phone',
	PS4: 'ps4',
	VITA: 'vita',
	UNKNOWN: 'unknown'
})
.constant('BROWSERS', {
	CHROME: {
		name: 'chrome',
		pattern: 'Chrome',
		minVersion: 36
	},
	FIREFOX: {
		name: 'firefox',
		pattern: 'Firefox',
		minVersion: 30
	},
	SAFARI: {
		name: 'safari',
		pattern: 'Safari',
		minVersion: 536	// equivalent to Safari 6, 537 for Safari 7
	},
	OPERA: {
		name: 'opera',
		pattern: 'Opera'
	},
	IE: {
		name: 'IE',
		pattern: 'MSIE',
		minVersion: 9
	},
	IE11: {
		name: 'IE-trident',
		pattern: 'Trident',
		minVersion: 5
	},
	PS4: {
		name: 'ps4',
		pattern: 'Mozilla 5.0 (PlayStation 4'
	},
	VITA: {
		name: 'vita',
		pattern: 'Mozilla 5.0 (PlayStation Vita'
	},
	UNKNOWN: {
		name: 'unknown',
		pattern: 'unknown'
	}
})
.factory('Device', ['$window', 'DEVICES', 'BROWSERS', 'OS', function ($window, DEVICES, BROWSERS, OS) {
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

		var i;
		// reduce to single OS
		var tmpOs = [],
			tmpRawOs = this.raw.os;
		for(i in OS) {
			tmpOs.push( OS[i] );
		}
		this.os = tmpOs.reduce(function(previousValue, currentValue) {
        	 return (previousValue===OS.UNKNOWN && tmpRawOs[currentValue])? currentValue : previousValue;
        },OS.UNKNOWN);
		
		// reduce to single browser
		var tmpBrowser = [],
			tmpRawBrowser = this.raw.browser;
		for(i in BROWSERS) {
			tmpBrowser.push( BROWSERS[i].name );
		}
		this.browser.name = tmpBrowser.reduce(function(previousValue, currentValue) {
	    	  return (previousValue===BROWSERS.UNKNOWN.name && tmpRawBrowser[currentValue])? currentValue : previousValue;
	     },BROWSERS.UNKNOWN.name);
		
		// reduce to single device
		var tmpDevices = [],
			tmpRawDevice = this.raw.device;
		for(i in DEVICES) {
			tmpDevices.push( DEVICES[i] );
		}
		this.device = tmpDevices.reduce(function(previousValue, currentValue) {
        	 return (previousValue===DEVICES.UNKNOWN && tmpRawDevice[currentValue])? currentValue : previousValue;
        },DEVICES.UNKNOWN);
		
		// find version of deducted browser
		var browser = BROWSERS.UNKNOWN;
		for(i in BROWSERS) {
			if (BROWSERS[i].name === this.browser.name){
				browser = BROWSERS[i];
			}
		}
		var versionArray = ua.substr( ua.indexOf(browser.pattern) + browser.pattern.length ).match(/\d+(\.\d+)?/);
		this.browser.version = versionArray.length>0? versionArray[0] : '';
		
		// is it supported
		this.isSupported = angular.isDefined(browser.minVersion)?
				(browser.minVersion <= parseFloat(this.browser.version) )
				: false;

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
.directive('deviceDetector', ['Device', '$log', '$window', '$sce', function (Device, $log, $window, $sce) {
	return {
		restrict: 'E',
		replace : true,
		template: '<div ng-show="!device.isSupported" class="alert alert-warning" role="alert" ng-bind-html="texte"></div>',
		link: function (scope, element) {
			
			scope.device = new Device();

	    	$log.debug(scope.device);
	    	
	    	scope.content = JSON.stringify(scope.device);
	    	scope.texte = $sce.trustAsHtml('The browser is not supported by this application.');
	    		    	
			element.addClass('os-'+scope.device.os);
			element.addClass('browser-'+scope.device.browser.name);
			element.addClass('device-'+scope.device.device);
		}
	};
}]);

'use strict';

angular.module('sy-tools.feedback', [])
    
.constant('FEEDBACK', {
	unavailable: 'The server is currently unavailable. Please, try again later.',
	failure: 'An error has occured. Please, contact support or try again later.',
    level : {
        'default' : 'default',
        success : 'success',
        info : 'info',
        warning : 'warning',
        danger : 'danger'
    }
})

.constant('HTTP_CODE', {
	pattern4XX: /^4[0-9]{2}$/
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
	
	var formatMessage = function(messages, level, options) {
		var data = {
            level: level || FEEDBACK.level.default,
            closable : angular.isObject(options) && angular.isDefined(options.closable)? options.closable : true,
            message : angular.isObject(options) && angular.isDefined(options.message)? options.message : FEEDBACK.failure
        };
		
		if ( !angular.isArray(messages) ) {
			data.message = isEmpty(messages)? data.message : messages;
		}
		else {
      	  	switch (messages.length) {
      	  		case 0:
      	  			data.message = data.message;
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
    
    Feedback.prototype.local = function (content, level, options) {
        var toAdd = formatMessage(content, level, options);
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
        	case HTTP_CODE.pattern4XX.test( error.status ):
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

'use strict';

angular.module('sy-tools.footer', [])
    
.directive('footer', ['$log', '$window', '$timeout', function($log, $window, $timeout) {
    return {
        restrict: 'E',
        link: function(scope, element) {
        	
        	var applyHeight = function() {
        		var height = element[0].offsetHeight;
            	element.css('margin-top', '-'+height+'px');
            	angular.element('#page-wrapper > div:first-child').css('padding-bottom', height+'px');
            };

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
    
    angular.module('sy-tools.railway', []);

    angular.module('sy-tools.railway').constant('RAILWAY', {
    	trimSteps: true,
    	showLabels: true,
        showTracks: true,
    	showButtons: true
    });

    /**
     * @name RailwayDirective
     * @desc <railway> directive
     */
    function RailwayDirective( $timeout, Railway, RAILWAY ) {

        /**
         * @name RailwayController
         * @desc Linker for railway directive
         * @type {Function}
         */
        function RailwayController() {
            this.goNext = function(){
                this.next();
                this.railway.next();
            };
            this.goBack = function(){
                this.previous();
                this.railway.previous();
            };
        }

        /**
         * @name RailwayLink
         * @desc Linker for railway directive
         * @type {Function}
         */
        function RailwayLink(scope, element) {
            var ctrl = scope.ctrl;

            var options = {
                trimSteps : ctrl.railwayTrimSteps? ctrl.railwayTrimSteps==='true' : RAILWAY.trimSteps,
                showLabels : ctrl.railwayShowLabels? ctrl.railwayShowLabels==='true' : RAILWAY.showLabels,
                showButtons : ctrl.railwayShowButtons? ctrl.railwayShowButtons==='true' : RAILWAY.showButtons,
                showTracks : ctrl.railwayShowTracks? ctrl.railwayShowTracks==='true' : RAILWAY.showTracks
            };
            ctrl.railway = new Railway(element, options);

            ctrl.labels = [];

            $timeout(function(){

               if (ctrl.railway.options.showTracks) {

                    var nb = ctrl.railway.children.length;
                    var steps = ctrl.railway.children;
                    var largPercent = 100;
                    
                    for (var i=0; i<steps.length; i++) {
                        ctrl.labels.push($(steps[i]).attr('name'));
                    }
                    
                    if (nb>1) {
                        var mainBlocs = element.find('.railway-track').children();
                                                
                        if (ctrl.railway.options.trimSteps) {
                            largPercent = 100/(nb-1);
                            mainBlocs.css('width', largPercent+'%').addClass('fitted');
                            angular.element(mainBlocs[0]).css('width', largPercent/2+'%');
                            angular.element(mainBlocs[mainBlocs.length-1]).css('width', largPercent/2+'%');
                        }
                        else {
                            largPercent = 100/nb;
                            mainBlocs.css('width', largPercent+'%');
                        }
                        
                    }
                    else {
                        angular.element('.railway-track > div').css('width', largPercent+'%');
                    }
                }
            });

        }

        return {
            restrict: 'E',
            replace: false,
            transclude: true,
            require: '?ngModel',
            template: ['<div class="railway-row-track" >',
                '<div class="railway-row-col">',
                    '<div class="railway-track" ng-if="ctrl.railway.options.showTracks"><div ng-repeat="child in ctrl.railway.children track by $index" ng-class="{\'active\':ctrl.railway.current>=$index}">',
                        '<div></div><div title={{ctrl.labels[$index]}}>{{$index+1}}</div><div></div>',
                        '<span ng-show="ctrl.railway.options.showLabels" ng-bind="ctrl.labels[$index]"></span>',
                    '</div></div>',
                '</div> </div>',
                '<div class="railway" ng-transclude></div>',
                '<div class="text-center railway-btn-group" ng-show="ctrl.railway.children.length>0 && ctrl.railway.options.showButtons">',
                    '<button class="btn btn-primary btn-railway" ng-disabled="!ctrl.railway.hasPrevious()" ng-click="ctrl.goBack()" >Previous</button>',
                    '<button class="btn btn-primary btn-railway" ng-disabled="!ctrl.railway.hasNext()" ng-click="ctrl.goNext()" >Next</button>',
                    '<button class="btn btn-success btn-railway" ng-show="ctrl.railway.isLast()" ng-click="ctrl.complete()" >Finish</button>',
                '</div>'
                ].join(''),
            controllerAs: 'ctrl',
            bindToController: true,
            scope: {
                railway :'=?ngModel',
                complete: '&onComplete',
                next: '&onNext',
                previous: '&onPrevious',

                railwayTrimSteps : '@?',
                railwayShowLabels : '@?',
                railwayShowButtons : '@?',
                railwayShowTracks : '@?'
            },
            link: RailwayLink,
            controller: RailwayController
        };
    }    

    function RailwayFactory() {
        
        /**
         * Initialize the view: display the first "div" tag and hide the others
         * @param {jqLite} element navigation wrapper
         * @param {object} options configuration of instance
         */
        var Railway = function(element, options) {
            this.children = element.children('.railway').children('railway-station');
            this.element = element;
            this.options = options;
            this.current = false;
            
            if ( this.children.length>0 ){
                this.current = 0;
                $(this.children[0]).css('display', 'block');
                
                for (var i=1; i<this.children.length; i++) {
                    $(this.children[i]).css('display', 'none');
                }
            }
        };
        
        /**
         * Navigate to next step
         */
        Railway.prototype.next = function(){
            if ( this.current < this.children.length-1 ){
                $(this.children[this.current]).css('display', 'none');
                $(this.children[++this.current]).css('display', 'block');
            }
        };
        
        /**
         * Navigate to previous step
         */
        Railway.prototype.previous = function(){
            if ( this.current > 0 ) {
                $(this.children[this.current]).css('display', 'none');
                $(this.children[--this.current]).css('display', 'block');
            }
        };
        
        /**
         * @returns true if a next step exists, false otherwise 
         */
        Railway.prototype.hasNext = function(){
            return this.current < this.children.length-1;
        };
        
        /**
         * @returns true if a previous step exists, false otherwise 
         */
        Railway.prototype.hasPrevious = function(){
            return this.current > 0;
        };

        /**
         * @returns true if it is the last step, false otherwise 
         */
        Railway.prototype.isLast = function(){
            return this.current === this.children.length-1;
        };
        
        return Railway;
    }

    /**
     * Object oriented declaration of the Step-by-step navigation object
     */
    angular.module('sy-tools.railway')
        .factory('Railway', [RailwayFactory])
        .directive('railway', ['$timeout', 'Railway', 'RAILWAY', RailwayDirective]);

    
})();
(function () {
    'use strict';

    var validationModule = angular.module('sy-tools.validation', []);

    var INTEGER_REGEXP = /^\-?\d+$/;
    //var FLOAT_REGEXP = /^\-?\d+((\.|\,)\d+)?$/;
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
            return angular.isUndefined(val) || val===null || val==='';
        };

    	var check = function(field, rule){
    		var result = false;

            var date, comp, d, m, y,dateStr;
    		
    		var isValidDate = function(d) {
                if ( Object.prototype.toString.call(d) !== '[object Date]' ) {
                    return false;
                }
                return !isNaN(d.getTime());
			};
    		
    		switch (rule.key) {
    			case 'isTrue' :
    				result = (rule.value===true);
    				break;
    			case 'integer' :
    				result = isEmpty(field) || INTEGER_REGEXP.test(field);
    				break;
    			case 'nir' :
    				result = NIR.test(field);
    				break;
    			case 'tel' :
    				result = isEmpty(field) || TEL.test(field);
    				break;
    			case 'postcode' :
    				result = POST_CODE.test(field);
    				break;
    			case 'alphadashspace' :
    				result = ALPHA_DASH_SPACE.test(field);
    				break;
    			case 'alphanumeric' :
    				result = ALPHA_NUMERIC.test(field);
    				break;
    			case 'alphachars' :
    				result = ALPHA_CHARS.test(field);
    				break;
    			case 'alpha' :
    				result = ALPHA.test(field);
    				break;
    			case 'floatfr' :
    				result = FLOAT_REGEXP_FR.test(field);
    				break;
    			case 'floateng' :
    				result = FLOAT_REGEXP_ENG.test(field);
    				break;
    			case 'array': 
    				result = angular.isArray(field);
    				break;
    			case 'inarray': 
    				result = field!==undefined && rule.value.indexOf(field)>-1;
    				break;
    			case 'email' :
    				result = EMAIL_REGEXP.test(field);
    				break;
    			case 'date': 
    				// teste pour: jj/mm/aaaa
    				date = new Date();
    				if ( field instanceof Date ) {
    					date = field;
    				}
    				else if ( field!==undefined ) {
	    				comp = field.split('/');
	    				d = parseInt(comp[0], 10);
	    				m = parseInt(comp[1], 10);
	    				y = parseInt(comp[2], 10);
	    				date = new Date(y,m-1,d);
    				}
    				dateStr = $filter('date')(date, 'dd/MM/yyyy');
    			
    				result = field!==undefined && isValidDate( date ) && (dateStr===field);
    				break;
    			case 'datebefore': 
    				// teste pour: jj/mm/aaaa
    				date = new Date();
    				if ( field!==undefined ) {
	    				comp = field.split('/');
	    				d = parseInt(comp[0], 10);
	    				m = parseInt(comp[1], 10);
	    				y = parseInt(comp[2], 10);
	    				date = new Date(y,m-1,d);
    				}
    				result = date < rule.value;
    				break;
    			case 'boolean': 
    				result = (field!==undefined && typeof field==='boolean');
    				break;
    			case 'min': 
    				result = ( parseFloat(field)>=rule.value );
    				break;
    			case 'max': 
    				result = ( parseFloat(field)<=rule.value );
    				break;
    			case 'equal': 
    				result = (field===rule.value);
    				break;
    			case 'length': 
    				result = (field!==undefined && String(field).length===rule.value);
    				break;
    			case 'minlength': 
    				result = (field!==undefined && String(field).length>=rule.value);
    				break;
    			case 'maxlength': 
    				result = (field===undefined || String(field).length<=rule.value);
    				break;
    			case 'required': 
    				result = (field!==undefined && field!=='' && field!==null) || (angular.isArray(field) && field.length>0) || ( field instanceof Date ) || (typeof field === 'boolean');
    				break;
    		}
    		$log.debug( 'check for '+field+' as '+rule.key+' is '+result);
    		return result;
    	};
    	
    	var allErrors = function (validation) {
    		var messages = [];
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
            this.fields = [];
        };

        Validation.prototype.add = function( label, field, rules, skip) {
            var result = true;
            var messages = [];
            for( var i=0; i<rules.length; i++) {
                var temp = check(field, rules[i]);
                result = result && temp;
                if (!temp) {
                    if ( rules[i].message!==undefined && rules[i].message!=='' ) {
                        messages.push(rules[i].message);
                    }
                    if (skip!==undefined && skip) {
                        break;
                    }
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
                else {valid = false;}
            }
            return valid;
        };

        Validation.prototype.errorsAsString = function() {
            return allErrors(this.fields).join(' ');
        };

        Validation.prototype.errorsAsArray = function() {
            return allErrors(this.fields);
        };
    
    	return Validation;
	}]);

   
    
})();
