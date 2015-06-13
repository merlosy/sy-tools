
angular.module('sy-tools.feedback', [])
    
.constant('FEEDBACK', {
	unavailable: "The server is currently unavailable. Please, try again later.",
	failure: "An error has occured. Please, contact support or try again later.",
    level : {
        'default' : "default",
        success : 'success',
        info : 'info',
        warning : 'warning',
        danger : 'danger'
    }
})

.constant('HTTP_CODE', {
	pattern_4XX: /^4[0-9]{2}$/
})

.directive('syFeedback', ['$log', 'Feedback', function($log, Feedback) {
    return {
        restrict: 'E',
        replace: true,
        template : '<div class="alert alert-{{alert.level}} alert-dismissible" role="alert" ng-repeat="alert in feedback.alerts">'
	           +' 	<button ng-show="alert.closable" type="button" class="close" title="{{lang.actions.fermer.titre}}" data-dismiss="alert" ng-click="closeAlert($index)"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'
	           +' 		{{alert.message}}'
	           +' 		<ul ng-show="alert.array">'
	           +'  			<li ng-repeat="message in alert.array track by $index" ng-show="message.length>0">{{message}}</li>'
	           +' 		</ul>'
	           +' 	</div>',
		scope : {
			feedback : '=model'
		},
        link: function(scope, element, attrs, ctrl) {

			scope.closeAlert = function(index) {
	    	    scope.feedback.alerts.splice(index, 1);
	    	};
        }
    };
}])

.factory('Feedback', [ '$rootScope', '$timeout', '$log', 'HTTP_CODE', 'FEEDBACK',
                            function ($rootScope, $timeout, $log, HTTP_CODE, FEEDBACK) {
	var isEmpty = function(val) {
        return angular.isUndefined(val) || val===null || val==="";
    };

	var arraysEqual =  function(a1,a2) {
	    return JSON.stringify(a1)===JSON.stringify(a2);
	};
	
	var formatMessage = function(messages, level, closable) {
		var data = {
            level: level || FEEDBACK.level.default,
            closable : angular.isDefined(closable)? closable : true
        };
		
		if ( !angular.isArray(messages) ) {
			data.message = isEmpty(messages)? FEEDBACK.failure : messages;
		}
		else {
      	  	switch (messages.length) {
      	  		case 0:
      	  			data.message = FEEDBACK.failure;
      	  			break;
      	  		case 1:
      	  			data.message = messages[0];
      	  			break;
      	  		default:
      	  			data.array = messages;
      	  			break;
      	  	}
		}
  	  	return data;
	};
	    	
	var hasDuplicates = function(alerts, contenu) {
		var duplicated = false;
		
		for (var i in alerts){
			if ( (angular.isDefined(contenu.message) 
                    && alerts[i].message===contenu.message
                    && alerts[i].level===contenu.level) 
  				  || (angular.isArray(contenu.array) 
                        && arraysEqual(alerts[i].array, contenu.array) 
                        && alerts[i].level===contenu.level)	 
  				){
  			  	$log.debug('Message duplicated');
  			  	duplicated = true;
  		  	}
  	  	}
		return duplicated;
	};

    var Feedback = function() {
        this.alerts = new Array();
    }
    
    Feedback.prototype.local = function (content, level, closable) {
        var toAdd = formatMessage(content, level, closable);
        if ( hasDuplicates(this.alerts, toAdd) ) return;
        this.alerts.push( toAdd );
    };

    Feedback.prototype.validation = function (content) {
        this.local(content, FEEDBACK.level.danger);
    };

    Feedback.prototype.error = function (validation, error) {
        $log.debug(error);
        var arrayMessages = new Array();

        switch(error.status) {
        	case 412:
        		if ( angular.isDefined(error.data) && angular.isArray(error.data) ){
        			for( var i=0; i<error.data.length; i++){
        			  	arrayMessages.push( error.data[i].message );
        			  
        			  	if ( angular.isDefined(error.data[i].nomParametres) && angular.isArray(error.data[i].nomParametres) ){
        				  	for( var j=0; j<error.data[i].nomParametres.length; j++) {
                			  	var champ = error.data[i].nomParametres[j];
                			  	validation[champ] = {passes :false};
        				  	}
        			  	}
        		  	}
        		}
        		break;
        	case HTTP_CODE.pattern_4XX.test( error.status ):
        	  	arrayMessages = FEEDBACK.failure;
          		break;
        	case 503:
        		arrayMessages = FEEDBACK.unavailable;
        		break;
        	default:
        		break;
        }

        var toAdd = formatMessage(arrayMessages, FEEDBACK.level.danger);
        if ( hasDuplicates(this.alerts, toAdd) ) return;
        this.alerts.push( toAdd );
    };
      
  return Feedback;

}]);
