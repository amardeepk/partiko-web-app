'use strict';
angular.module('yapp')
  .factory('CategoryService', CategoryService);


function CategoryService($http,$resource,AppConstants){
  return{
    /**** GET API CALLS ****/
    getCategories : function(){
        return $resource(AppConstants.api_url + 'categories?filter[order]=event_count%20DESC')
    },

    getCategoryById : function (name){
      return $resource(AppConstants.api_url + 'categories?filter[where][name]='+name)
    },

    isCategoryExists : function(category_id){
      if(access_token){
        return $http.get(AppConstants.api_url + 'Categories/'+ category_id +'/exists?access_token=' + access_token);
      }
      else{
        return $http.get(AppConstants.api_url + 'Categories/'+ category_id +'/exists');
      }
    },

    getCategoriesCount : function (){
      if(access_token){
        return $http.get(AppConstants.api_url + 'Categories/count?access_token=');
      }
      else{
        return $http.get(AppConstants.api_url + 'Categories/count');
      }
    },


    /**** PUT API CALLS ****/

    changeCategoryById : function (categoryDto){
      return $http.put(AppConstants.api_url + 'Categories/'+ categoryDto.category_id +'?access_token=' + access_token, categoryDto);
    },


    /**** POST API CALLS ****/

    createCategory : function (categoryDto){
      return $http.post(AppConstants.api_url + 'Categories?access_token=' + access_token, categoryDto);
    },


    /**** DELETE API CALLS ***/

    deleteCategoryById : function(category_id){
      return $http.delete(AppConstants.api_url + 'Categories/'+ category_id +'?access_token=' + access_token);
    }

  };
};
