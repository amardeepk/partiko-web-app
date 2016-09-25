/**
 * Created by Rohan on 6/12/16.
 */
'use strict';
angular.module('yapp')
  .factory('AmbassadorService', AmbassadorService);
    
  function AmbassadorService($http,$resource,AppConstants){
    return{
      /**** GET API CALLS ****/

      getAmbassadors : function(filters){ 
        if(filters.type == 'campus')
          return $resource(AppConstants.api_url + 'Ambassadors?filter[where][status]=approved&filter[where][position]=0');
        
        else
          return $resource(AppConstants.api_url + 'Ambassadors?filter[where][status]=approved&filter[where][position]=1');
      },
      
      createAmbassador : function(){
        return $resource(AppConstants.api_url + 'ambassadors');
      },

      submitCV : $resource(AppConstants.api_url + 'ambassadors/uploadcv')
    }
  }

