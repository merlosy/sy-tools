(function() {

   'use strict';

   var appModule = angular.module('sy-tools.demo-device', []);

   appModule.controller('DeviceController', ['$scope', '$log', 'Device',
                         function($scope, $log, Device){

      $scope.device = new Device();

   }]);

})();