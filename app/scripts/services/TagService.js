(function(){

  'use strict';

  angular.module('yapp')
    .factory('TagService',TagService);

  function TagService($http, $resource, AppConstants){
    var tagservice = {};

    tagservice.getTagsById = function (data){
      var url = AppConstants.api_url + 'tags?filter[where][tag_id][inq]=0';
      var query = '&filter[where][tag_id][inq]=';
      for(var i=0;i<data.length;i++){
        url += query + data[i]; 
      }
      return $resource(url)
    }

    return tagservice;
  }

})();
