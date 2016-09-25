(function(){

	'use strict';

	angular.module('yapp')
  		.controller('MerchantController', MerchantController)


  	function MerchantController (page_name,$scope, $state, $uibModal, AuthService, UserService, $rootScope, ngDialog, $log, $timeout) {
    
      $rootScope.meta = {
        main : {
          title : 'Become Merchant - Partiko',
          description: 'Join Partiko and Sell your tickets at the speed of light.'
        },

        itemprop : {
          name : 'Become Merchant - Partiko',
          image : 'https://partiko.com/images/homeBg2.jpg'
        },

        og : {
          title : 'Become Merchant - Partiko',
          image : 'https://partiko.com/images/homeBg2.jpg',
          url : 'https://partiko.com/merchant-form/',
          description: 'Join Partiko and Sell your tickets at the speed of light.'
        },
        
        twitter : {
          title : 'Become Merchant - Partiko',
          image : 'https://partiko.com/images/homeBg2.jpg',
          url : 'https://partiko.com/merchant-form/',
          description: 'Join Partiko and Sell your tickets at the speed of light.'
        }
      }

      if(page_name == 'pricing'){
        var title = 'Event Pricing - Partiko';
        var description = 'Choose Plan, see what we are offering & see our payment modes.'
        var url = 'https://partiko.com/pricing';

        $rootScope.meta.main.title = title;
        $rootScope.meta.main.description = description;

        $rootScope.meta.itemprop.name = title;

        $rootScope.meta.og.title = title;
        $rootScope.meta.og.url = url;
        $rootScope.meta.og.description = description;

        $rootScope.meta.twitter = $rootScope.meta.og;

      }

  		var vm = this;
      vm.plan = 1;
  		vm.selectPlan = selectPlan;
  		vm.submitForm = submitForm;
  		vm.merchant = {};
      vm.merchant.user_type = 'merchant';
      vm.merchant.role = 'merchant'
      vm.merchant.status = 'pending';
      vm.confirmpassword = '';

  		function selectPlan(plan){
        vm.plan = plan;
        var $amount = slider == 1?val:$("#amount").val();
        if(vm.plan==1)
         {
          $total=0;
         }
         else if(vm.plan==2)
         {
          $total =($amount * (5/100));
         }
         else if(vm.plan==3)
         {
          $total =($amount * (10/100));
         }
         else if(vm.plan==4)
         {
          $total =($amount * (20/100));
         }
         $earnings=$amount-$total;
         $( "#total" ).val($total);
         $( "#total-label" ).text($total);
           $( "#earnings" ).val($earnings);
         $( "#earnings-label" ).text($earnings);
         
  			if(plan > 1){
  				vm.merchant.account_type = 1;
  			}
  			else{
  				vm.merchant.account_type = 0;
  			}
  		}
        $(document).ready(function () {
          console.log('kk');
      $('.static-ul a li').on('click', function () {
                console.log('kkk');
          $('.static-ul a li').removeClass('actively');
          $(this).addClass('actively');
      });
  });

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
       function update(slider,val) {
        //changed. Now, directly take value from ui.value. if not set (initial, will use current value.)
        var $amount = slider == 1?val:$("#amount").val();
        var $duration = slider == 2?val:$("#duration").val();

        /* commented
        $amount = $( "#slider" ).slider( "value" );
        $duration = $( "#slider2" ).slider( "value" );
         */
         if(vm.plan==1)
         {
          $total=0;
         }
         else if(vm.plan==2)
         {
          $total =($amount * (5/100));
         }
         else if(vm.plan==3)
         {
          $total =($amount * (10/100));
         }
         else if(vm.plan==4)
         {
          $total =($amount * (20/100));
         }
         $totals =($amount * 0.03);
         $earnings=$amount-$total;
         $( "#amount" ).val($amount);
         $( "#amount-label" ).text($amount);
         $( "#duration" ).val($duration);
         $( "#duration-label" ).text($duration);
         $( "#total" ).val($total);
         $( "#total-label" ).text($total);
         $( "#totals" ).val($totals);
         $( "#totals-label" ).text($totals);
          $( "#earnings" ).val($earnings);
         $( "#earnings-label" ).text($earnings);
         $('#slider a').html('<label><span class="glyphicon glyphicon-chevron-left"></span> '+$amount+' <span class="glyphicon glyphicon-chevron-right"></span></label>');
         $('#slider2 a').html('<label><span class="glyphicon glyphicon-chevron-left"></span> '+$duration+' <span class="glyphicon glyphicon-chevron-right"></span></label>');
      }

  		function submitForm(){
        if(!vm.merchant.password || !vm.confirmpassword || vm.merchant.password != vm.confirmpassword){
          toastr.error("Passwords dont match")
        }
        else if(!vm.merchant.firstname){
          toastr.error("First Name can't be blank")
        }
        else if(!vm.merchant.email){
          toastr.error("Email can't be blank")
        }
        else if(!vm.merchant.phone_number){
          toastr.error("Phone Number can't be blank")
        }
        else{
          var data = {};
          data.firstname = vm.merchant.firstname;
          data.lastname = vm.merchant.lastname;
          data.organisation = vm.merchant.organisation;
          data.email = vm.merchant.email;
          data.phone_number = vm.merchant.phone_number
          data.user_type='merchant';
          data.role = 'merchant';

          UserService.createUser()
            .save(data)
            .$promise
            .then(null,function(err){
                var error = err.data.error.details.messages;
                if(error){
                  if(error.username){
                    toastr.error("Username already taken")
                  }
                  else if(error.email){
                    toastr.error("Email id already exists")
                  }
                  else if(error.phone_number){
                    toastr.error("Phone Number is already associated with other account")
                  }
                  else{
                    data.password = vm.merchant.password;
                    $uibModal.open({
                      animation: true,
                      templateUrl: 'views/phoneverification.html',
                      controller: 'OTPVerificationController as vm',
                      size: 'sm',
                      resolve: {
                        userData : function(){
                          return vm.merchant;
                        }
                      }
                      })
                      .result.then(function(){
                        $location.path('/')
                      });
                  }
                }
              })
        }
  		}
  	}

})();