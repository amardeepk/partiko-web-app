	(function(){
	
	'use strict';
	angular
		.module('yapp')
	  	
	  	.constant('AppConstants', {
		//"api_url" : "http://0.0.0.0:4000/api/"
		"api_url" : "https://backend.partiko.com/api/"
	//	"api_url" : "http://testbackend.partiko.com/api/"
		})
		
		.constant('AWS_URL','https://partiko-v2.s3.amazonaws.com/')
		
		.constant('ProfileUploadUrl','https://backend.partiko.com/api/containers/partiko-v2/upload?type=profile')

		.constant('ResumeUploadUrl','https://backend.partiko.com/api/containers/partiko-v2/upload?type=resume')
		
		.constant('AUTH_EVENTS', {
			updateUser: 'update-user',
			notAuthorized: 'auth-not-authorized'
		})

		.constant('RAZORPAY_KEY','rzp_live_EITWeYCif80Fhi')
		// .constant('RAZORPAY_KEY','rzp_test_CtOyRY14wTWu9O')

		.constant('FACEBOOK_ID','825021260885774')

		.constant('GOOGLE_ID','567260938662-mauck8qqecjfv0n6lrnfv8eek4orflri.apps.googleusercontent.com')

		.constant('USER_ROLES', {
			admin: 'admin',
			manager: 'manager',
			merchant: 'merchant',
			user: 'user'
		})
})();
