
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

$('.digit-group').find('input').each(function () {
  $(this).attr('maxlength', 1);
  $(this).on('keyup', function (e) {
    var parent = $($(this).parent());

    if (e.keyCode === 8 || e.keyCode === 37) {
      var prev = parent.find('input#' + $(this).data('previous'));

      if (prev.length) {
        $(prev).select();
      }
    } else if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode === 39) {
      var next = parent.find('input#' + $(this).data('next'));

      if (next.length) {
        $(next).select();
      } else {
        if (parent.data('autosubmit')) {
          parent.submit();
        }
      }
    }
  });
});


var bar = $('#progress_bar');
var percentage = parseInt($('#progress_percentage').html());

function stopProgress() {
  clearInterval(progress);
}

var progress = setInterval(function () {
  percentage++;
  if (percentage <= 100) {
    $('#progress_percentage').html(percentage + '%');
    if (percentage > 10) {
      bar.css('width', percentage + '%');
      console.log(percentage);
    }
  }
  else {
    stopProgress()
  }
}, 80);
$(".selectBox").on("click", function (e) {
  $(this).toggleClass("show");
  var dropdownItem = e.target;
  var container = $(this).find(".selectBox__value");
  container.text(dropdownItem.text);
  $(dropdownItem)
    .addClass("active")
    .siblings()
    .removeClass("active");
});
$(document).ready(function () {

  $(".smootScrol").mCustomScrollbar({
    axis: "yx",
    scrollbarPosition: "inside",
    // autoD
    raggerLength: true,
    mouseWheel: { enable: true },
  });

});
function morcontc() {
  document.getElementById('mor_contc').style.display = 'block';
}

function morcontcclose() {
  document.getElementById('mor_contc').style.display = 'none';
}

jQuery(document).ready(function ($) {
  $('#editControls a').click(function (e) {
    e.preventDefault();
    switch ($(this).data('role')) {
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

  $("#editor").keyup(function () {
    var value = $(this).html();
    $("#editorCopy").val(value);
  }).keyup();

  $('#checkIt').click(function (e) {
    e.preventDefault();
    alert($("#editorCopy").val());
  });
});

// carousel
let items = document.querySelectorAll('.carousel .carousel-item')

		items.forEach((el) => {
			const minPerSlide = 1
			let next = el.nextElementSibling
			for (var i=1; i<minPerSlide; i++) {
				if (!next) {
            // wrap carousel by using first child
            next = items[0]
        }
        let cloneChild = next.cloneNode(true)
        el.appendChild(cloneChild.children[0])
        next = next.nextElementSibling
    }
})

function clikheltcatg() {
  var element = document.getElementById("nav_rit");
  element.classList.add("mystyle");
}
function clikcomprr() {
  var element = document.getElementById("nav_rit");
  element.classList.remove("mystyle");
}
function clikwellometr() {
  var element = document.getElementById("nav_rit");
  element.classList.remove("mystyle");
}


function clikcomprr() {
  document.getElementById('down_rprt').style.display = 'none';
}
function clikheltcatg() {
  document.getElementById('down_rprt').style.display = 'block';
}
function clikwellometr() {
  document.getElementById('down_rprt').style.display = 'none';
}

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
function hwsav() {
  document.getElementById('edit_dv').style.display = 'block';
  document.getElementById('addpl_dv').style.display = 'none';
}

function editfaq() {
  document.getElementById('editfaq_e').style.display = 'block';
  document.getElementById('editfaq_v').style.display = 'none';
  document.getElementById('edit_qst').style.display = 'block';
  document.getElementById('edit_qst_v').style.display = 'none';
}


function ed_faq() {
  document.getElementById('editfaq_e').style.display = 'none';
  document.getElementById('editfaq_v').style.display = 'block';
  document.getElementById('edit_qst').style.display = 'none';
  document.getElementById('edit_qst_v').style.display = 'block';
}
function adfaq() {
  document.getElementById('add_faq_ent').style.display = 'block';
  document.getElementById('add_faq_ad_btn').style.display = 'none';
}
function faqlist() {
  document.getElementById('faq_q_a').style.display = 'block';
  document.getElementById('add_faq_dv').style.display = 'none';
}


function gndrdv() {  
  document.getElementById('selectgendr').style.display = 'block';  
  document.getElementById('selectethnic').style.display = 'none';  
  document.getElementById('selecthrtest').style.display = 'none';  
  document.getElementById('selectsympt').style.display = 'none';  
  document.getElementById('selectmstus').style.display = 'none';  
  document.getElementById('selectdpdncy').style.display = 'none';  
  document.getElementById('selectdibets').style.display = 'none';  
  document.getElementById('selectmsur').style.display = 'none';  
  document.getElementById('selectblodtst').style.display = 'none';  
  document.getElementById('selectage').style.display = 'none';  
  document.getElementById('selectcolstrl').style.display = 'none';  
}

function bkselage() {  
  document.getElementById('selectage').style.display = 'block';  
  document.getElementById('selectethnic').style.display = 'none';  
  document.getElementById('selecthrtest').style.display = 'none';  
  document.getElementById('selectsympt').style.display = 'none';  
  document.getElementById('selectmstus').style.display = 'none';  
  document.getElementById('selectdpdncy').style.display = 'none';  
  document.getElementById('selectdibets').style.display = 'none';  
  document.getElementById('selectmsur').style.display = 'none';  
  document.getElementById('selectblodtst').style.display = 'none';  
  document.getElementById('selectgendr').style.display = 'none';  
  document.getElementById('selectcolstrl').style.display = 'none';  

}
function slesymp(){  
  document.getElementById('selectsympt').style.display = 'block';  
  document.getElementById('selectethnic').style.display = 'none';  
  document.getElementById('selecthrtest').style.display = 'none';  
  document.getElementById('selectage').style.display = 'none';  
  document.getElementById('selectmstus').style.display = 'none';  
  document.getElementById('selectdpdncy').style.display = 'none';  
  document.getElementById('selectdibets').style.display = 'none';  
  document.getElementById('selectmsur').style.display = 'none';  
  document.getElementById('selectblodtst').style.display = 'none';  
  document.getElementById('selectgendr').style.display = 'none';  
  document.getElementById('selectcolstrl').style.display = 'none';  

}


function bkselgndr() {  
  document.getElementById('selectgendr').style.display = 'block';  
  document.getElementById('selectethnic').style.display = 'none';  
  document.getElementById('selecthrtest').style.display = 'none';  
  document.getElementById('selectage').style.display = 'none';  
  document.getElementById('selectmstus').style.display = 'none';  
  document.getElementById('selectdpdncy').style.display = 'none';  
  document.getElementById('selectdibets').style.display = 'none';  
  document.getElementById('selectmsur').style.display = 'none';  
  document.getElementById('selectblodtst').style.display = 'none';  
  document.getElementById('selectsympt').style.display = 'none';  
  document.getElementById('selectcolstrl').style.display = 'none';  

}
function slesmsts() {  
  document.getElementById('selectmstus').style.display = 'block';  
  document.getElementById('selectethnic').style.display = 'none';  
  document.getElementById('selecthrtest').style.display = 'none';  
  document.getElementById('selectage').style.display = 'none';  
  document.getElementById('selectgendr').style.display = 'none';  
  document.getElementById('selectdpdncy').style.display = 'none';  
  document.getElementById('selectdibets').style.display = 'none';  
  document.getElementById('selectmsur').style.display = 'none';  
  document.getElementById('selectblodtst').style.display = 'none';  
  document.getElementById('selectsympt').style.display = 'none';  
  document.getElementById('selectcolstrl').style.display = 'none';  

}


function bkselsympt(){  
  document.getElementById('selectsympt').style.display = 'block';  
  document.getElementById('selectethnic').style.display = 'none';  
  document.getElementById('selecthrtest').style.display = 'none';  
  document.getElementById('selectage').style.display = 'none';  
  document.getElementById('selectgendr').style.display = 'none';  
  document.getElementById('selectdpdncy').style.display = 'none';  
  document.getElementById('selectdibets').style.display = 'none';  
  document.getElementById('selectmsur').style.display = 'none';  
  document.getElementById('selectblodtst').style.display = 'none';  
  document.getElementById('selectmstus').style.display = 'none';  
  document.getElementById('selectcolstrl').style.display = 'none';  

}
function sledpdncy() {  
  document.getElementById('selectdpdncy').style.display = 'block';  
  document.getElementById('selectethnic').style.display = 'none';  
  document.getElementById('selecthrtest').style.display = 'none';  
  document.getElementById('selectage').style.display = 'none';  
  document.getElementById('selectgendr').style.display = 'none';  
  document.getElementById('selectsympt').style.display = 'none';  
  document.getElementById('selectdibets').style.display = 'none';  
  document.getElementById('selectmsur').style.display = 'none';  
  document.getElementById('selectblodtst').style.display = 'none';  
  document.getElementById('selectmstus').style.display = 'none';  
  document.getElementById('selectcolstrl').style.display = 'none';  

}


function bkselmstatus() {  
  document.getElementById('selectmstus').style.display = 'block';  
  document.getElementById('selectethnic').style.display = 'none';  
  document.getElementById('selecthrtest').style.display = 'none';  
  document.getElementById('selectage').style.display = 'none';  
  document.getElementById('selectgendr').style.display = 'none';  
  document.getElementById('selectsympt').style.display = 'none';  
  document.getElementById('selectdibets').style.display = 'none';  
  document.getElementById('selectmsur').style.display = 'none';  
  document.getElementById('selectblodtst').style.display = 'none';  
  document.getElementById('selectdpdncy').style.display = 'none';  
  document.getElementById('selectcolstrl').style.display = 'none';  

}
function sledethnic() {  
  document.getElementById('selectethnic').style.display = 'block';  
  document.getElementById('selectmstus').style.display = 'none';  
  document.getElementById('selecthrtest').style.display = 'none';  
  document.getElementById('selectage').style.display = 'none';  
  document.getElementById('selectgendr').style.display = 'none';  
  document.getElementById('selectsympt').style.display = 'none';  
  document.getElementById('selectdibets').style.display = 'none';  
  document.getElementById('selectmsur').style.display = 'none';  
  document.getElementById('selectblodtst').style.display = 'none';  
  document.getElementById('selectdpdncy').style.display = 'none';  
  document.getElementById('selectcolstrl').style.display = 'none';  

}


function bkselpdncy() {  
  document.getElementById('selectdpdncy').style.display = 'block';  
  document.getElementById('selectmstus').style.display = 'none';  
  document.getElementById('selecthrtest').style.display = 'none';  
  document.getElementById('selectage').style.display = 'none';  
  document.getElementById('selectgendr').style.display = 'none';  
  document.getElementById('selectsympt').style.display = 'none';  
  document.getElementById('selectdibets').style.display = 'none';  
  document.getElementById('selectmsur').style.display = 'none';  
  document.getElementById('selectblodtst').style.display = 'none';  
  document.getElementById('selectethnic').style.display = 'none';  
  document.getElementById('selectcolstrl').style.display = 'none';  

}
function selectmeasrmnt() {  
  document.getElementById('selectmsur').style.display = 'block';  
  document.getElementById('selectmstus').style.display = 'none';  
  document.getElementById('selecthrtest').style.display = 'none';  
  document.getElementById('selectage').style.display = 'none';  
  document.getElementById('selectgendr').style.display = 'none';  
  document.getElementById('selectsympt').style.display = 'none';  
  document.getElementById('selectdibets').style.display = 'none';  
  document.getElementById('selectdpdncy').style.display = 'none';  
  document.getElementById('selectblodtst').style.display = 'none';  
  document.getElementById('selectethnic').style.display = 'none';  
  document.getElementById('selectcolstrl').style.display = 'none';  

}
function bkselethnic() {  
  document.getElementById('selectethnic').style.display = 'block';  
  document.getElementById('selectmstus').style.display = 'none';  
  document.getElementById('selecthrtest').style.display = 'none';  
  document.getElementById('selectage').style.display = 'none';  
  document.getElementById('selectgendr').style.display = 'none';  
  document.getElementById('selectsympt').style.display = 'none';  
  document.getElementById('selectdibets').style.display = 'none';  
  document.getElementById('selectdpdncy').style.display = 'none';  
  document.getElementById('selectblodtst').style.display = 'none';  
  document.getElementById('selectmsur').style.display = 'none';  
  document.getElementById('selectcolstrl').style.display = 'none';  

}
function sledblodtst() {  
  document.getElementById('selectblodtst').style.display = 'block';  
  document.getElementById('selectmstus').style.display = 'none';  
  document.getElementById('selecthrtest').style.display = 'none';  
  document.getElementById('selectage').style.display = 'none';  
  document.getElementById('selectgendr').style.display = 'none';  
  document.getElementById('selectsympt').style.display = 'none';  
  document.getElementById('selectdibets').style.display = 'none';  
  document.getElementById('selectdpdncy').style.display = 'none';  
  document.getElementById('selectethnic').style.display = 'none';  
  document.getElementById('selectmsur').style.display = 'none';  
  document.getElementById('selectcolstrl').style.display = 'none';  

}

function bkseletmsur() {  
  document.getElementById('selectmsur').style.display = 'block';  
  document.getElementById('selectblodtst').style.display = 'none';  
  document.getElementById('selecthrtest').style.display = 'none';  
  document.getElementById('selectage').style.display = 'none';  
  document.getElementById('selectgendr').style.display = 'none';  
  document.getElementById('selectsympt').style.display = 'none';  
  document.getElementById('selectdibets').style.display = 'none';  
  document.getElementById('selectdpdncy').style.display = 'none';  
  document.getElementById('selectethnic').style.display = 'none';  
  document.getElementById('selectmstus').style.display = 'none';  
  document.getElementById('selectcolstrl').style.display = 'none';  

}
function sleddibets()  {  
  document.getElementById('selectdibets').style.display = 'block';  
  document.getElementById('selectblodtst').style.display = 'none';  
  document.getElementById('selecthrtest').style.display = 'none';  
  document.getElementById('selectage').style.display = 'none';  
  document.getElementById('selectgendr').style.display = 'none';  
  document.getElementById('selectsympt').style.display = 'none';  
  document.getElementById('selectmstus').style.display = 'none';  
  document.getElementById('selectdpdncy').style.display = 'none';  
  document.getElementById('selectethnic').style.display = 'none';  
  document.getElementById('selectmsur').style.display = 'none';  
  document.getElementById('selectcolstrl').style.display = 'none';  

}

function bkselblodtst() {  
  document.getElementById('selectblodtst').style.display = 'block';  
  document.getElementById('selecthrtest').style.display = 'none';  
  document.getElementById('selectdibets').style.display = 'none';  
  document.getElementById('selectage').style.display = 'none';  
  document.getElementById('selectgendr').style.display = 'none';  
  document.getElementById('selectsympt').style.display = 'none';  
  document.getElementById('selectmstus').style.display = 'none';  
  document.getElementById('selectdpdncy').style.display = 'none';  
  document.getElementById('selectethnic').style.display = 'none';  
  document.getElementById('selectmsur').style.display = 'none';  
  document.getElementById('selectcolstrl').style.display = 'none';  

}
function sledhrtest() {
  document.getElementById('selecthrtest').style.display = 'block';  
  document.getElementById('selectdibets').style.display = 'none';  
  document.getElementById('selectage').style.display = 'none';  
  document.getElementById('selectgendr').style.display = 'none';  
  document.getElementById('selectsympt').style.display = 'none';  
  document.getElementById('selectmstus').style.display = 'none';  
  document.getElementById('selectdpdncy').style.display = 'none';  
  document.getElementById('selectethnic').style.display = 'none';  
  document.getElementById('selectmsur').style.display = 'none';  
  document.getElementById('selectblodtst').style.display = 'none';  
  document.getElementById('selectcolstrl').style.display = 'none';  

}

function bkseldibets() {
  document.getElementById('selectdibets').style.display = 'block';  
  document.getElementById('selecthrtest').style.display = 'none';  
  document.getElementById('selectage').style.display = 'none';  
  document.getElementById('selectgendr').style.display = 'none';  
  document.getElementById('selectsympt').style.display = 'none';  
  document.getElementById('selectmstus').style.display = 'none';  
  document.getElementById('selectdpdncy').style.display = 'none';  
  document.getElementById('selectethnic').style.display = 'none';  
  document.getElementById('selectmsur').style.display = 'none';  
  document.getElementById('selectblodtst').style.display = 'none';  
  document.getElementById('selectcolstrl').style.display = 'none';  

}
function sledcolstrl() {
  document.getElementById('selectcolstrl').style.display = 'block';  
  document.getElementById('selecthrtest').style.display = 'none';  
  document.getElementById('selectage').style.display = 'none';  
  document.getElementById('selectgendr').style.display = 'none';  
  document.getElementById('selectsympt').style.display = 'none';  
  document.getElementById('selectmstus').style.display = 'none';  
  document.getElementById('selectdpdncy').style.display = 'none';  
  document.getElementById('selectethnic').style.display = 'none';  
  document.getElementById('selectmsur').style.display = 'none';  
  document.getElementById('selectblodtst').style.display = 'none';  
  document.getElementById('selectdibets').style.display = 'none';  

}

function bkselhrtest() {
  document.getElementById('selecthrtest').style.display = 'block';  
  document.getElementById('selectage').style.display = 'none';  
  document.getElementById('selectgendr').style.display = 'none';  
  document.getElementById('selectsympt').style.display = 'none';  
  document.getElementById('selectmstus').style.display = 'none';  
  document.getElementById('selectdpdncy').style.display = 'none';  
  document.getElementById('selectethnic').style.display = 'none';  
  document.getElementById('selectmsur').style.display = 'none';  
  document.getElementById('selectblodtst').style.display = 'none';  
  document.getElementById('selectdibets').style.display = 'none';  
  document.getElementById('selectcolstrl').style.display = 'none';  
}









