(function() {
	'use strict';

	angular
		.module('yapp')
		.factory('SettingService',SettingService);

	function SettingService(AppConstants,$resource){

		var settingservice = {};

		settingservice.notifyAppleApp = $resource(AppConstants.api_url + 'settings/notifyappleapp')

		return settingservice;
	}

})();