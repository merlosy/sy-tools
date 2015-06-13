
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
