(function () {
    'use strict';
    
    angular.module('sy-tools.railway', []);

    angular.module('sy-tools.railway').constant('RAILWAY', {
    	trimSteps: true,
    	showLabels: true,
        showTracks: true,
    	showButtons: true
    });

    /**
     * @name RailwayDirective
     * @desc <railway> directive
     */
    function RailwayDirective( $timeout, Railway, RAILWAY ) {

        /**
         * @name RailwayController
         * @desc Linker for railway directive
         * @type {Function}
         */
        function RailwayController() {
            this.goNext = function(){
                this.next();
                this.railway.next();
            };
            this.goBack = function(){
                this.previous();
                this.railway.previous();
            };
        }

        /**
         * @name RailwayLink
         * @desc Linker for railway directive
         * @type {Function}
         */
        function RailwayLink(scope, element) {
            var ctrl = scope.ctrl;

            var options = {
                trimSteps : ctrl.railwayTrimSteps? ctrl.railwayTrimSteps==='true' : RAILWAY.trimSteps,
                showLabels : ctrl.railwayShowLabels? ctrl.railwayShowLabels==='true' : RAILWAY.showLabels,
                showButtons : ctrl.railwayShowButtons? ctrl.railwayShowButtons==='true' : RAILWAY.showButtons,
                showTracks : ctrl.railwayShowTracks? ctrl.railwayShowTracks==='true' : RAILWAY.showTracks
            };
            ctrl.railway = new Railway(element, options);

            ctrl.labels = [];

            $timeout(function(){

               if (ctrl.railway.options.showTracks) {

                    var nb = ctrl.railway.children.length;
                    var steps = ctrl.railway.children;
                    var largPercent = 100;
                    
                    for (var i=0; i<steps.length; i++) {
                        ctrl.labels.push($(steps[i]).attr('name'));
                    }
                    
                    if (nb>1) {
                        var mainBlocs = element.find('.railway-track').children();
                                                
                        if (ctrl.railway.options.trimSteps) {
                            largPercent = 100/(nb-1);
                            mainBlocs.css('width', largPercent+'%').addClass('fitted');
                            angular.element(mainBlocs[0]).css('width', largPercent/2+'%');
                            angular.element(mainBlocs[mainBlocs.length-1]).css('width', largPercent/2+'%');
                        }
                        else {
                            largPercent = 100/nb;
                            mainBlocs.css('width', largPercent+'%');
                        }
                        
                    }
                    else {
                        angular.element('.railway-track > div').css('width', largPercent+'%');
                    }
                }
            });

        }

        return {
            restrict: 'E',
            replace: false,
            transclude: true,
            require: '?ngModel',
            template: ['<div class="railway-row-track" >',
                '<div class="railway-row-col">',
                    '<div class="railway-track" ng-if="ctrl.railway.options.showTracks"><div ng-repeat="child in ctrl.railway.children track by $index" ng-class="{\'active\':ctrl.railway.current>=$index}">',
                        '<div></div><div title={{ctrl.labels[$index]}}>{{$index+1}}</div><div></div>',
                        '<span ng-show="ctrl.railway.options.showLabels" ng-bind="ctrl.labels[$index]"></span>',
                    '</div></div>',
                '</div> </div>',
                '<div class="railway" ng-transclude></div>',
                '<div class="text-center railway-btn-group" ng-show="ctrl.railway.children.length>0 && ctrl.railway.options.showButtons">',
                    '<button class="btn btn-primary btn-railway" ng-disabled="!ctrl.railway.hasPrevious()" ng-click="ctrl.goBack()" >Previous</button>',
                    '<button class="btn btn-primary btn-railway" ng-disabled="!ctrl.railway.hasNext()" ng-click="ctrl.goNext()" >Next</button>',
                    '<button class="btn btn-success btn-railway" ng-show="ctrl.railway.isLast()" ng-click="ctrl.complete()" >Finish</button>',
                '</div>'
                ].join(''),
            controllerAs: 'ctrl',
            bindToController: true,
            scope: {
                railway :'=?ngModel',
                complete: '&onComplete',
                next: '&onNext',
                previous: '&onPrevious',

                railwayTrimSteps : '@?',
                railwayShowLabels : '@?',
                railwayShowButtons : '@?',
                railwayShowTracks : '@?'
            },
            link: RailwayLink,
            controller: RailwayController
        };
    }    

    function RailwayFactory() {
        
        /**
         * Initialize the view: display the first "div" tag and hide the others
         * @param {jqLite} element navigation wrapper
         * @param {object} options configuration of instance
         */
        var Railway = function(element, options) {
            this.children = element.children('.railway').children('railway-station');
            this.element = element;
            this.options = options;
            this.current = false;
            
            if ( this.children.length>0 ){
                this.current = 0;
                $(this.children[0]).css('display', 'block');
                
                for (var i=1; i<this.children.length; i++) {
                    $(this.children[i]).css('display', 'none');
                }
            }
        };
        
        /**
         * Navigate to next step
         */
        Railway.prototype.next = function(){
            if ( this.current < this.children.length-1 ){
                $(this.children[this.current]).css('display', 'none');
                $(this.children[++this.current]).css('display', 'block');
            }
        };
        
        /**
         * Navigate to previous step
         */
        Railway.prototype.previous = function(){
            if ( this.current > 0 ) {
                $(this.children[this.current]).css('display', 'none');
                $(this.children[--this.current]).css('display', 'block');
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
            return this.current === this.children.length-1;
        };
        
        return Railway;
    }

    /**
     * Object oriented declaration of the Step-by-step navigation object
     */
    angular.module('sy-tools.railway')
        .factory('Railway', [RailwayFactory])
        .directive('railway', ['$timeout', 'Railway', 'RAILWAY', RailwayDirective]);

    
})();