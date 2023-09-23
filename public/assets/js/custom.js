
        $(document).ready(function () {
            var $input = $('#form1 input:text'),
                $register = $('#button_id');

            $input.each(function () {
                if (!$(this).val()) {
                    $register.attr('disabled', true);
                    return false;
                }
            });
            $input.keyup(function () {
                var trigger = false;
                $input.each(function () {
                    if (!$(this).val()) {
                        trigger = true;
                    }
                });

                trigger ? $register.attr('disabled', true) : $register.removeAttr('disabled');

            });
        });
   
        $(".toggle-password").click(function () {
            $(this).toggleClass("fa-eye fa-eye-slash");
            var input = $($(this).attr("toggle"));
            if (input.attr("type") == "password") {
                input.attr("type", "text");
            } else {
                input.attr("type", "password");
            }
        });
       
        $('.digit-group').find('input').each(function() {
	$(this).attr('maxlength', 1);
	$(this).on('keyup', function(e) {
		var parent = $($(this).parent());
		
		if(e.keyCode === 8 || e.keyCode === 37) {
			var prev = parent.find('input#' + $(this).data('previous'));
			
			if(prev.length) {
				$(prev).select();
			}
		} else if((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode === 39) {
			var next = parent.find('input#' + $(this).data('next'));
			
			if(next.length) {
				$(next).select();
			} else {
				if(parent.data('autosubmit')) {
					parent.submit();
				}
			}
		}
	});
});
    

var bar=$('#progress_bar');
var percentage=parseInt($('#progress_percentage').html());

function stopProgress(){
  clearInterval(progress);
}

var progress= setInterval(function(){
  percentage++;
  if (percentage<=100){
    $('#progress_percentage').html(percentage+'%');
    if (percentage>10) {
      bar.css('width',percentage+'%');
      console.log(percentage);
    }
  }
  else {
    stopProgress()
  }
},80);
$(".selectBox").on("click", function(e) {
  $(this).toggleClass("show");
  var dropdownItem = e.target;
  var container = $(this).find(".selectBox__value");
  container.text(dropdownItem.text);
  $(dropdownItem)
    .addClass("active")
    .siblings()
    .removeClass("active");
});
$(document).ready(function(){

  $(".smootScrol").mCustomScrollbar({
    axis:"yx",
    scrollbarPosition: "inside",
    // autoD
    raggerLength: true,
    mouseWheel:{ enable: true },
});
  
});
function morcontc() {
  document.getElementById('mor_contc').style.display = 'block';
}

function morcontcclose() {
  document.getElementById('mor_contc').style.display = 'none';
}

jQuery(document).ready(function($) {
	$('#editControls a').click(function(e) {
		e.preventDefault();
		switch($(this).data('role')) {
			case 'h1':
			case 'h2':
			case 'h3':
			case 'p':
				document.execCommand('formatBlock', false, $(this).data('role'));
				break;
			default:
				document.execCommand($(this).data('role'), false, null);
				break;
		}

		var textval = $("#editor").html();
		$("#editorCopy").val(textval);
	});

	$("#editor").keyup(function() {
		var value = $(this).html();
		$("#editorCopy").val(value);
	}).keyup();
	
	$('#checkIt').click(function(e) {
		e.preventDefault();
		alert($("#editorCopy").val());
	});
});


function morcontc() {
  document.getElementById('mor_contc').style.display = 'block';
}

function morcontcclose() {
  document.getElementById('mor_contc').style.display = 'none';
}


function editpol() {
  document.getElementById('addpl_dv').style.display = 'block';
  document.getElementById('edit_dv').style.display = 'none';

}
function addtpol() {
  document.getElementById('edit_dv').style.display = 'block';
  document.getElementById('addpl_dv').style.display = 'none';
}