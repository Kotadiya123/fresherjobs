(function ( $ ) {
	
   $('#login_credential').validate({
		errorElement: "span",
		rules: {
		
			login_id:{
				required: true,
				email: true
			},
			login_password:{
				required:true,
				minlength:8,
				maxlength:16,
			},
			login_reg_type:"required"
				
		},
		messages:{
			
			login_id: {
				required: 	"Email is required",
				email: 		"Please enter a valid e-mail",
			},
			login_password:{
				required: 	"Password is required",
				minlength: 	"Password should be minimum 8 characters",
				maxlength: 	"Password should be maximum 16 characters",
			}
					
		},
		
		submitHandler: function(form) {
			var formData = new FormData($(form)[0]);
			$.ajax({
				type     : "POST",
				cache    : false,
				contentType: false,
				processData: false,
				url      : form.action,
				dataType : 'json',
				data     : formData,
				success  : function(data) {
					if(data.success == 0) {
						alert(data.error_msg);
					}else{
						$("#login").text(data.success_msg['success_msg']);	
						if(data.success_msg['log_type']=='candidate'){
							//window.location.href = "candidate-dashboard";
							 window.location.href = "index.html";		
						}else if(data.success_msg['log_type']=='employer'){
							window.location.href = "index.html";
						}
					}
				},
				beforeSend: function() {
					$("#login").text('checking..');
				},
				complete: function() {
					$("#login").text('Login');
				}
				});
			}
		});	
		
		
		$(document).on('click','#log_regist_type',function(){
			if($(this).data('type')=='candidate'){
				$('#login_reg_type').val($(this).data('type'));
			}else if($(this).data('type')=='employer'){
				$('#login_reg_type').val($(this).data('type'));
			}
		});
  
  
  
  
 }( jQuery ));

