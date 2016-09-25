(function (){

	'use strict';

	angular
		.module('yapp')
		.controller('SubmitCVController',SubmitCVController);


	function SubmitCVController($location,$scope,Upload,$rootScope,ResumeUploadUrl,$state,AWS_URL,AmbassadorService){

		$rootScope.meta = {
	      main : {
	        title : 'Careers - Partiko',
	        description: 'Work at Partiko. Empower events with technology.'
	      },

	      itemprop : {
	        name : 'Careers - Partiko',
	        image : 'https://partiko.com/images/team.jpg'
	      },

	      og : {
	        title : 'Careers - Partiko',
	        image : 'https://partiko.com/images/team.jpg',
	        url : 'https://partiko.com/careers/',
	        description: 'Work at Partiko. Empower events with technology.'
	      },
	      
	      twitter : {
	        title : 'Careers - Partiko',
	        image : 'https://partiko.com/images/team.jpg',
	        url : 'https://partiko.com/careers/',
	        description: 'Work at Partiko. Empower events with technology.'
	      }
	    }

		var vm = this;
		vm.data = {};
		vm.data.interested = [];
		vm.interests = [];
		vm.careers = [
			["Backend Developer(Node.js/Loopback)",false],
			["Frontend Developer(Angular.js)",false],
			["Frontend Designer(HTML/CSS/Bootstrap)",false],
			["Android Developer",false],
			["iOS Developer",false],
			["Business Developer",false],
			["Marketing",false],
			["Content Writer",false]
		]

		vm.job_type = ["Full Time","Internship"];

		vm.submitForm = submitForm;

		function submitForm(){
			vm.data.interested = []
			for(var i=0;i<vm.careers.length;i++){
				if(vm.careers[i][1] == true){
					vm.data.interested.push(vm.careers[i][0])
				}
			}
			if(!vm.data.firstname || vm.data.firstname == ' ') toastr.error("Please mention your name");
			else if(!vm.data.email || vm.data.email == ' ') toastr.error("Email id is required");
			else if(!vm.data.interested || vm.data.interested.length == 0) toastr.error("Please select atleast one interest");
			else if(!vm.data.job_type || vm.data.job_type == ' ') toastr.error("Please select one from Full Time/Internship")
			else{
				if(vm.file){
					var progess = false;
					Upload.upload({
	                    url : ResumeUploadUrl,
	                    file : vm.file
	                }).then(function(res){
	                    toastr.options = {
	                        timeOut : 1000
	                    }
	                    toastr.clear();
	                    var file = res.data.result.files.file[0];
	                    var resume_url = AWS_URL + file.name;
	                    vm.data.resume_url = resume_url;
	                    var send = {};
						send.data = vm.data;
						
						AmbassadorService.submitCV.save(send).$promise.then(function(response){
							toastr.success("Resume submitted Successfuly.")
							$location.path('/');
						})
	                },function(err){
	                	toastr.clear();
	                    toastr.error("Unable to upload the file. Network connection terminated. Please Try Again")
	                })
	                
	                toastr.options = {
	                    progressBar : true,
	                    timeOut : 100000
	                }
	                toastr.info("Please wait while resume/cv uploads")
				}
				else{toastr.error("Please provide a resume.")}
			}
		}

	}

})();