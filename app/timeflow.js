(function () {
    'use strict';
    
    angular.module('sy-tools.timeflow', []);

    /**
     * @name TimeFlowDirective
     * @desc <railway> directive
     */
    function TimeFlowDirective() {

        /**
         * @name TimeFlowController
         * @desc Linker for railway directive
         * @type {Function}
         */
        function TimeFlowController() {
        }

        /**
         * @name TimeFlowLink
         * @desc Linker for railway directive
         * @type {Function}
         */
        function TimeFlowLink(scope, element, attrs) {
            console.log(attrs.flowType);

            if ( attrs.flowType==='shadow' ){
                element.addClass('shadow-event');
            }
            else if ( attrs.flowType==='asFirst' ){
                element.addClass('as-first-event');
            }
            else if ( attrs.flowType==='asLast' ){
                element.addClass('as-last-event');
            }
            else if ( attrs.flowType==='asFirstChild' ){
                element.addClass('as-firstchild-event');
            }
            else if ( attrs.flowType==='asLastChild' ){
                element.addClass('as-lastchild-event');
            }
            else if ( attrs.flowType==='nest' ){
                element.addClass('nest-event');
            }

            // if ( angular.isDefined(attrs.flowColor) ){
            //     element.find('.time-line:before').css('border-color', attrs.flowColor);
            // }
        }

        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {},
            template: ['<div class="time-flow" >',
                '<div class="time-line"></div>',
                '<div class="time-event">',
                '   <div class="time-event-body" ng-transclude>',
                '   </div>',
                '</div>',
                '</div>'
                ].join(''),
            link: TimeFlowLink,
            controller: TimeFlowController
        };
    }    

    /**
     * Object oriented declaration of the Step-by-step navigation object
     */
    angular.module('sy-tools.timeflow')
        .directive('timeFlow', [TimeFlowDirective]);

    
})();