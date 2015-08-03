(function() {

   'use strict';

   var appModule = angular.module('sy-tools.demo-feedback', []);

   appModule.controller('FeedbackController', ['$scope', '$timeout', '$log', 'Feedback',
                         function($scope, $timeout, $log, Feedback){

      $scope.feedback = new Feedback();
      $scope.feedback.local("Test", 'success');
      $scope.feedback.local("Test1", 'warning');
      $scope.feedback.local("Test3", 'danger', {closable:false});
      $scope.feedback.local("Test3", 'info');

      $timeout(function(){
         $scope.feedback.local("Test timeout");
      });

   }]);

})();