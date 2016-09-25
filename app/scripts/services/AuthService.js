(function ()
{
    'use strict';

    angular
        .module('yapp')
        .factory('AuthService', AuthService);

    /** @ngInject */
    function AuthService(AppConstants, UserService, $window, $http, $location,$q, $rootScope, $resource, USER_ROLES, AUTH_EVENTS) {
        var authService 	= {},
 		userData  			= '',
		role			= '',		
		isAuthenticated	= false;

		if (window.localStorage.getItem("user_profile")) {
	    	var data = JSON.parse(window.localStorage.getItem("user_profile"));
	    	isAuthenticated = true;
	    	var id = data.role[0].roleId;
            if(id == 1)
            	role = USER_ROLES.admin;

        	else if(id == 2)
        		role = USER_ROLES.manager;

        	else if(id == 3)
        		role = USER_ROLES.merchant;

        	else
        		role = USER_ROLES.user;
	    }

		authService.login = function () {
			return $resource(AppConstants.api_url + 'users/login');
		};

		authService.forgotPassword = function() {
			return $resource(AppConstants.api_url + 'users/reset');
		};

		authService.facebookLogin = function (access_token){
			return $resource(AppConstants.api_url + 'auth/facebook/token?access_token=' + access_token);
		};

		authService.googleLogin = function (data){
			return $resource(AppConstants.api_url + 'auth/google/token?access_token=' + data.token);
		};

		authService.logout = function (data) {
			UserService
				.logout(authService.getUser().id)
				.save()
				.$promise
				.then(function(response){
						isAuthenticated = false;
					})
			$rootScope.authenticated = 0;
			$rootScope.isAuthenticated = false;
			if(!data) toastr.success("Logout Successful");
			$window.localStorage.clear();
			this.isAuthenticated = false;
	      	$rootScope.$broadcast(AUTH_EVENTS.updateUser);

	      	Smooch.logout().then(function(){
	      		Smooch.updateUser({
		          givenName: 'Anonymous',
		          surname: '',
		          email: ''
	        	})
	      	});
	      	
		};

		$rootScope.logout = authService.logout;
	 
		authService.getUser = function () {
			return JSON.parse(window.localStorage.getItem("user_profile"));
	  	}

		authService.setUser = function (res) {
			window.localStorage.setItem("user_profile", JSON.stringify(res));
            isAuthenticated = true;
            userData = res;
            var id = res.role[0].roleId;

            if(id == 1)
            	role = USER_ROLES.admin;

        	else if(id == 2)
        		role = USER_ROLES.manager;

        	else if(id == 3)
        		role = USER_ROLES.merchant;

        	else
        		role = USER_ROLES.user;

        	$rootScope.role = role;
	  	}

		authService.isAuthenticated = function () {
			return isAuthenticated;
		};

		authService.role = function () {
			return role;
		};
	 	
	 	// authService.getUserId = function(){
	 	// 	var data = JSON.parse(window.localStorage.getItem("user_profile"));
	 	// 	return data.userId;
	 	// }

		authService.isAuthorized = function (authorizedRoles) {
			if (!angular.isArray(authorizedRoles)) {
			  authorizedRoles = [authorizedRoles];
			}
			return (authService.isAuthenticated() && authorizedRoles.indexOf(role) !== -1);
		};
	 
	  	return authService;
    }

})();