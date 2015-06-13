
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
    