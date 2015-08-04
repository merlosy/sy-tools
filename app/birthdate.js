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
