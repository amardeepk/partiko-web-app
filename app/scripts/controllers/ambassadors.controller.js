(function(){
	'use strict';

	angular.module('yapp')
		.controller('AmbassadorViewController', AmbassadorViewController)
		.controller('CreateAmbassadorController',CreateAmbassadorController);


	function AmbassadorViewController($scope,$rootScope,AmbassadorService,TYPE){
		
		$rootScope.meta = {
	      main : {
	        title : 'Campus Ambassadors - Partiko',
	        description: 'Meet our Ambassadors'
	      },

	      itemprop : {
	        name : 'Campus Ambassadors - Partiko',
	        image : 'https://www.partiko.com/images/campus.jpg'
	      },

	      og : {
	        title : 'Campus Ambassadors - Partiko',
	        image : 'https://partiko.com/images/campus.jpg',
	        url : 'https://partiko.com/campus/',
	        description: 'Meet our Ambassadors'
	      },
	      
	      twitter : {
	        title : 'Campus Ambassadors - Partiko',
	        image : 'https://partiko.com/images/campus.jpg',
	        url : 'https://partiko.com/campus/',
	        description: 'Meet our Ambassadors'
	      }
	    }

	    if(TYPE == 'brand'){
	    	$rootScope.meta.main.title = 'Brand Managers - Partiko';
	    	$rootScope.meta.main.description = 'Our Cool Marketeers';
	    	$rootScope.meta.itemprop.image = 'https://partiko.com/images/brand.jpg';

	    	$rootScope.meta.itemprop.name = $rootScope.meta.main.title;
	    	$rootScope.meta.og.title = $rootScope.meta.main.title;
	    	$rootScope.meta.og.image = $rootScope.itemprop.image;
	    	$rootScope.meta.og.url = 'https://partiko.com/brand/';
	    	$rootScope.meta.og.description = $rootScope.meta.main.description;

	    	$rootScope.meta.twitter = $rootScope.meta.og;
	    }
		
		var vm = this;
		vm.filter = {};
		vm.filter.type = TYPE;
		vm.scrollTo = scrollTo;

		AmbassadorService.getAmbassadors(vm.filter)
			.query({})
			.$promise
			.then(function(response){
				vm.ambassadors = response;
		})
	}

	function CreateAmbassadorController($scope,$rootScope,$window,Upload,$state,ProfileUploadUrl,AWS_URL,AmbassadorService,TYPE){

		$rootScope.meta = {
	      main : {
	        title : 'Become Campus Ambassador - Partiko',
	        description: 'Fill out the form to apply for Campus Ambassador @ Partiko'
	      },

	      itemprop : {
	        name : 'Become Campus Ambassador - Partiko',
	        image : 'https://www.partiko.com/images/campus.jpg'
	      },

	      og : {
	        title : 'Become Campus Ambassador - Partiko',
	        image : 'https://partiko.com/images/campus.jpg',
	        url : 'https://partiko.com/ambassador-form/',
	        description: 'Fill out the form to apply for Campus Ambassador @ Partiko'
	      },
	      
	      twitter : {
	        title : 'Become Campus Ambassador - Partiko',
	        image : 'https://partiko.com/images/campus.jpg',
	        url : 'https://partiko.com/ambassador-form/',
	        description: 'Fill out the form to apply for Campus Ambassador @ Partiko'
	      }
	    }

	    if(TYPE == 'brand'){
	    	$rootScope.meta.main.title = 'Become Brand Manager - Partiko';
	    	$rootScope.meta.main.description = 'Fill out the form to apply for Brand Manager @ Partiko';
	    	$rootScope.meta.itemprop.image = 'https://partiko.com/images/brand.jpg';

	    	$rootScope.meta.itemprop.name = $rootScope.meta.main.title;
	    	$rootScope.meta.og.title = $rootScope.meta.main.title;
	    	$rootScope.meta.og.image = $rootScope.itemprop.image;
	    	$rootScope.meta.og.url = 'https://partiko.com/manager-form/';
	    	$rootScope.meta.og.description = $rootScope.meta.main.description;

	    	$rootScope.meta.twitter = $rootScope.meta.og;
	    }

		var vm = this;
		vm.filter = {};
		vm.data = {};
		vm.submitForm = submitForm;
		vm.file = {};
		vm.filechange = fileChange;
		

		function fileChange(event){
			console.log(event);
			vm.source = URL.createObjectUrl(event.target.files[0])
		}

		$window.ddocument.querySelector("#nextbutton").addEventListener("click", function(){
		    $window.document.querySelector("#nextform").style.display = "block";
		    $window.document.querySelector("#nextbutton").style.display = "none";
		});


		function submitForm(){
			if(TYPE == 'campus'){
				vm.data.position = 0;
			}
			else{
				vm.data.position = 1;
			}

			if(!vm.data.firstname){
				toastr.error("Firstname can't be blank")
			}

			else if(!vm.data.email){
				toastr.error("Email can't be blank")
			}

			else if(!vm.data.phone_number){
				toastr.error("Phone Number can't be blank")
			}

			else if(!vm.data.college){
				toastr.error("College name can't be blank")
			}

			else if(!vm.data.city){
				toastr.error("City name can't be blank")
			}

			else if(Object.keys(vm.file).length > 0){
				var progess = false;
				Upload.upload({
                    url : ProfileUploadUrl,
                    file : vm.file
                }).then(function(res){
                    toastr.options = {
                        timeOut : 1000
                    }
                    var file = res.data.result.files.file[0];
                    var img_url = AWS_URL + file.name;
                    vm.data.profile_img_url = img_url;
                    saveAmbassador(vm.data);
                },function(err){
                	toastr.clear();
                    toastr.error("Unable to upload the file. Network connection terminated. Please Try Again")
                })

                toastr.options = {
                    progressBar : true,
                    timeOut : 100000
                }
                toastr.info("Please wait while image uploads")
			}
			else{
				saveAmbassador(vm.data);

			}
		}

		function saveAmbassador(data){
			AmbassadorService.createAmbassador()
				.save(data)
				.$promise
				.then(function(response){
						toastr.clear();
						toastr.success("Form submitted succesfuly.")
						if(response.position){
							$state.go('brand')
						}
						else{
							$state.go('campus')
						}
					},function(err){
						toastr.clear();
						var data = err.data.error.details.codes;
						if(data.email){
							if(data.email == 'uniqueness')
								toastr.error("Form with this email already submitted")
							else
								toastr.error("Please enter a valid email address")
						}
						else if(data.phone_number){
							if(data.phone_number == 'uniqueness')
								toastr.error("Form with this phone number already submitted")
							else
								toastr.error("Please enter a valid phone number")
						}
						else toastr.error("Sorry! Unable to save. Please try again later.")
					}
				);
		}
	}

})();