(function(){
	'use strict';

	angular
		.module('yapp')
		.controller('SearchController',SearchController);


	function SearchController($scope, $mixpanel,EventService, $rootScope, $location, ngDialog){
		$rootScope.meta = {
	      main : {
	        title : 'Search Events - Partiko',
	        description: 'Search and Discover Events in Your City ,We uncover the best events every day'
	      },

	      itemprop : {
	        name : 'Search Events - Partiko',
	        image : 'https://partiko.com/images/homeBg2.jpg'
	      },

	      og : {
	        title : 'Search Events - Partiko',
	        image : 'https://partiko.com/images/homeBg2.jpg',
	        url : 'https://partiko.com/search',
	        description: 'Search and Discover Events in Your City ,We uncover the best events every day'
	      },
	      
	      twitter : {
	        title : 'Search Events - Partiko',
	        image : 'https://partiko.com/images/homeBg2.jpg',
	        url : 'https://partiko.com/search/',
	        description: 'Search and Discover Events in Your City ,We uncover the best events every day'
	      }
	    }



		var vm = this;
		vm.events = {};
		vm.data = '';
		vm.flag=0;
		vm.filters = {};
		vm.filters.limit = 6;
		vm.filters.skip = 0;
		
		vm.searchEvents = searchEvents;
		vm.date = "Date";
		vm.price = 'Price';
		vm.filterByDate = filterByDate;
		vm.filterByPrice = filterByPrice;

		function filterByDate(){
			if(vm.date && vm.date != 'Date'){
				var start,end;
				vm.filters.date = {};

				start = new Date();
				start.setHours(0,0,0,0);
				end = new Date();
				end.setHours(23,59,59,999)
				
				var gap = 1;
				
				if(vm.date == 2){
					gap = 6 - start.getDay();

					if(gap < 1){
						gap = gap + 7;
					} 
				}

				if (vm.date == 1 || vm.date == 2){
					start.setDate(start.getDate() + gap)
					end.setDate(end.getDate() + gap)
				}

				vm.filters.date.start = start.getTime();
				vm.filters.date.end = end.getTime();
			}
			searchEvents(1);
		}

		function filterByPrice(){
			if(vm.price && vm.price != 'price'){
				if(vm.price == 0){
					vm.filters.price = 'ASC'
				}
				else if(vm.price == 1){
					vm.filters.price = 'DESC'
				}
			}
			searchEvents(1);
		}

		function searchEvents(data){
			if(data && data == 1){
				vm.filters.skip = 0;
				vm.events = [];
				vm.flag=0;
			}
			vm.filters.data = vm.data;
			EventService.searchEvents(vm.filters).query({}).$promise.then(function(response){
				if (response.length==0) {
					vm.flag=1;
				}
				else{
					vm.events = vm.events.concat(response);
					vm.filters.skip += response.length;
				}
			})
		}
	}

})();