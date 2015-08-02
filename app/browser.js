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
