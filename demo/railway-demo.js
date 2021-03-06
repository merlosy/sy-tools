(function(){

	'use strict';

	var app = angular.module('sy-tools.demo-railway', []);

    app.controller('RailwayController', ['$scope', '$log', '$timeout', function($scope, $log, $timeout){
        $log.debug("RailwayController");

        $scope.endRailway = function() {
            alert("GAME OVER!!");
        }

        $scope.nextStep = function() {
            alert("Next!!");
        }

        $scope.previousStep = function() {
            alert("Are you sure?");
        }

        $scope.$watch('railway.current', function(){
            $timeout(function(){
                $scope.active = $($scope.railway.children[$scope.railway.current]).attr('name');
            });
        })

    }]);

    
})();