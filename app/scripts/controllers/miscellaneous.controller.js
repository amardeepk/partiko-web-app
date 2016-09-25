(function(){

	'use strict';

	angular.module('yapp')
  		.controller('ExtraTagsController', ExtraTagsController);

  	function ExtraTagsController($rootScope, page_name){

  		var vm = this;

  		var title 		= 'Partiko - Discover Your City';
  		var image 		= 'https://partiko.com/images/homeBg2.jpg';
  		var description =  'Discover Events in Your City ,We uncover the best events every day';
  		var url 		= 'https://partiko.com/';

	  	if(page_name == 'faq'){
	    	url = 'https://partiko.com/faq/'
	    	title = 'FAQ - Partiko';
	    	description = 'Frequently Asked Questions about Partiko';
	    }

	    else if(page_name == 'terms'){
	    	title = 'Terms and Conditions - Partiko';
	    	url = 'https://partiko.com/terms/';
	    	description = 'The following sets out the terms and condition for use of the Partiko website, application and our services.';
	    }

	    else if(page_name == 'privacy'){
	    	title = 'Privacy Policy - Partiko';
	    	url = 'https://partiko.com/privacy/';
	    	description = 'Website and App Privacy and Cookies Policy';
	    }

	    else if(page_name == 'media'){
	    	title = 'Media Coverage - Partiko';
	    	url = 'https://partiko.com/media/';
	    	description = 'Partiko in news. Our media coverage partners';
	    	image = 'https://partiko.com/images/media.jpg';
	    }

	    else if(page_name == 'event_partners'){
	    	title = 'Event Partners - Partiko';
	    	url = 'https://partiko.com/event-partners/';
	    	description = 'Our Partners';
	    	image = 'https://partiko.com/images/event.jpg';
	    }

	    else if(page_name == 'team'){
	    	title = 'Our Team - Partiko';
	    	url = 'https://partiko.com/team-members/';
	    	description = 'Meet our Rockstars. Less like a team, More like a Family.';
	    	image = 'https://partiko.com/images/team.jpg';
	    }

	    $rootScope.meta = {
			main : {
				title : title,
				description: description
			},

			itemprop : {
				name : title,
				image : description
			},

			og : {
				title : title,
				image : image,
				url : url,
				description: description
			},

			twitter : {
				title : title,
				image : image,
				url : url,
				description: description
			}
	    }
  	}

})();