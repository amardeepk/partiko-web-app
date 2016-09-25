/**
 * Created by Rohan on 6/12/16.
 */
'use strict';
angular.module('yapp')
  .factory('EventService',['$http','$resource','AppConstants',function($http, $resource, AppConstants){
    return {

      searchEvents : function(filters){
        var x = new Date().getTime();
        var url = AppConstants.api_url + 'events?filter[where][and][0][status]=approved';
            url += '&filter[where][and][1][event_name][regexp]=' + filters.data;
            //url += '&filter[where][or][1][event_description][regexp]=' + filters.data;
            url += '&filter[include]=eventcategory';
            url += '&filter[order][1]=facebook_id';
            url += '&filter[order][0]=priority%20DESC';

        if(filters.price){
          url += '&filter[order][2]=min_price%20' + filters.price;
        }

        if(filters.date){
          url += '&filter[where][start_time][between][0]=' + filters.date.start;
          url += '&filter[where][start_time][between][1]=' + filters.date.end;
        }
        else{
          url += '&filter[where][and][2][start_time][gt]=' + x;
        }

        
        url += '&filter[limit]=' + filters.limit;
        url += '&filter[skip]=' + filters.skip;
        
        return $resource(url);
      },

      getEvents : function(filters){
        var x = new Date().getTime();
        var url = AppConstants.api_url + 'Events?filter[where][and][0][status]=approved&filter[include]=eventcategory';
        var flag = 0;
        var count=1;
        if(filters.category){
          flag = 1;
          url += '&filter[where][and][' +count+ '][category][regexp]=' + filters.category;
          count++
        }

        if(filters.date){
          url += '&filter[where][start_time][between][0]=' + filters.date.start;
          url += '&filter[where][start_time][between][1]=' + filters.date.end;
        }
        else{
          url += '&filter[where][and][' + count + '][start_time][gt]=' + x;
        }

        url += '&filter[order][0]=facebook_id';
        url += '&filter[order][1]=priority%20DESC';

        if(filters.price){
          url += '&filter[order][2]=min_price%20' + filters.price;
        }

        if(filters.skip){
          url += '&filter[skip]=' + filters.skip;
        }

        if(filters.limit){
          url += '&filter[limit]=' + filters.limit;
        }

        return $resource(url);
      },

      getEventById : function (eventId){
        
        return $resource(AppConstants.api_url + 'Events/' + eventId + '?filter[include]=tickets&filter[include]=eventcategory');
        
      },

      getEventInfo : function (event_id){
        var url = AppConstants.api_url + 'Events/' + event_id;
            url += '?filter[fields][event_id]=true';
            url += '&filter[fields][event_name]=true';
            url += '&filter[fields][category]=true';
        
        return $resource(url);

      }, 

      getEventByName : function (event_name){
        
        var url =  AppConstants.api_url + 'Events?';
            url += '?filter[include]=tickets&filter[include]=eventcategory&filter[where][and][0][event_name]=' + event_name;
            url += '&filter[where][and][1][status]=approved';
            
        return $resource(url);
      
      },

      purchaseTickets : function(){
        return $resource(AppConstants.api_url + 'Events/purchase?access_token=:access_token',
          {
            access_token : '@access_token'
          }
        );
      },

            // Get: user transaction

      getUserTransactionById : function(){
              return $resource(AppConstants.api_url + 'users/:id/transactions/:fk?filter[include]=eventsaccess_token=:access_token',{

                 access_token : '@access_token',
                    id: '@id',
                    fk: '@fk'
              });
      },

      isEventExists : function(eventId){
        if(access_token){
          return $http.get(AppConstants.api_url + 'Events/'+ eventId +'/exists?access_token=' + access_token);
        }
        else{
          return $http.get(AppConstants.api_url + 'Events/'+ eventId +'/exists');
        }
      },

      getTagsByEventId : function (eventId){
        if(access_token){
          return $http.get(AppConstants.api_url + 'Events/'+ eventId +'/tags?access_token=' + access_token);
        }
        else{
          return $http.get(AppConstants.api_url + 'Events/'+ eventId +'/tags');
        }
      },

      getTagsCount : function(eventId){
        if(access_token){
          return $http.get(AppConstants.api_url + 'Events/'+ eventId +'/tags/count?access_token=' + access_token);
        }
        else{
          return $http.get(AppConstants.api_url + 'Events/'+ eventId +'/tags/count');
        }
      },

      getTicketDetailsByEventId : function(eventId){

        return $resource(AppConstants.api_url + 'Events/'+ eventId +'/tickets');
        
      },

      getTicketTypeCount : function (eventId){
        if(access_token){
          return $http.get(AppConstants.api_url + 'Events/'+ eventId +'/tickets/count?access_token=' + access_token);
        }
        else{
          return $http.get(AppConstants.api_url + 'Events/'+ eventId +'/tickets/count');
        }
      },

      getAllTransactionsByEventId : function (eventId){
        if(access_token){
          return $http.get(AppConstants.api_url + 'Events/'+ eventId +'/transactions?access_token=' + access_token);
        }
        else{
          return $http.get(AppConstants.api_url + 'Events/'+ eventId +'/transactions');
        }
      },

      getAllTransactionsCountByEventId : function (eventId){
        if(access_token){
          return $http.get(AppConstants.api_url + 'Events/'+ eventId +'/transactions/count?access_token=' + access_token);
        }
        else{
          return $http.get(AppConstants.api_url + 'Events/'+ eventId +'/transactions/count');
        }
      },

      getAllEventsCount : function (){
        if(access_token){
          return $http.get(AppConstants.api_url + 'Events/count?access_token=' + access_token);
        }
        else{
          return $http.get(AppConstants.api_url + 'Events/count');
        }
      },

      getEventOwnerByEventId : function (event_id){
        if(access_token){
          return $http.get(AppConstants.api_url + 'Events/'+ event_id +'/user?access_token=' + access_token);
        }
        else{
          return $http.get(AppConstants.api_url + 'Events/'+ event_id +'/user');
        }
      },

      getTransactionCountByMerchantId : function (merchant_id){
        return $http.get(AppConstants.api_url + 'Events/totaltransactioncount?merchant_id='+ merchant_id +'&access_token=' + access_token);
      },

      /**** PUT API CALLS ****/

      changeEvent : function(eventDto){
        return $http.put(AppConstants.api_url + 'Events/'+ eventDto.event_id +'?access_token=' + access_token, eventDto);
      },


      /**** POST API CALLS ****/

      createEvent : function(eventDto){
        return $http.post(AppConstants.api_url + 'Events?access_token=' + access_token, eventDto);
      },

      addTicketTypeByEventId : function (ticketDto){
        return $http.post(AppConstants.api_url + 'Events/'+ ticketDto.event_id +'/tickets?access_token=' + access_token, ticketDto);
      },

      addTransactionByEventId : function (transactionDto){
        return $http.post(AppConstants.api_url + 'Events/'+ transactionDto.event_id +'/transactions?access_token=' + access_token, transactionDto);
      },

    
    /**/
      approveEventByEventId : function (event_id){
        return $http.post(AppConstants.api_url + 'Events/approve?access_token=' + access_token);
      },


      /**** DELETE API CALLS ***/

      deleteEvent : function (event_id){
        return $http.delete(AppConstants.api_url + 'Events/'+ event_id +'?access_token' + access_token);
      },

      deleteTagsByEventId : function (event_id){
        return $http.delete(AppConstants.api_url + 'Events/'+ event_id +'/tags?access_token=' + access_token);
      },

      deleteTicketTypeByEventId: function(event_id){
        return $http.delete(AppConstants.api_url + 'Events/'+ event_id +'/tickets?access_token=' + access_token);
      },

      deleteTransactionByEventId: function(event_id){
        return $http.delete(AppConstants.api_url + 'Events/' + event_id +'/transactions?access_token=' + access_token);
      },






    };
  }]);
