(function(){

	'use strict';

	angular
		.module('yapp')
		.controller('ProfileController',ProfileController);


	function ProfileController($scope,UserService, TagService, AuthService, $mixpanel, $rootScope){
		var vm = this;

		vm.user = {};
		vm.filters = {};
		vm.filters.skip=0;
		vm.filters.limit = 6;
		var token = AuthService.getUser();
		vm.filters.access_token = token.id;
		vm.filters.user_id = token.userId;
		vm.transactions = [];
		vm.getTransactions = getTransactions;

		UserService.getUserById(vm.filters).get().$promise.then(function(response){
			vm.user = response;
			var detail = response.userDetail;
			if(detail && detail.length != 0 && detail.favourites && detail.favourites.length != 0){
				console.log(detail.favourites);
				var tags = detail.favourites;
				TagService.getTagsById(tags).query({}).$promise.then(function(data){
					vm.tags = data;
				})
			}
		})
		
		function getTransactions(){
			UserService.getTransactions(vm.filters)
				.query()
				.$promise
				.then(function(response){
					vm.transactions = response
				})
		}
	}
})();