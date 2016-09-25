/**
 * Created by Rohan on 6/12/16.
 */
'use strict';
angular.module('yapp')
  .factory('UserService',UserService);


  function UserService($resource, AppConstants){
    return{

      /**** GET API CALLS ****/

      createUser : function(){
        return $resource(AppConstants.api_url + 'users')
      },

      getUserById : function(data){
        return $resource(AppConstants.api_url + 'users/' + data.user_id + '?access_token=' + data.access_token + '&filter[include]=userDetail');
      },

      getProfilePhoto : function(user_id,access_token){
        return $resource(AppConstants.api_url + 'users/' + user_id + '?access_token=' + access_token + '&filter[fields][profile_img_url]=true')
      },

      getTransactions : function(filters){
        var url = AppConstants.api_url + 'users/' + filters.user_id + '/transactions?';
        url    += 'filter[include]=event&access_token=' + filters.access_token;
        url    += '&filter[skip]=' + filters.skip + '&filter[limit]=' + filters.limit;
        url    += '&filter[where][and][0][transaction_status][neq]=pending&filter[where][and][1][transaction_status][neq]=failed';
        url    += '&filter[order]=transaction_time%20DESC';
        
        return $resource(url)
      },

      /**** POST API CALLS ****/

      logout : function (access_token){
        return $resource(AppConstants.api_url + 'users/logout?access_token=' + access_token);
      }

    };
};
