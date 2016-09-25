(function(){

	angular
		.module('yapp')
		.controller('MyTicketsController',MyTicketsController);


	function MyTicketsController($state, $scope, UserService, AuthService,$stateParams){
		var vm = this;

		vm.filters = {};
		vm.filters.skip = 0;
		vm.filters.limit = 6;
		vm.user = AuthService.getUser();
		vm.filters.access_token = vm.user.id;
		vm.filters.user_id = vm.user.userId;
		vm.transactions = [];
		vm.UserTransactions = UserTransactions;

		// vm.openDialogBox4 = rootScope.openDialogBox4;
		
		function UserTransactions(){
			UserService.getTransactions(vm.filters)
				.query()
				.$promise
				.then(function(response){
					vm.transactions = vm.transactions.concat(response);
					vm.filters.skip = response.length;
				})
		}

		UserTransactions();
	}

})();