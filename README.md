# formvalidation.js

This is a base module for form validation, designed to be as resusable as possible without having to edit this file too heavily.

It works by defining the validation type in the data attribute of each field and matching the string with a function containing logic.

If a function does not exist for a particular validation it will fallback to using a 'default' function that can be extended.

Callbacks can also be passed in for error/success states.


	<form class="form"> 
		<div class="form__row">
			<input type="text" data-type="age" class="js-required" />
		</div>
		<div class="form__row">
			<input type="text" data-type="fullname" class="js-required" />
		</div>
		<div class="form__row">
			<input type="submit" value="Submit" />
		</div>
	</form>

	@js

	$('form').on('submit', function(e){
	   	new FormValidation(e, $(this), {
	   		age: function(){
	   			return $(this).val()*1 >= 18;
	   		},
	   		fullname: function(){
	   			return $(this).val().split(' ').length > 1;
	   		},
	   		error: function(){
	   			alert('error');
	   		}
	   	});
	});