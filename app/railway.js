(function () {
    'use strict';
    
    var railwayModule = angular.module('sy-tools.railway', []);
    
    railwayModule.run(["$templateCache", function($templateCache) {
        $templateCache.put('sy-tools/template/railway.html', 
            ['<div class="railway-row-track" >',
            '<div class="railway-row-col">',
                '<div class="railway-track" ng-if="railway.options.showTracks"><div ng-repeat="child in railway.children track by $index" ng-class="{\'active\':railway.current>=$index}">',
                    '<div></div><div title={{labels[$index]}}>{{$index+1}}</div><div></div>',
                    '<span ng-show="railway.options.showLabels" ng-bind="labels[$index]"></span>',
                '</div></div>',
            '</div> </div>',
            '<div class="railway" ng-transclude></div>',
            '<div class="text-center railway-btn-group" ng-show="railway.children.length>0">',
                '<button class="btn btn-primary btn-railway" ng-disabled="!railway.hasPrevious()" ng-click="goBack()" >Previous</button>',
                '<button class="btn btn-primary btn-railway" ng-disabled="!railway.hasNext()" ng-click="goNext()" >Next</button>',
                '<button class="btn btn-success btn-railway" ng-show="railway.isLast()" ng-click="complete()" >Finish</button>',
            '</div>'
            ].join('')
        );
    }]);

    railwayModule.constant('RAILWAY', {
    	trimSteps: true,
    	showLabels: true,
    	showTracks: true
    });

    railwayModule.directive('railway', ['$log', 'Railway', 'RAILWAY', '$timeout', function($log, Railway, RAILWAY, $timeout) {
        return {
            restrict: 'E',
            replace: false,
            transclude: true,
            require: '?ngModel',
            templateUrl: 'sy-tools/template/railway.html',
            scope: {
            	railway :'=?ngModel',
                complete: '&onComplete',
                next: '&onNext',
                previous: '&onPrevious'
            },
            link: function(scope, element, attrs, ctrl) {
                var options = {
                    trimSteps : attrs.railwayTrimSteps? attrs.railwayTrimSteps==="true" : RAILWAY.trimSteps,
                    showLabels : attrs.railwayShowLabels? attrs.railwayShowLabels==="true" : RAILWAY.showLabels,
                    showTracks : attrs.railwayShowTracks? attrs.railwayShowTracks==="true" : RAILWAY.showTracks
                }
            	scope.railway = new Railway(element, options);

                scope.labels = new Array();

                $timeout(function(){

                   if (scope.railway.options.showTracks) {

                        var nb = scope.railway.children.length;
                        var steps = scope.railway.children;
                        
                        for (var i=0; i<steps.length; i++) {
                            scope.labels.push($(steps[i]).attr('name'));
                        }
                        
                        if (nb>1) {
                            var main_blocs = element.find('.railway-track').children();
                                                    
                            if (scope.railway.options.trimSteps) {
                                var larg_percent = 100/nb;
                                main_blocs.css('width', larg_percent+'%').addClass('fitted');
                            }
                            else {
                                var larg_percent = 100/(2*(nb-1));
                                main_blocs.css('width', 2*larg_percent+'%');
                                angular.element(main_blocs[0]).css('width', larg_percent+'%');
                                angular.element(main_blocs[main_blocs.length-1]).css('width', larg_percent+'%');
                            }
                            
                        }
                        else 
                            angular.element('.railway-track > div').css('width', '100%');
                    }
                });

            },
            controller: function ($scope) {
                $scope.goNext = function(){
                    $scope.next();
                    $scope.railway.next();
                };
                $scope.goBack = function(){
                    $scope.previous();
                    $scope.railway.previous();
                };

                this.getRailway = function() {
                    return $scope.railway;
                }
            }
        };
    }]);

    /*railwayModule.directive('railwayStation', ['$log', 'Railway', 'RAILWAY', '$timeout', function($log, Railway, RAILWAY, $timeout) {
        return {
            restrict: 'E',
            require: '^railway',
            scope: {
                complete: '&onComplete'
            }
        };
    }]);*/
    
    
    /**
     * Object oriented declaration of the Step-by-step navigation object
     */
    railwayModule.factory('Railway', ['$log', function ($log) {
    	
    	/**
    	 * Initialize the view: display the first "div" tag and hide the others
    	 * @param element navigation wrapper
    	 */
    	var Railway = function(element, options) {
    		this.children = element.children('.railway').children('railway-station');
            this.element = element;
            this.options = options;
    		this.current = false;
    		
    		if ( this.children.length>0 ){
    			this.current = 0;
    			$(this.children[0]).css("display", "block");
    			$log.debug(this.children);
    			
    			for (var i=1; i<this.children.length; i++) {
    				$(this.children[i]).css("display", "none");
    			}
    		}
        };
        
        /**
         * Navigate to next step
         */
        Railway.prototype.next = function(){
    		if ( this.current < this.children.length-1 ){
    			$(this.children[this.current]).css("display", "none");
    			$(this.children[++this.current]).css("display", "block");
    		}
    	};
    	
    	/**
         * Navigate to previous step
         */
    	Railway.prototype.previous = function(){
    		if ( this.current > 0 ) {
    			$(this.children[this.current]).css("display", "none");
    			$(this.children[--this.current]).css("display", "block");
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
            return this.current == this.children.length-1;
        };
        
        return Railway;
    }]);
    
})();