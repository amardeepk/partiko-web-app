/**
 * Created by Rohan on 6/12/16.
 */
'use strict';
angular.module('yapp')
  .factory('FestService',['$http','AppConstants',function ($http, AppConstants){
    return{

      /**** GET API CALLS ****/
      getAllFests: function (){
        return $http.get(AppConstants.api_url + 'Fests?access_token=' + access_token);
      },

      getFestById: function(festId){
        return $http.get(AppConstants.api_url + 'Fests/' + festId + '?access_token=' + access_token);
      },

      isFestExists: function(festId){
        return $http.get(AppConstants.api_url + 'Fests/'+ festId +'/exists?access_token=' + access_token);
      },

      getFestsCount: function(){
        return $http.get(AppConstants.api_url + 'Fests/count?access_token=' + access_token);
      },


      /**** PUT API CALLS ****/

      changeFest: function(festDto){
        return $http.put(AppConstants.api_url + 'Fests/'+ festDto.fest_id +'?access_token=' + access_token,festDto);
      },


      /**** POST API CALLS ****/

      createFest: function(festDto){
        return $http.post(AppConstants.api_url + 'Fests?access_token=' + access_token,festDto);
      },


      /**** DELETE API CALLS ***/

      deleteFestById: function(festId){
        return $http.delete(AppConstants.api_url + 'Fests/' + festId +'?access_token=' + access_token);
      }
    };
  }]);
