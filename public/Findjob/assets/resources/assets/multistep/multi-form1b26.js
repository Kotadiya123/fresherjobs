(function ( $ ) {
  $.fn.multiStepForm = function(args) {
      if(args === null || typeof args !== 'object' || $.isArray(args))
        throw  " : Called with Invalid argument";
      var form = this;
      var tabs = form.find('.tab');
      var steps = form.find('.step');
      steps.each(function(i, e){
        $(e).on('click', function(ev){
        });
      });
      form.navigateTo = function (i) {/*index*/
        /*Mark the current section with the class 'current'*/
        tabs.removeClass('current').eq(i).addClass('current');
        // Show only the navigation buttons that make sense for the current section:
        form.find('.previous').toggle(i > 0);
        atTheEnd = i >= tabs.length - 1;
        form.find('.next').toggle(!atTheEnd);
        // console.log('atTheEnd='+atTheEnd);
        form.find('.submit').toggle(atTheEnd);
        fixStepIndicator(curIndex());
        return form;
      }
      function curIndex() {
        /*Return the current index by looking at which section has the class 'current'*/
        return tabs.index(tabs.filter('.current'));
      }
      function fixStepIndicator(n) {
        steps.each(function(i, e){
          i == n ? $(e).addClass('active') : $(e).removeClass('active');
        });
      }
      /* Previous button is easy, just go back */
      form.find('.previous').click(function() {
        form.navigateTo(curIndex() - 1);
      });

      /* Next button goes forward iff current block validates */
      form.find('.next').click(function(){
        if('validations' in args && typeof args.validations === 'object' && !$.isArray(args.validations)){
          if(!('noValidate' in args) || (typeof args.noValidate === 'boolean' && !args.noValidate)){
            form.validate(args.validations);
            if(form.valid() == true){
              form.navigateTo(curIndex() + 1);
              return true;
            }
            return false;
          }
        }
        form.navigateTo(curIndex() + 1);
      });
	  
      form.find('.submit').on('click', function(e){
		  e.preventDefault();
		  
        if(typeof args.beforeSubmit !== 'undefined' && typeof args.beforeSubmit !== 'function')
          args.beforeSubmit(form, this);
	  
        /*check if args.submit is set false if not then form.submit is not gonna run, if not set then will run by default*/        
        if(typeof args.submit === 'undefined' || (typeof args.submit === 'boolean' && args.submit)){
			
			  if(form.valid() == true){
				form.submit();
				var formSend = document.forms.myForm;
				var formData = new FormData(formSend);
				//var name = formData.get('fname');
		
				$.ajax({
				url:"registration",
				method:"POST",
				data: formData,
				contentType:false,
				processData:false,
				dataType:"json",
				beforeSend:function(){ 
					//$('#submit').text('Please wait').css('color','green');
					//$('#submit').attr('disabled',true);
				},
				success:function(data){
					if(data.success == 0) {
						alert(data.error_msg);
					}else{
						//$('#myForm').after('<div class="overlay" style="z-index:501"><i class="fas fa-2x fa-sync-alt fa-spin"></i></div>');
						alert(data.success_msg['success_msg']);
						if(data.success_msg['log_type']=='candidate'){
							window.location.href = "index.html";
						}else if(data.success_msg['log_type']=='employer'){
							window.location.href = "index.html";
						}
					}
					
				},error: function(jqXHR, exception) {
						if (jqXHR.status === 0) {
							alert(jqXHR.status +'Not connect.\n Verify Network.');
						}else if (jqXHR.status == 404) {
							alert('Requested page not found. [404]');
						}else if (jqXHR.status == 500) {
							alert('Internal Server Error [500].');
						}else if (exception === 'parsererror') {
							alert('Requested JSON parse failed.');
						}else if (exception === 'timeout') {
							alert('Time out error.');
						}else if (exception === 'abort') {
							alert('Ajax request aborted.');
						}else {
							alert('Uncaught Error.\n' + jqXHR.responseText);
						}
					} 
				});
			  }
			return false;
			  
			
				
        }
        return form;
      });
      /*By default navigate to the tab 0, if it is being set using defaultStep property*/
      typeof args.defaultStep === 'number' ? form.navigateTo(args.defaultStep) : null;

      form.noValidate = function() {
		  console.log('3');
        
      }
      return form;
  };
}( jQuery ));