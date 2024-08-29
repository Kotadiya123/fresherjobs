/*
 NPS Feedback Survey Modal
 */
$(function () {

    if (is_logged_in > 0) {
        var date = new Date();
        var timestamp = date.getTime();


        if (localStorage.getItem("logged_in") == null) {
            localStorage.setItem("logged_in", timestamp);
        }

        if ((timestamp - localStorage.getItem("logged_in") > 1200) && controller_name!='Cartlive') {
            $.ajax({
                url: ajxUrl + "/isNpsValidUser",
                type: "post",
                data: JSON.stringify({

                    controller: controller_name
                }),
                headers: {
                    "X-CSRF-Token": header_register_csrf_token,
                },
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    //console.log(data);
                    if (data.status) {

                        $("#npsModalV2").modal("show");
                    }

                },
            });

        }
    } else {
        localStorage.removeItem("logged_in");
    }
    for (i = 0; i <= 6; i++) {

        $('.btn-scale-desc-' + i).attr('style', `background: #FFBABA !important; border-color:#DC3545`);

    }
    for (i = 7; i <= 8; i++) {

        $('.btn-scale-desc-' + i).attr('style', `background: #F9F28C !important; border-color:#9F6000`);

    }
    for (i = 9; i <= 10; i++) {

        $('.btn-scale-desc-' + i).attr('style', `background:#ACE498  !important; border-color:#277124`);

    }
    var rating = '';
    var q = '';
    var response = '';
    var feedback_emoji = '';
    $(".ask_later_btn").text('ask later');
    $(".npsbtn").click(function (e) {

        // console.log($(this).val());
        $(".ask_later_btn").text('cancel');
        e.preventDefault();
        rating = $(this).val();
        $(".npsbtn").removeAttr("style");
        $('#saveReview').css('display', 'inline-block');

        if (rating < 7) {
            q = 'What was missing in your experience?';
            response = 'Thank you for your feedback. We value your suggestions and we will work on it to further improve our services.';
            feedback_mooji = `<img src="https://d24uab5gycr2uz.cloudfront.net/uploads/white_theme/images/nps_sad.webp" style="left:${1.6+(rating)*9}%;">`;
            color = '#FFBABA';
            borderColor = '#DC3545'
            $('.btn-scale-desc-' + rating).attr('style', `background: ${color} !important; border-color:${borderColor};border-left:1px solid ${borderColor}!important`);

        } else if ((rating > 6) && (rating < 9)) {
            q = 'How can we improve our services better?';
            response = 'Thank you for your feedback. We appreciate your ideas and would be happy to work on them.';
            feedback_mooji = `<img src="https://d24uab5gycr2uz.cloudfront.net/uploads/white_theme/images/nps_confused.webp" style="left:${1.8+(rating)*9}%;">`;
            color = '#F9F28C';
            borderColor = '#9F6000'
            $('.btn-scale-desc-' + rating).attr('style', `background: ${color} !important; border-color:${borderColor};border-left:1px solid ${borderColor}!important`);

        } else {
            q = 'What do you like the most about us?';
            response = 'Thank you, we are thrilled to know that you like our services. Do recommend us to your friends and family.';
            feedback_mooji = `<img src="https://d24uab5gycr2uz.cloudfront.net/uploads/white_theme/images/nps_smile.webp" style="left:${2+(rating)*9}%;">`;
            color = '#ACE498';
            borderColor = '#277124'
            $('.btn-scale-desc-' + rating).attr('style', `background: ${color} !important; border-color:${borderColor};border-left:1px solid ${borderColor}!important`);

        }



        $("#review").show();
        $("#review .review_submit_text").html(q);
        $("#reviewTxt").focus();
        $(".feedback_emoji").html(feedback_mooji);

    });


    $("#saveReview").click(function (e) {
        //
        e.preventDefault();


        var feedback = $("#reviewTxt").val();

        if (feedback == '') {
            $('.required_text').html('Please give your feedback.');
            $("#reviewTxt").focus();
            setTimeout(() => {
                $('.required_text').html('');
              }, 2000);
            return false;

        }

        $(this).attr('disabled', true);
        $(this).off(e);


        var userfeedback = [{'rating': rating, 'question': 'How likely are you to recommend Easy Earnings to your friends and family?', 'feedback': '', 'url': current_url}];

        userfeedback.push({'question': q, 'feedback': feedback, 'rating': '', 'url': current_url});

        $.ajax({
            url: ajxUrl + "/saveNps",
            type: "post",
            data: JSON.stringify(userfeedback),
            headers: {
                "X-CSRF-Token": header_register_csrf_token,
            },
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
              if(data.success === 1){
             $('.user_feedback_data').html(` <div class="user_feedback_acc_popup">
             <p class="thankyou_heading">
                 ${data.msg}
             </p>
             <img src="https://d24uab5gycr2uz.cloudfront.net/uploads/white_theme/images/nps_thankyougif.gif" alt="">
             <p class="text-center mb-2" style="line-height:24px;">
             ${response}
             </p>
         </div>`);
                // $('.modal-body').addClass('pb-2');
                // $('.modal-body').html('<div class=" text-center"><p style="border: 3px solid #20d00b; color: #20d00b; font-size: 35px;  width: 60px; height: 60px; line-height: 60px; margin: auto; border-radius: 50px;"><i class="fa fa-check"></i></p><h4 style="font-size: 1.5rem;line-height:2.5rem;">' + response + '</h4></div>');

                localStorage.removeItem("logged_in");
            } else if(data.success === 0){
                 $('.user_feedback_data').html(` <div class="user_feedback_acc_popup">
             <p class="thankyou_heading">
                 ${data.msg}
             </p>
             <p class="text-center mb-2" style="line-height:24px;">
             ${response}
             </p>
         </div>`);
            }

            },
        });
    });

    $("#npsSkip, .ask_later_btn").click(function (e) {

        $.ajax({
            url: ajxUrl + "/skipNps",
            type: "post",

            headers: {
                "X-CSRF-Token": header_register_csrf_token,
            },
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                $("#npsModal").modal("hide");
                return false;


            },
        });

    });


    //session data log API call
    var s_visitor_code = sessionStorage.getItem('s_visitor_code')
    if (s_visitor_code === null) {
        s_visitor_code = UUIDv4.generate()
        sessionStorage.setItem('s_visitor_code', s_visitor_code)

        var token = sessionStorage.getItem('device_token')

        var post_data = {
            visitor_code: s_visitor_code,
            token: token
        }

        $.ajax({
            url: ajxUrl + '/sessioncapture',
            type: "post",
            data: JSON.stringify(post_data),
            headers: {
                "X-CSRF-Token": header_register_csrf_token,
            },
            success: function (data, textStatus, jqXHR) {
                console.log(data)
            }
        })
    }

});
var UUIDv4 = new function () {
    function generateNumber(limit) {
        var value = limit * Math.random();
        return value | 0;
    }

    function generateX() {
        var value = generateNumber(16);
        return value.toString(16);
    }

    function generateXes(count) {
        var result = '';
        for (var i = 0; i < count; ++i) {
            result += generateX();
        }
        return result;
    }

    function generateVariant() {
        var value = generateNumber(16);
        var variant = (value & 0x3) | 0x8;
        return variant.toString(16);
    }
    ;

    // UUID v4
    //
    //   varsion: M=4
    //   variant: N
    //   pattern: xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx
    //
    this.generate = function () {
        var result = generateXes(8)
                + '-' + generateXes(4)
                + '-' + '4' + generateXes(3)
                + '-' + generateVariant() + generateXes(3)
                + '-' + generateXes(12)
        return result;
    };
};
