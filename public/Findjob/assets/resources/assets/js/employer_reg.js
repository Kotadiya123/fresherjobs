(function ( $ ) {
	
	$(document).on('change','#call_status',function(){
		if($(this).val()=='1'){
			$('#company_alternate_contact').css('display','');
		}else if($(this).val()=='0'){
			$('#company_alternate_contact').css('display','none');
		}
	});
	
	$.validator.addMethod('filesize', function (value, element, param){
		    return this.optional(element) || (element.files[0].size <= param)
		}, function(size){
		return "file size must be " + filesize(size,{exponent:2,round:1});
	});	
			
	$('#emyForm').validate({
		errorElement: "span",
		ignore: ":hidden:not(textarea)",     
		rules: {
			     
			employee_name:{
				required:true,
				minlength:4,
				maxlength:16,
			},
			work_email:{
				required: true,
				email: true
			},
			employee_password:{
				required:true,
				minlength:8,
				maxlength:16,
			},
			company_contact: {
				required:true,
				minlength:10,
				maxlength:10,
				digits:true
			},
					
			company_alternate_contact: {
				required:true,
				minlength:10,
				maxlength:10,
				digits:true
			},
			employee_company_name:"required",
			company_location:"required",
			recuiter_type:"required",
			call_status:"required",
			email_status:"required",
			company_logo:{
			    //required:true,
				extension: "jpg|jpeg|png",
				filesize: 200000,
			}
			
		    },
			messages: {
					
				employee_name:{
					required: 	"Full Name is required",
					minlength: 	"Username should be minimum 4 characters",
					maxlength: 	"Username should be maximum 16 characters",
				},
				work_email: {
					required: 	"Email is required",
					email: 		"Please enter a valid e-mail",
				},
				employee_password:{
					required: 	"Password is required",
					minlength: 	"Password should be minimum 8 characters",
					maxlength: 	"Password should be maximum 16 characters",
				},
					
				company_contact:{
					required: 	"Mobile number is requied",
					minlength: 	"Please enter 10 digit mobile number",
					maxlength: 	"Please enter 10 digit mobile number",
					digits: 	"Only numbers are allowed in this field"
				},
					
				company_alternate_contact:{
					required: 	"Mobile number is requied",
					minlength: 	"Please enter 10 digit mobile number",
					maxlength: 	"Please enter 10 digit mobile number",
					digits: 	"Only numbers are allowed in this field"
				},
				company_logo:{
        			extension:"Please upload .jpg or .png or .jpeg file of notice.",
                    filesize:" file size must be less than 200 KB.",
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
						  //toastr.warning(data.error_msg);
						} else {
							
							alert(data.success_msg['success_msg']);
							if(data.success_msg['log_type']=='candidate'){
									window.location.href = "index.html";
							}else if(data.success_msg['log_type']=='employer'){
								if(data.success_msg['profile']=='updated'){
									location.reload();
								}else if(data.success_msg['profile']==''){
									window.location.href = "index.html";
								}
							}
						  //$('#add_product').after('<div class="overlay" style="z-index:501"><i class="fas fa-2x fa-sync-alt fa-spin"></i></div>');
						  //toastr.success(data.success_msg);
						  //window.location.href = "<?=base_url('internal/projects/')?>";
						}
					  },
					  beforeSend: function() {
						$("#submit_btn").text('Profile Updating..').addClass('disabled');
					  },
					  complete: function() {
						$("#submit_btn").text('Update Changes').removeClass('disabled');
					  }
					});
				  }
				});	
  
  
 }( jQuery ));

