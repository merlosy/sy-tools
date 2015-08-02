(function () {
    'use strict';

    var validationModule = angular.module('sy-tools.validation', []);

    var INTEGER_REGEXP = /^\-?\d+$/;
    //var FLOAT_REGEXP = /^\-?\d+((\.|\,)\d+)?$/;
    var FLOAT_REGEXP_FR = /^\-?\d+(\,\d+)?$/;
    var FLOAT_REGEXP_ENG = /^\-?\d+(\.\d+)?$/;
    var EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    var POST_CODE = /^[0-9]{5}$/;
    var NIR = /^[0-9]{6}([aAbB]|[0-9])[0-9]{6}$/;
    var ALPHA_NUMERIC = /^[0-9A-Za-z]*$/;
    var ALPHA_CHARS = /^[A-Za-zÀÂÄÇÉÈÊËÎÏÔÖÙÛÜŸàâäçéèêëîïôöùûüÿÆŒæœ\-\' ]*$/;
    var ALPHA_DASH_SPACE = /^[A-Za-z \-]*$/;
    var ALPHA = /^[A-Za-z]*$/;
    var TEL = /^(\+[1-9]|[0-9]{2})[0-9]{7,13}$/;
    
    
    validationModule.factory('Validation', ['$log', '$filter', function($log, $filter) {

    	var isEmpty = function(val) {
            return angular.isUndefined(val) || val===null || val==='';
        };

    	var check = function(field, rule){
    		var result = false;

            var date, comp, d, m, y,dateStr;
    		
    		var isValidDate = function(d) {
                if ( Object.prototype.toString.call(d) !== '[object Date]' ) {
                    return false;
                }
                return !isNaN(d.getTime());
			};
    		
    		switch (rule.key) {
    			case 'isTrue' :
    				result = (rule.value===true);
    				break;
    			case 'integer' :
    				result = isEmpty(field) || INTEGER_REGEXP.test(field);
    				break;
    			case 'nir' :
    				result = NIR.test(field);
    				break;
    			case 'tel' :
    				result = isEmpty(field) || TEL.test(field);
    				break;
    			case 'postcode' :
    				result = POST_CODE.test(field);
    				break;
    			case 'alphadashspace' :
    				result = ALPHA_DASH_SPACE.test(field);
    				break;
    			case 'alphanumeric' :
    				result = ALPHA_NUMERIC.test(field);
    				break;
    			case 'alphachars' :
    				result = ALPHA_CHARS.test(field);
    				break;
    			case 'alpha' :
    				result = ALPHA.test(field);
    				break;
    			case 'floatfr' :
    				result = FLOAT_REGEXP_FR.test(field);
    				break;
    			case 'floateng' :
    				result = FLOAT_REGEXP_ENG.test(field);
    				break;
    			case 'array': 
    				result = angular.isArray(field);
    				break;
    			case 'inarray': 
    				result = field!==undefined && rule.value.indexOf(field)>-1;
    				break;
    			case 'email' :
    				result = EMAIL_REGEXP.test(field);
    				break;
    			case 'date': 
    				// teste pour: jj/mm/aaaa
    				date = new Date();
    				if ( field instanceof Date ) {
    					date = field;
    				}
    				else if ( field!==undefined ) {
	    				comp = field.split('/');
	    				d = parseInt(comp[0], 10);
	    				m = parseInt(comp[1], 10);
	    				y = parseInt(comp[2], 10);
	    				date = new Date(y,m-1,d);
    				}
    				dateStr = $filter('date')(date, 'dd/MM/yyyy');
    			
    				result = field!==undefined && isValidDate( date ) && (dateStr===field);
    				break;
    			case 'datebefore': 
    				// teste pour: jj/mm/aaaa
    				date = new Date();
    				if ( field!==undefined ) {
	    				comp = field.split('/');
	    				d = parseInt(comp[0], 10);
	    				m = parseInt(comp[1], 10);
	    				y = parseInt(comp[2], 10);
	    				date = new Date(y,m-1,d);
    				}
    				result = date < rule.value;
    				break;
    			case 'boolean': 
    				result = (field!==undefined && typeof field==='boolean');
    				break;
    			case 'min': 
    				result = ( parseFloat(field)>=rule.value );
    				break;
    			case 'max': 
    				result = ( parseFloat(field)<=rule.value );
    				break;
    			case 'equal': 
    				result = (field===rule.value);
    				break;
    			case 'length': 
    				result = (field!==undefined && String(field).length===rule.value);
    				break;
    			case 'minlength': 
    				result = (field!==undefined && String(field).length>=rule.value);
    				break;
    			case 'maxlength': 
    				result = (field===undefined || String(field).length<=rule.value);
    				break;
    			case 'required': 
    				result = (field!==undefined && field!=='' && field!==null) || (angular.isArray(field) && field.length>0) || ( field instanceof Date ) || (typeof field === 'boolean');
    				break;
    		}
    		$log.debug( 'check for '+field+' as '+rule.key+' is '+result);
    		return result;
    	};
    	
    	var allErrors = function (validation) {
    		var messages = [];
    		for (var field in validation) {
    			if (validation.hasOwnProperty(field)) {
    			    var val = validation[field];
    			    messages = messages.concat( val.messages );
    			  }
    		}
    		return messages;
    	};

        var Validation = function(){
            this.done = false;
            this.fields = [];
        };

        Validation.prototype.add = function( label, field, rules, skip) {
            var result = true;
            var messages = [];
            for( var i=0; i<rules.length; i++) {
                var temp = check(field, rules[i]);
                result = result && temp;
                if (!temp) {
                    if ( rules[i].message!==undefined && rules[i].message!=='' ) {
                        messages.push(rules[i].message);
                    }
                    if (skip!==undefined && skip) {
                        break;
                    }
                }
            }
            this.fields[label] = { passes : result, messages : messages };
            return this.fields[label];
        };

        Validation.prototype.get = function(label) {
            return this.fields[label];
        };

        Validation.prototype.isValid = function() {
            var valid = true;
            for (var field in this.fields) {
                if (this.fields.hasOwnProperty(field)) {
                    var val = this.fields[field];
                    valid = (valid && val.passes);
                  }
                else {valid = false;}
            }
            return valid;
        };

        Validation.prototype.errorsAsString = function() {
            return allErrors(this.fields).join(' ');
        };

        Validation.prototype.errorsAsArray = function() {
            return allErrors(this.fields);
        };
    
    	return Validation;
	}]);

   
    
})();
