(function(){

	'use strict';

	angular
		.module('yapp')
		
		.controller('SignUpController',SignUpController)

		.controller('OTPVerificationController',OTPVerificationController);

	function SignUpController($scope, $mixpanel, AuthService, UserService, $rootScope,$uibModal, $location, ngDialog, $timeout,AUTH_EVENTS,USER_ROLES){
		$rootScope.meta = {
	      main : {
	        title : 'Signup - Join Partiko',
	        description: 'Join Us and Discover Events in Your City ,We uncover the best events every day'
	      },

	      itemprop : {
	        name : 'Signup - Join Partiko',
	        image : 'https://partiko.com/images/homeBg2.jpg'
	      },

	      og : {
	        title : 'Signup - Join Partiko',
	        image : 'https://partiko.com/images/homeBg2.jpg',
	        url : 'https://partiko.com/signup/',
	        description: 'Join Us and Discover Events in Your City ,We uncover the best events every day'
	      },
	      
	      twitter : {
	        title : 'Signup - Join Partiko',
	        image : 'https://partiko.com/images/homeBg2.jpg',
	        url : 'https://partiko.com/signup/',
	        description: 'Join Us and Discover Events in Your City ,We uncover the best events every day'
	      }
	    }

		var vm = this;

		vm.signupform = {};

		vm.doSignUp = doSignUp;

		function doSignUp(){
			var data = new Object();

			console.log(vm.signupform);
			data.firstname = vm.signupform.name.split(' ').slice(0,-1).join(' ');
			data.lastname = vm.signupform.name.split(' ').reverse()[0];
			data.username = vm.signupform.username;
			data.email = vm.signupform.email;
			data.phone_number = vm.signupform.phone_number
			data.user_type='user';
			data.role = 'user';
			$mixpanel.track('Opened SignUp')

			UserService.createUser().save(data).$promise.then(null,function(err){
				console.log(err);
				var error = err.data.error.details.codes;
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
						data.password = vm.signupform.password;
						$uibModal.open({
							animation: true,
							templateUrl: 'views/phoneverification.html',
							controller: 'OTPVerificationController as vm',
							size: 'sm',
							resolve: {
								userData : function(){
									return data;
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

	function OTPVerificationController($scope,$rootScope, $mixpanel, $location,AUTH_EVENTS, $uibModalInstance,AuthService,UserService,OTPService, userData){
		var vm = this;
		vm.status = 1;
		vm.phone_number = userData.phone_number
		vm.otp = '';

		vm.sendOTP = sendOTP;
		vm.verifyOTP = verifyOTP;

		var verifyData = new Object();
		verifyData.phone_number = vm.phone_number;

		function sendOTP(){
			OTPService.sendOTP().save(verifyData).$promise.then(function(response){
				toastr.success("OTP Sent to " + vm.phone_number)
				vm.status=0;
			})
		}
		
		sendOTP();
		
		function verifyOTP(){
			verifyData.oneTimePassword = vm.otp;
			vm.status=1;
			OTPService.verifyOTP().save(verifyData).$promise
				.then(function(response){
					userData.refresh_token = response.refresh_token;
					createUser(userData); 
					
				},function(error){
					toastr.error("Invalid OTP")
					vm.status=0;
				})
		}

		function createUser(userData){
			UserService
				.createUser()
				.save(userData)
				.$promise
				.then(function(response){
					if(response.user_type == 'user')
						doLogin(userData);
					else{
						toastr.success("Thanks for registering with Partiko. We will contact you soon");
						$uibModalInstance.close();
						$location.path('/')
					}
				},function(error){
					console.log(error)
				})
		}

		function doLogin(userData){
			var logindata = new Object();
			logindata.username = userData.username;
			logindata.password = userData.password;
			AuthService.login()
						.save(logindata)
						.$promise
						.then(function(user){
							$rootScope.$broadcast(AUTH_EVENTS.updateUser);
				            localStorage.setItem('userDetails', JSON.stringify(user));
				            $rootScope.userDetails = JSON.parse(localStorage.getItem("userDetails"));
				            AuthService.setUser(user);
				            toastr.success("Login Successful");
				            $rootScope.authenticated = 1;
				            $rootScope.updateLogin();
				            $uibModalInstance.close();
            			})
		}
	}

})();