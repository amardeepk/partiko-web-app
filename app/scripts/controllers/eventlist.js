(function(){

	'use strict';

	angular
		.module('yapp')
		.controller('EventListController',EventListController);


	function EventListController($scope,$mixpanel,$state,$rootScope, EventService, CategoryService, ngDialog, $log, $timeout){
		var vm   = this;
		$rootScope.meta = {
			main : {
				title: 'Events - Partiko',
				description : 'Discover Events in Your City ,We uncover the best events every day'
			},
			itemprop : {
				name : 'Events - Partiko',
				image : 'https://partiko.com/images/homeBg2.jpg/'
			},
			og : {
				title : 'Events - Partiko',
				image : 'https://partiko.com/images/homeBg2.jpg/',
				url : 'https://partiko.com/events/',
				description: 'Discover Events in Your City ,We uncover the best events every day'
			},
			twitter : {
				title : 'Events - Partiko',
				image : 'https://partiko.com/images/homeBg2.jpg/',
				url : 'https://partiko.com/events/',
				description: 'Discover Events in Your City ,We uncover the best events every day'
			}
		}

		vm.date = "Date";
		vm.price = 'Price';
		vm.filterByDate = filterByDate;
		vm.filterByPrice = filterByPrice;
		
		vm.events = [];
		vm.category = {
			background : '/images/homeBg2.jpg',
			name: 'All Events',
			caption: 'All Events Are Here'
		};

		vm.filters = {};
		vm.flag=0;

		vm.filters.skip=0;
		vm.filters.limit=12;

		vm.getEvents = getEvents;

		if($state && $state.params && $state.params.category){
			vm.filters.category = encodeURIComponent($state.params.category);
			var data = $rootScope.mixpanel_user;
			data.page = $state.params.category;
			$mixpanel.track('Page Event',data)
		}
		

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
					gap = 12 - start.getDay();

					if(gap < 1){
						gap = gap + 13;
					} 
				}

				if (vm.date == 1 || vm.date == 2){
					start.setDate(start.getDate() + gap)
					end.setDate(end.getDate() + gap)
				}

				vm.filters.date.start = start.getTime();
				vm.filters.date.end = end.getTime();
			}
			getEvents(1);
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
			getEvents(1);
		}

		function getEvents(data){
			// console.log("*******stateParams are ",$state.params);


			if(data && data == 1){
				vm.events = []
				vm.filters.skip=0;
				vm.flag=0;
							}
			var EventResource = EventService.getEvents(vm.filters);

			EventResource.query()
						.$promise
						.then(function(response){
							if (response.length==0) {
					vm.flag=1;
				}
				else{
					vm.events = vm.events.concat(response)
					vm.filters.skip += response.length;
				}
			})
		}

		function getCategoryById(){
			if($state && $state.params && $state.params.category){
				CategoryService.getCategoryById(encodeURIComponent($state.params.category))
							.query()
							.$promise
							.then(function(response){
								var data = response[0];
								var count = data.img_count;
								var value = new Date().getTime();
								value = value % count;

								if(value!=0){
									var url = data.background.split('.');
									var extention = url.pop();
									url = url.join('.');
									url = url + value.toString();
									data.background = url + '.' + extention;
								}
								vm.category = data;
								$rootScope.meta.itemprop.name = vm.category.name + ' Events - Partiko';
								$rootScope.meta.itemprop.image = vm.category.background;
								$rootScope.meta.og.image = vm.category.background;
								$rootScope.meta.og.title = vm.category.name + ' Events - Partiko';
								$rootScope.meta.og.url = 'https://partiko.com/events/' + vm.category.name.toLowerCase() + '/';
								$rootScope.meta.og.description = vm.category.caption;

								$rootScope.meta.twitter = $rootScope.meta.og;
								$rootScope.meta.main.title = $rootScope.meta.og.title;
								$rootScope.meta.main.description = $rootScope.meta.og.description;

							})
			}
		}
		getCategoryById();
		getEvents();
	}

})();