$(function () {
	// Select
	$(".select1").Selectyze();

	// Time picker
	$('.btn.clock').timepicker({
		'timeFormat': 'h : i A',
		'scrollDefaultNow': true //Set the scroll position to local time if no value selected.
	});
	$('.btn.clock').on('click', function () {
		//console.log('asdf');
		//$('#inputID2').timepicker('show');
	});

	$('.ui-timepicker-wrapper li').on('click', function(){
		$('.btn.clock span').text($(this).text());
	});


	// Date picker
	$("#inputID").datepicker({
		dateFormat: "d MM y",
		onSelect: function () {
			$(".btn.calendar span").text($('#inputID').val());
		}
	});
	$(".btn.calendar").click(function () {
		$("#inputID").datepicker("show");
	});

	// Events
	$('.btn, .action').on('click', function(e){
		e.preventDefault();
		var action = $(this).data('action'),
			parent = $(this).parents('article');
		if(action == 'expand'){
			//parent.toggleClass('close').toggleClass('open');
			$('.model1', parent).slideUp();
			$('.model2', parent).slideDown();
		}else if(action == 'delete'){
			parent.remove();
		}else if(action == 'save'){
			//parent.toggleClass('close').toggleClass('open');
			$('.model1', parent).slideDown();
			$('.model2', parent).slideUp();
		} else if(action == 'create-account'){
			//parent.toggleClass('close').toggleClass('open');
			$('.model1', parent).slideDown();
			$('.model2', parent).slideUp();
		} else if(action == 'close'){
			//parent.toggleClass('close').toggleClass('open');
			$('.model1', parent).slideDown();
			$('.model2', parent).slideUp();
		}
	});

	// Post button with confirmation Yes/No
	var submitButton = $('.post');
	submitButton.find('.action').on('click', function(e){
		e.preventDefault();
		submitButton.addClass('active');
	});
	submitButton.find('.answer.yes').on('click', function(e){
	});
	submitButton.find('.answer.no').on('click', function(e){
		submitButton.removeClass('active');
	});
});