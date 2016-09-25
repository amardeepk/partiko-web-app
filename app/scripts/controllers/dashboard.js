(function(){

	'use strict';

	angular
		.module('yapp')
		.controller('DashboardController',DashboardController);


	function DashboardController($scope, $rootScope, EventService, CategoryService, ngDialog, $log, $timeout){
		var vm = this;
		var filters = {};
		filters.limit = 9;
		filters.skip = 0;
		vm.getEvents = getEvents;

		function getEvents(){
			EventService.getEvents(filters)
						.query()
						.$promise
						.then(function(response){
							vm.events = response;
						})
		}

		getEvents();

		function getCategories(){
			CategoryService.getCategories()
						   .query()
						   .$promise
						   .then(function(response){
						   		vm.categories = response;
						   })
		}
		function openDialogBox3(next){
      if(next){
        $scope.next = next;
      }
      $timeout(function(){
        ngDialog.open(
          {
            template: 'views/app-only-pop.html',
            controller:'LoginController as vm',
            scope : $scope
          }
        ); 
      },400);
    }

		getCategories();	
	}

})();