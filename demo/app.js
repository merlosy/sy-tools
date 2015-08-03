(function(){

	'use strict';

	var app = angular.module('sy-tools-demo', [
        // vendor modules
		'ui.router',
		//'ngCookies',
        //'ui.bootstrap',
        //'ui-notification',
        // application modules
        'sy-tools',
        'sy-tools.railway-demo'
    ]);

    app.config(['$stateProvider', '$logProvider', '$urlRouterProvider', '$provide', '$httpProvider', 
                             function ($stateProvider, $logProvider, $urlRouterProvider, $provide, $httpProvider) {
        
    	
    	$stateProvider.state('railway', {
    		url: "/",
    		views : {
    			'' : {
    				templateUrl: 'demo/railway.html'
    			}
    		}
    	});
    	    	
        $urlRouterProvider.otherwise('/');
        
    }]);

    app.controller('AppController', ['$scope', '$log', function($scope, $log){
        $log.debug("AppController");

        $scope.isEmpty = function(str) {
            return angular.isUndefined(str) || str==null || str=="" ; 
        };

    }]);

    
})();