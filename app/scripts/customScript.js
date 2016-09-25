$('.btn-number').click(function(e){e.preventDefault();fieldName=$(this).attr('data-field');type=$(this).attr('data-type');var input=$("input[name='"+fieldName+"']");var currentVal=parseInt(input.val());if(!isNaN(currentVal)){if(type=='minus'){if(currentVal>input.attr('min')){input.val(currentVal-1).change();}if(parseInt(input.val())==input.attr('min')){$(this).attr('disabled',true);}}else if(type=='plus'){if(currentVal<input.attr('max')){input.val(currentVal+1).change();}if(parseInt(input.val())==input.attr('max')){$(this).attr('disabled',true);}}}else{input.val(0);}});$('.input-number').focusin(function(){$(this).data('oldValue',$(this).val());});$('.input-number').change(function(){minValue=parseInt($(this).attr('min'));maxValue=parseInt($(this).attr('max'));valueCurrent=parseInt($(this).val());name=$(this).attr('name');if(valueCurrent>=minValue){$(".btn-number[data-type='minus'][data-field='"+name+"']").removeAttr('disabled')}else{alert('Sorry, the minimum value was reached');$(this).val($(this).data('oldValue'));}if(valueCurrent<=maxValue){$(".btn-number[data-type='plus'][data-field='"+name+"']").removeAttr('disabled')}else{alert('Sorry, the maximum value was reached');$(this).val($(this).data('oldValue'));}});$(".input-number").keydown(function(e){if($.inArray(e.keyCode,[46,8,9,27,13,190])!==-1||(e.keyCode==65&&e.ctrlKey===true)||(e.keyCode>=35&&e.keyCode<=39)){return;}if((e.shiftKey||(e.keyCode<48||e.keyCode>57))&&(e.keyCode<96||e.keyCode>105)){e.preventDefault();}});
  $(document).ready(function() {
          $("#slider").slider({
              animate: true,
              value:1,
              min: 0,
              max: 10000,
              step: 10,
              slide: function(event, ui) {
                  update(1,ui.value); //changed
              }
          });

          $("#slider2").slider({
              animate: true,
              value:0,
              min: 0,
              max: 500,
              step: 1,
              slide: function(event, ui) {
                  update(2,ui.value); //changed
              }
          });

          //Added, set initial value.
          $("#amount").val(0);
          $("#duration").val(0);
          $("#amount-label").text(0);
          $("#duration-label").text(0);
          
          update();
      });

      //changed. now with parameter
      function update(slider,val) {
        //changed. Now, directly take value from ui.value. if not set (initial, will use current value.)
        var $amount = slider == 1?val:$("#amount").val();
        var $duration = slider == 2?val:$("#duration").val();

        /* commented
        $amount = $( "#slider" ).slider( "value" );
        $duration = $( "#slider2" ).slider( "value" );
         */

         $total =($amount * 0.05);
          $totals =($amount * 0.03);
          $earnings=$amount-$totals-$total;
         $( "#amount" ).val($amount);
         $( "#amount-label" ).text($amount);
         $( "#duration" ).val($duration);
         $( "#duration-label" ).text($duration);
         $( "#total" ).val($total);
         $( "#total-label" ).text($total);
         $('#slider').html('<a><label><span class="glyphicon glyphicon-chevron-left"></span> '+$amount+' <span class="glyphicon glyphicon-chevron-right"></span></label></a>');
         $('#slider2').html('<label><span class="glyphicon glyphicon-chevron-left"></span> '+$duration+' <span class="glyphicon glyphicon-chevron-right"></span></label>');
      }
var scrollTimer, lastScrollFireTime = 0;
var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
if (isSafari) {
  alert('please use chrome for better experience :)');
};

// $(window).on('scroll', function() {

//     var minScrollTime = 100;
//     var now = new Date().getTime();
//     var totalheight=$(document).height();

//     function processScroll() {
//       $(window).on('scroll', function() {
//       scrollPosition = $(this).scrollTop();
      
//       if (scrollPosition >= totalheight-1250) {
//         $('#ticket').css('opacity','0');
//         $('.smallticket').css('display','none');
//       }
//       else if(scrollPosition >=430){
//         $('.static-ul').css('position','fixed');
//         $('.static-ul').css('top','50px');
//         $('#ticket').css('opacity','1');
//         $('#ticket').css('position','fixed');
//         $('#ticket').css('width','27.773889%');
//         $('#ticket').css('top','130px');
//         $('#ticket').css('right','8.33%');
//         $('#ticket').css('transition','opacity .5s ease');
//         $('.upticket').css('display','none');
//                 // Other function stuff here...
//       }
//       else{
//         $('.static-ul').css('position','relative');
//         $('#ticket').css('opacity','0');
//         $('.upticket').css('display','block');
//       }
//     });
//     }

//     if (!scrollTimer) {
//       if (now - lastScrollFireTime > (3 * minScrollTime)) {
//           processScroll();   // fire immediately on first scroll
//           lastScrollFireTime = now;
//       }
//       scrollTimer = setTimeout(function() {
//           scrollTimer = null;
//           lastScrollFireTime = new Date().getTime();
//           processScroll();
//       }, minScrollTime);
//     }
// });




