(function(){

	'use strict';

	angular
		.module('yapp')
		.controller('EventDetailController',EventDetailController)
		.controller('EventRedirectController',EventRedirectController);


	function EventRedirectController (EventService,$state,$stateParams,$location,$rootScope){
		
		var vm = this;

		EventService.getEventInfo($stateParams.event_id)
					.get()
					.$promise
					.then(function(response){
						var eventslug = $rootScope.slugify(response.event_name,response.event_id);
						$state.go('event_detail',{
							category : response.category.toLowerCase(),
							event_id : eventslug
						})
					});
	}

	function EventDetailController ($scope, $window, $rootScope, $stateParams, 
									$mixpanel, AuthService, CategoryService, $state,EventService, 
									ngDialog, $log, $timeout, $location,$sce){
		var vm   = this;

	    vm.user = '';
	    vm.event = {};
		vm.tickets = [];
		vm.data = {};
		vm.purchaseTickets = [];
		vm.transaction_id = null;
		var id = encodeURIComponent($stateParams.event_id);
		vm.total=0;	

		

        vm.curtime = new Date().getTime();
		
		var id_type = 'id';

        if(isNaN(id)){
        	var new_id = id.split('-').reverse()[0];

        	if(isNaN(new_id)){
        		id_type="name";
        	}else{
        		id = new_id;
        	}
        }
      
//     $scope.nexttab = function() { // bind click event to link
//     	console.log('nn');
//     $tabs.tabs('select', 2); // switch to third tab
//     return false;
// }
		function getEventDetail(){

			var EventResource;

			if(id_type == 'id') EventResource = EventService.getEventById(id);

			else EventResource = EventService.getEventByName(id);

			EventResource.get()
				.$promise
				.then(function(response){

					vm.url = 'https://partiko.com/' + response.category.toLowerCase() + '/';
						vm.url += $rootScope.slugify(response.event_name,response.event_id) + '/';

					$rootScope.meta.itemprop.name = response.event_name + ' - ' + response.category + ' - ' + response.city + ' - Partiko';
					$rootScope.meta.itemprop.image = response.img_url;
					$rootScope.meta.og.image = response.img_url;
					$rootScope.meta.og.title = response.event_name + ' - ' + response.category + ' - ' + response.city + ' - Partiko';;
					$rootScope.meta.og.url = vm.url;
					
					if(response.event_description == null){
						$rootScope.meta.og.description = '';
					}
					else
						$rootScope.meta.og.description = response.event_description.slice(0,150) + '...';

					$rootScope.meta.twitter = $rootScope.meta.og;

					$rootScope.meta.main.title = $rootScope.meta.og.title;
					$rootScope.meta.main.description = $rootScope.meta.og.description;

					vm.event=response;

			       

					var data = $rootScope.mixpanel_user;
					data.event_name = response.event_name;
					data.event_id = response.event_id;
					$mixpanel.track('View Event',data)

					for(var i=0;i<vm.event.tickets.length; i++){
						vm.event.tickets[i].qty=0;
						vm.tickets[i]=vm.event.tickets[i];
					}

					vm.data.event_id=vm.event.event_id;
					

				})
		}

		getEventDetail();


	
    $('.ckbox label').on('click', function () {
      $(this).parents('tr').toggleClass('selected');
    });

    $('.btn-filter').on('click', function () {
      var $target = $(this).data('target');
      if ($target != 'all') {
        $('.table tr').css('display', 'none');
        $('.table tr[data-status="' + $target + '"]').fadeIn('slow');
      } else {
        $('.table tr').css('display', 'none').fadeIn('slow');
      }
    });
		$scope.mymap = function() {

			var EventResource;

			if(id_type == 'id') EventResource = EventService.getEventById(id);

			else EventResource = EventService.getEventByName(id);

			EventResource.get()
				.$promise
				.then(function(response){
					vm.event=response;
					vm.map = {};
        vm.map.center = {};
        vm.map.center.latitude = '28.7041';
        vm.map.center.longitude = '77.1025';
        vm.map.zoom = 15;
					vm.map.center.latitude = response.latitude;
			        vm.map.center.longitude = response.longitude;
			        vm.map.marker = {};
			        vm.map.marker.latitude = response.latitude;
			        vm.map.marker.longitude = response.longitude;
			        vm.map.id = 1;
			        vm.map.link = "https://maps.google.com/maps?daddr=" + response.latitude + "," + response.longitude;



				})
       }


		$scope.renderHtml = function(html_code)
		{
		    return $sce.trustAsHtml(html_code);
		};
		$scope.increaseItemCount = function(item) {
			if(item.qty >= 12){
				toastr.error("You can buy maximum 12 Tickets of same type");
			}
			
			else if(item.tickets_total > item.tickets_sold + item.qty){
		    	item.qty++;
		    	vm.total=vm.total+(item.price);
		    }
		    else{
		    	toastr.error("Only " + item.qty + ' ' + item.title + " tickets are left");
		    }
		};

		$scope.decreaseItemCount = function(item) {
		    if (item.qty > 0) {
		      item.qty--;
		       vm.total=vm.total-(item.price);
		    }
		};

		$scope.finalTickets = function(){
			for(var i=0;i < vm.event.tickets.length; i++){
				vm.singleTicket={};

				if(vm.event.tickets[i].qty!=0){
					vm.singleTicket.ticket_id=vm.event.tickets[i].ticket_id;
					vm.singleTicket.quantity=vm.event.tickets[i].qty;
					vm.purchaseTickets.push(vm.singleTicket);
				}
			}

			vm.data.tickets= vm.purchaseTickets;
		}	

		$scope.purchase = function() {
			if(!AuthService.isAuthenticated()){
				toastr.error("Login is required");
				$rootScope.openDialogBox();
			}
			else{
				$scope.finalTickets();

				vm.user=AuthService.getUser();
				vm.data.access_token=vm.user.id;
				vm.data.user_id=vm.user.userId;

				
	            EventService.purchaseTickets()
	            	.save(vm.data)
	            	.$promise
	            	.then(function (response){
						$scope.transaction = response;
		            	if(!response.result.transaction_amount || response.result.transaction_amount=='0'){
		            		toastr.success("<span us-spinner></span> Payment Successful. Please wait while transaction is processing",{
					    		timeout: 10000,
					    		allowHtml : true
				    		})
				    		$state.go('mytickets');
		            	}
		            	else{
		            		$rootScope.transaction_id=response.result.transaction_id;
		            		$state.go('transaction_confirm');
		            	}
		            },
		            function(error) {
	    	            if(error.data && error.data.error && error.data.error.message)
	    	            	toastr.error(error.data.error.message)
	    	            else
	    	            	toastr.error("Sorry for inconvenience. Some problem occurred. Please try again later")
	        	    })
			}
	    }
	}
})();