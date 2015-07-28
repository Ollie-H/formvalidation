/**
*   @package        FormValidation.js
*   @subpackage     Javascript
*   @author         Ollie Husband
*   
*   @description
*   
*   This is a base module for form validation, designed to be as resusable as possible without having to edit this file too heavily.
*   It works by defining the validation type in the data attribute of each field and matching the string with a function containing logic.
*   If a function does not exist for a particular validation it will fallback to using a 'default' function that can be extended.
*   Callbacks can also be passed in for error/success states.
* 
* 	@html
*
* 	<form class="form"> 
* 		<div class="form__row">
* 			<input type="text" data-type="age" class="js-required" />
* 		</div>
* 		<div class="form__row">
* 			<input type="text" data-type="fullname" class="js-required" />
* 		</div>
* 		<div class="form__row">
* 			<input type="submit" value="Submit" />
* 		</div>
* 	</form>
*
* 	@js
*
* 	$('form').on('submit', function(e){
*    	new FormValidation(e, $(this), {
*    		age: function(){
*    			return $(this).val()*1 >= 18;
*    		},
*    		fullname: function(){
*    			return $(this).val().split(' ').length > 1;
*    		},
*    		error: function(){
*    			alert('error');
*    		}
*    	});
*	});
* 
* 
**************************************************************************************************************************/

;(function($){

	function FormValidation(e, container, settings){

		// Defaults - can all be overwritten in function call */
		this.settings = {
			error: function(){},
			success: function(){},
			default: function(){
				// Default 
				return $(this).val().length > 0;
			},
			email: function(){
				// Default date validation
				return window.config.regex.email.test($(this).val());
			},
			date: function(subfields){
				// Default date validation
				var day = $(subfields[0]).val()*1,
					month = ($(subfields[1]).val()*1)-1,
					year = $(subfields[2]).val()*1;

				var d = new Date( year, month, day );
				return ( d.getMonth()==month && d.getDate()==day && d.getFullYear()==year);
			}
		};

		// Default settings are extended here to include custom settings
		if(settings) $.extend(this.settings, settings);

		// Extablish variables
		this.container = $(container);
		this.fields = $(container).find('.js-field');
		this.fieldCount = this.fields.length;
		this.errors = 0,
		this.errorsFound = false,
		this.e = e;

		// Call validate method
		this.validate();

		return this;

	}

	FormValidation.prototype = {

		// Main validation function
		validate : function(){

			var self = this;

			// Loop through all fields
			$.each($(this.fields), function(i, field){

				var parent = $(field).parents('.form__row'),
					required = $(parent).hasClass('js-required'),
					subfields = $(parent).find('.js-subfield'),
					type = $(field).attr('data-type') || 'default';

				// Remove errors
				$(parent).removeClass('has-error');

				// If there are multiple sub fields treat them together 
				if(subfields.length > 0 && required){

					if(typeof self.settings[type] === 'function'){
						self.error(!self.settings[type].call(this, subfields), field);
					}

				}
				// Only validate fields that have a required class
				else if(required){

					if(typeof self.settings[type] === 'function'){
						self.error(!self.settings[type].call(this), field);
					}
				}

			});

			// If no errors execute success callback
			if(!self.errorsFound){
				if(typeof self.settings.success === 'function'){
					self.settings.success.call();
				}
			}
			// else execute error callback  
			else if(self.e && self.e.type != 'keydown'){
				if(typeof self.settings.error === 'function'){
					self.settings.error.call();
				}
				self.e.preventDefault();
				return false;
			}

		},
		// Individual field error, add class to invalid field
		error: function(error, field){

			if(error){
				$(field).parents('.form__row').addClass('has-error');
				this.errorsFound = true;
				this.errors++;
			}	

		}

	};

	window.FormValidation = FormValidation;

})(jQuery);