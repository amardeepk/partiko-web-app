(function(){
	'use strict';

	/**
	 * @ngdoc function
	 * @name yapp.controller:MainCtrl
	 * @description
	 * # MainCtrl
	 * Controller of yapp
	 */
	angular
		.module('yapp')
		.controller('LoginController',LoginController);


	function LoginController($scope, AuthService, $mixpanel, $rootScope, $location, 
							ngDialog, $timeout,AUTH_EVENTS,USER_ROLES,Facebook,GooglePlus) {
		
		var vm = this;
		vm.loginData = {};
		vm.reset = {};
		vm.flag=0;
		vm.facebookLogin = facebookLogin;
		vm.googleLogin = googleLogin;
		vm.openSignIn = openSignIn;
		vm.openSignUp = openSignUp;
		vm.submitSignInForm = submitSignInForm;
		vm.resetPassword = resetPassword;
		vm.submitResetPasswordForm = submitResetPasswordForm;

		function submitResetPasswordForm(){
			$mixpanel.track('Forgot Password',vm.reset.email);
			AuthService.forgotPassword().save(vm.reset).$promise.then(function(success){
				toastr.success("Please check your mail for password reset instructions");
			},function(error){
				toastr.error("Email address not found");
			});
		}

		function resetPassword(){
			$mixpanel.track('Opened SignIn')

		    $timeout(function(){
		        ngDialog.open(
		        	{ 
		        		template: 'views/reset-password.html',
		        		className: 'ngdialog-theme-default', 
		        		controller: 'LoginController as vm'
		        	});
		    },400);
		}

	    function openSignIn(){
	      $mixpanel.track('Opened SignIn')

	      $timeout(function(){
	        ngDialog.open(
	        	{ 
	        		template: 'views/login2.html',
	        		className: 'ngdialog-theme-default', 
	        		controller: 'LoginController as vm'
	        	});
	      },400);
	    }

	    function openSignUp(){
	      $timeout(function(){
	        ngDialog.open(
	        	{ 
	        		template: 'views/sign-signup/signup.html',
	        		className: 'ngdialog-theme-default', 
	        		controller: 'SignUpController as vm'
	        	});
	      },400);
	    }

	    function submitSignInForm(){

            AuthService.login().save(vm.loginData).$promise.then(function (user) {
            	doLogin(user,'normal');
            }, 
            function (error) {
                if(error.status == -1){
                    toastr.error("Unable to reach the server")
                }
            });
	    }

	    function doLogin(user,type){
	    	var data = {}
			data.type = type;
			data.user_id = user.userId;
			data.email = user.email;
			$mixpanel.track('Login',data)

	    	$rootScope.$broadcast(AUTH_EVENTS.updateUser);
        	$scope.closeThisDialog();
            localStorage.setItem('userDetails', JSON.stringify(user));
            $rootScope.userDetails = JSON.parse(localStorage.getItem("userDetails"));
            AuthService.setUser(user);
            toastr.success("Login Successful");
            $rootScope.authenticated = 1;
            $rootScope.updateLogin();
        }

	    function facebookLogin(){
            Facebook.login(function(response){
            	if(response && response.authResponse && response.authResponse.accessToken){
            		vm.facebookConnect = 1;
                	var token = response.authResponse.accessToken;
                	AuthService.facebookLogin(token).get().$promise.then(function(response){
                		doLogin(response,'facebook');
                	})
            	}
            },{
                scope: 'email'
            })
        }

        function googleLogin(){
        	GooglePlus.login().then(function (authResult) {
	            if(authResult && authResult.access_token){
	            	vm.googleConnect = 1;
	            	var token = authResult.access_token;
	            	AuthService.googleLogin({token:token}).get().$promise.then(function(response){
                		doLogin(response,'google');
            		})
            	}
	        }, 
	        function (err) {
	        	console.log(err);
			});
       	}
	}

})();