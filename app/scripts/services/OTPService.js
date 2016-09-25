(function(){

	'use strict';

	angular
		.module('yapp')

		.factory('OTPService',OTPService);


	function OTPService(AppConstants, $resource){
		
		var otpService = {};

		otpService.sendOTP = function(){
			return $resource(AppConstants.api_url + 'users/generateotp')
		}

		otpService.verifyOTP = function(){
			return $resource(AppConstants.api_url + 'users/verifyotp')
		}

		return otpService;
	}

})();