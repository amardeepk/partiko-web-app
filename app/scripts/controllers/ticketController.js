(function(){

	'use strict';

	angular
		.module('yapp')
		.controller('TicketController',TicketController);

		
	function TicketController ($scope,RAZORPAY_KEY,$mixpanel, $rootScope, $stateParams, AuthService, TransactionService,CategoryService, $state,EventService, ngDialog, $log, $timeout) { 

		var vm = this;
		vm.user = '';
		vm.data={};
		vm.transaction={};

		vm.id = $rootScope.transaction_id;

		vm.user=AuthService.getUser();

		vm.data.access_token=vm.user.access_token;
		vm.data.id = vm.id;

		vm.applyCoupon = applyCoupon;

		vm.finalAmount="";

		vm.promocode = '';
		vm.promomessage = '';

		var rzp1 = '';

		var trans_response = '';

		//"amount": "1000", // 2000 paise = INR 20

		// vm.options = {
		//     "key": RAZORPAY_KEY,
		//     "name": "Partiko Services Pvt Ltd",
		//     "description": "Purchase Description",
		//     "image": "images/new_logo.png",
		//     "handler": function (response){
		//         savePayment(response.razorpay_payment_id);
		//     },
		//     "prefill": {
		//         "name": "Harshil Mathur",
		//         "email": "harshil@razorpay.com"
		//     },
		//     "notes": {
		//         "address": "Hello World"
		//     },
		//     "theme": {
		//         "color": "#26a69a"
		//     }
		// };
		// 
		
		vm.options = {
		    "key": RAZORPAY_KEY,
		    "name": "Partiko Services Pvt Ltd",
		    "description": "Purchase Description",
		    "image" : "https://s3-ap-southeast-1.amazonaws.com/partiko-delhi/partiko-logo-120x120.jpg",
		    "handler": function (response){
		    	toastr.success("<span us-spinner></span> Payment Successful. Please wait while transaction is processing",{
		    		timeout: 10000,
		    		allowHtml : true
		    	})
		        savePayment(response.razorpay_payment_id).then(function(result){
		        	if(result == 'Success'){
		        		toastr.success("Success")
		        	}else{
		        		var message = "Sorry for inconvenience, Transaction was unsuccessful.";
		        			message += " Your money will be refunded automaatically within 3-4 days";
		        		toastr.error(message)
		        	}
		        })
		    },
		    "prefill": {
		        "name": "",
		        "email": ""
		    },
		    "notes": {
		        "address": "Partiko"
		    },
		    "theme": {
		        "color": "#26a69a"
		    }
		};

		function updateRazorPay(amount){
			var int_trans = amount * 100;
			vm.options.amount = parseInt(int_trans);
			rzp1 = new Razorpay(vm.options);
		}

		function getUserTransaction(){
			TransactionService.getTransaction(vm.data)
						.get()
						.$promise
						.then(function(response){	
							vm.transaction=response;
							
							vm.options.prefill.name = vm.user.firstname + ' ' + vm.user.lastname;
							vm.options.prefill.email=vm.user.email;
							if(vm.user.phone_number && vm.user.phone_number != ''){
								vm.options.prefill.contact = vm.user.phone_number;
							}
							//vm.options.prefill.email = 'support@razorpay.com';
							//console.log("response ",vm.finalAmount);

							var data = $rootScope.mixpanel_user;
							data.event_id = response.event_id;
							data.event_name = response.event.event_name;
							data.trans_id = response.transaction_id;
							data.amount = response.transaction_amount;
							data.credits = response.credits_applied;
							data.status = response.transaction_status;
							data.quantity = response.quantity;
							$mixpanel.track('Transaction',data)

							updateRazorPay(vm.transaction.transaction_amount);

							$("#rzp-button1").click(function(e){
							    rzp1.open();
							    e.preventDefault();
							});
							
					})

		}

		function savePayment(payment_id){

			var data = {};
			data.transaction_id = vm.id;
			data.payment_id = payment_id;
			data.status = 'approved';
			data.access_token = AuthService.getUser().id;

			TransactionService.savePayment(data.access_token).save(data).$promise.then(function(response){
				$state.go('mytickets');
				return "Success"
			},function(err){
				toastr.error(err);
				return "Error"
			})
		}

		getUserTransaction();

		function applyCoupon(){
			var data = {};
			data.trans_id = vm.transaction.transaction_id;
			data.promocode = vm.promocode;
			data.access_token = vm.data.access_token;

			TransactionService.applypromocode().save(data).$promise.then(function(response){
				if(response.result && response.result.error){
					vm.promomessage = response.result.error;
				}else{
					vm.promomessage = 'Coupon code applied successfully';
				}
				vm.promoresponse = response.result;
				
				if(response.result && response.result.amount > 0){
					vm.transaction.transaction_amount = response.result.amount;
					vm.finalAmount = vm.transaction.transaction_amount;
					updateRazorPay(vm.transaction.transaction_amount);
				}
				
			});
		}

	}


})();
