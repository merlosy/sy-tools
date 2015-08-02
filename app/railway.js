(function () {
    'use strict';
    
    var railwayModule = angular.module('sy-tools.railway', []);
    
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
            require: 'ngModel',
            //priority: 1000,
            template: ['<div class="railway-row-track" >',
                '<div class="railway-row-col">',
                //'<railway-track></railway-track>',
                    '<div class="railway-track" ng-if="railway.options.showTracks"><div ng-repeat="child in railway.children track by $index" ng-class="{\'active\':railway.current>=$index}">',
                        '<div></div><div title={{labels[$index]}}>{{$index+1}}</div><div></div>',
                        '<span ng-show="railway.options.showLabels" ng-bind="labels[$index]"></span>',
                    '</div></div>',
                '</div> </div>',
                '<div class="railway" ng-transclude></div>',
                '<div class="text-center railway-btn-group">',
                '<button class="btn btn-primary btn-railway" ng-disabled="!railway.hasPrevious()" ng-click="railway.previous()" >Previous</button>',
                '<button class="btn btn-primary btn-railway" ng-disabled="!railway.hasNext()" ng-click="railway.next()" >Next</button>',
                '</div>'
                ].join(''),
            scope: {
            	railway :'=ngModel'
            },
            link: function(scope, element, attrs, ctrl) {
                $log.debug(attrs.railwayTrimSteps);
                $log.debug(attrs.railwayShowLabels);
                $log.debug(attrs.railwayShowTracks);
                var options = {
                    trimSteps : attrs.railwayTrimSteps? attrs.railwayTrimSteps==="true" : RAILWAY.trimSteps,
                    showLabels : attrs.railwayShowLabels? attrs.railwayShowLabels==="true" : RAILWAY.showLabels,
                    showTracks : attrs.railwayShowTracks? attrs.railwayShowTracks==="true" : RAILWAY.showTracks
                }
            	scope.railway = new Railway(element, options);

                scope.labels = new Array();

                //$timeout(function(){
                    //scope.RAILWAY = scope.railwayOptions || RAILWAY;
                
                    //$log.debug(scope.RAILWAY);

                   if (scope.railway.options.showTracks) {
                        $log.debug(scope.railway.options);

                        var nb = scope.railway.children.length;
                        var steps = scope.railway.children;
                        
                        for (var i=0; i<steps.length; i++) {
                            scope.labels.push($(steps[i]).attr('name'));
                        }
                        
                        if (nb>1) {
                            $log.debug("tracks");
                            // cannot access .railway-track before instanciated, selector find 0 match
                            $log.debug( element.children('.railway-track'));
                            $log.debug( $(element).closest('railway-row-col'));
                            var main_blocs = angular.element('.railway-track > div');
                                                    
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
                //});

            }
        };
    }]);
    
    /*railwayModule.directive('railwayTrack', ['$log', 'Railway', '$timeout', 'RAILWAY', function($log, Railway, $timeout, RAILWAY) {
        return {
            restrict: 'EA',
            replace: true,
            transclude: false,
            template: '<div class="railway-track" ng-if="railway.options.showTracks"><div ng-repeat="child in railway.children track by $index" ng-class="{\'active\':railway.current>=$index}">'
            		+'<div></div><div title={{labels[$index]}}>{{$index+1}}</div><div></div>'
            		+'<span ng-show="railway.options.showLabels" ng-bind="labels[$index]"></span>'
            		+'</div></div>',
            link: function(scope, element, attrs, ctrl) {
            	
            	scope.labels = new Array();
            	
                
                $timeout(function(){
                    //scope.RAILWAY = scope.railwayOptions || RAILWAY;
                
                    //$log.debug(scope.RAILWAY);

            	   if (scope.railway.options.showTracks) {
                        $log.debug(scope.railway.options);

	            		var nb = scope.railway.children.length;
	            		var steps = scope.railway.children;
	            		
	            		for (var i=0; i<steps.length; i++) {
	        				scope.labels.push($(steps[i]).attr('name'));
	        			}
	            		
	            		if (nb>1) {
                            $log.debug("tracks");
                            // cannot access .railway-track before instanciated, selector find 0 match
                            $log.debug(scope.railway.element.children('.railway-track'));
                            $log.debug( $(element).closest('railway-row-col'));
	            			var main_blocs = angular.element('.railway-track > div');
	            			            			
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
            //$log.debug(element.children());
            //$log.debug(this.children);
            this.options = options;
    		this.current = false;
    		this.height = 0;
    		
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
        
        return Railway;
    }]);
    
})();