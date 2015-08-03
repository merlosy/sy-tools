(function() {

   'use strict';

   var appModule = angular.module('sy-tools-demo', [
      'ngAnimate',
      'ngAria',
      'ui.router',
      'sy-tools',
      'sy-tools.demo-feedback',   
      'sy-tools.demo-password-strength',   
      'sy-tools.demo-railway',   
      'sy-tools.demo-device'    
      ]);

   appModule.config(['$urlRouterProvider', '$stateProvider', '$logProvider', 
                  function($urlRouterProvider, $stateProvider, $logProvider) {

      $logProvider.debugEnabled(true);

      $stateProvider.state('home', {
         url: "/",
         templateUrl: 'demo/home.html'
      });

      $stateProvider.state('feedback', {
         url: "/feedback",
         templateUrl: 'demo/feedback.html'
      });

      $stateProvider.state('device', {
         url: "/device",
         templateUrl: 'demo/device.html'
      });

      $stateProvider.state('password', {
         url: "/password",
         templateUrl: 'demo/password.html'
      });

      $stateProvider.state('railway', {
         url: "/railway",
         templateUrl: 'demo/railway.html'
      });

      $urlRouterProvider.otherwise('/');
      
   }]);

   appModule.controller('AppController', ['$scope', '$location', '$log', function($scope, $location, $log){

      $log.debug("IN DEV");
      $scope.test = "It is working";
   }]);

})();