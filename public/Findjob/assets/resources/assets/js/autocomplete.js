
(function($){
"use strict";
	
	 $("#job_search").autocomplete({
        source: function (request, response) {
        $.ajax({
          method: 'post',
          url: "get-job-title",
          data: {
            searchTerm: $("#job_search").val(),
            count: 10
          },
          dataType: 'json',
          success: function (data) {
			if(!data.length){
				$("#data_store").val('');
			}else{
				response($.map(data, function (item,i){
				  return {
					label: item.text,
					id: item.id,
				  };
				  
				})
			    );
			}
          },
          beforeSend: function() {
              $("#spinner").html('<i class="fa fa-spinner fa-lg" aria-hidden="true"></i>');
          },
          complete: function() {
             $("#spinner").html('');
          },
          error: function (data){
            alert('error!');
          }
        });
      },
      minLength: 2,
      select: function (event, ui){
        $("#job_search").val(ui.item.label);
        $("#key_word").val(ui.item.id);
        return false;
      },
    });
    
    
    $("#m_job_search").autocomplete({
        source: function (request, response) {
        $.ajax({
          method: 'post',
          url: "get-job-title",
          data: {
            searchTerm: $("#m_job_search").val(),
            count: 10
          },
          dataType: 'json',
          success: function (data) {
			if(!data.length){
				$("#m_key_word").val('');
			}else{
				response($.map(data, function (item,i){
				  return {
					label: item.text,
					id: item.id,
				  };
				  
				})
			    );
			}
          },
          beforeSend: function() {
              $("#m_spinner").html('<i class="fa fa-spinner fa-lg" aria-hidden="true"></i>');
          },
          complete: function() {
             $("#m_spinner").html('');
          },
          error: function (data){
            alert('error!');
          }
        });
      },
      minLength: 2,
      select: function (event, ui){
        $("#m_job_search").val(ui.item.label);
        $("#m_key_word").val(ui.item.id);
        return false;
      },
    });
    
    
    
    $("#current_location").autocomplete({
        source: function (request, response) {
        $.ajax({
          method: 'post',
          url: "get-city",
          data: {
              searchTerm: $("#current_location").val(),
              count: 10
          },
          dataType: 'json',
          success: function (data) {
			if(!data.length){
				$("#current_id").val('');
			}else{
				response($.map(data, function (item,i){
				  return {
					label: item.text,
					id: item.id,
				  };
				  
				})
			    );
			}
          },
          beforeSend: function() {
              $("#current_spinner").html('<i class="fa fa-spinner fa-lg" aria-hidden="true"></i>');
          },
          complete: function() {
             $("#current_spinner").html('');
          },
          error: function (data){
            alert('error!');
          }
        });
      },
      minLength: 2,
      select: function (event, ui){
        $("#current_location").val(ui.item.label);
        $("#current_id").val(ui.item.id);
        return false;
      },
    });
    
    $("#preferred_loaction").autocomplete({
        source: function (request, response) {
        $.ajax({
          method: 'post',
          url: "get-city",
          data: {
              searchTerm: $("#preferred_loaction").val(),
              count: 10
          },
          dataType: 'json',
          success: function (data) {
			if(!data.length){
				$("#preferred_id").val('');
			}else{
				response($.map(data, function (item,i){
				  return {
					label: item.text,
					id: item.id,
				  };
				  
				})
			    );
			}
          },
          beforeSend: function() {
              $("#preferred_spinner").html('<i class="fa fa-spinner fa-lg" aria-hidden="true"></i>');
          },
          complete: function() {
             $("#preferred_spinner").html('');
          },
          error: function (data){
            alert('error!');
          }
        });
      },
      minLength: 2,
      select: function (event, ui){
        $("#preferred_loaction").val(ui.item.label);
        $("#preferred_id").val(ui.item.id);
        return false;
      },
    });


			
	})(jQuery);