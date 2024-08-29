/*
 Force users to download app via modal
 */
$(function () {

    var date = new Date();
    var timestamp = date.getTime();

    if (localStorage.getItem("isblackfridaypopup") === null) {
        localStorage.setItem("isblackfridaypopup", timestamp);
        openPopup();
    }
	console.log("b3");
	   console.log(timestamp - localStorage.getItem("isblackfridaypopup"));
	   console.log(parseInt(reopen_after_days)*86400000);
        //$("#blackfridayStoreModal").modal("show");

    if ((timestamp - localStorage.getItem("isblackfridaypopup") >= parseInt(delay_in_seconds)*1000) && (localStorage.getItem("isblackfridaypopupmodalshow") == null)) {
        //alert("test");
		console.log("b2");
	   console.log(timestamp - localStorage.getItem("isblackfridaypopup"));
	   console.log(parseInt(reopen_after_days)*86400000);
        $("#blackfridayStoreModal").modal("show");
        //1296000000
        localStorage.setItem("isblackfridaypopupmodalshow", 1);
    }else if((timestamp - localStorage.getItem("isblackfridaypopup") >=parseInt(reopen_after_days)*86400000 ) && (localStorage.getItem("isblackfridaypopupmodalshow") == 1)){
       console.log("b1");
	   console.log(timestamp - localStorage.getItem("isblackfridaypopup"));
	   console.log(parseInt(reopen_after_days)*86400000);
        localStorage.setItem("isblackfridaypopup", timestamp);
        localStorage.removeItem("isblackfridaypopupmodalshow");
        openPopup();
    }
    
    function openPopup() {
                var date = new Date();
                var timestamp = date.getTime();
            if ((timestamp - localStorage.getItem("isblackfridaypopup") >= parseInt(delay_in_seconds)*1000) && (localStorage.getItem("isblackfridaypopupmodalshow") === null)) {
                //alert("test1");
                $("#blackfridayStoreModal").modal("show");

                localStorage.setItem("isblackfridaypopupmodalshow", 1);
            }else{
                 setTimeout(function(){openPopup();}, 5000);
             
            }
       
    }

});
