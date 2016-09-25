/**
 * Created by Rohan on 6/12/16.
 */
'use strict';
angular.module('yapp')
  .factory('TransactionService',TransactionService);

  function TransactionService($http,AppConstants,$resource){
    return{

      /**** GET API CALLS ****/

      getAllTransactions : function (){
        return $http.get(AppConstants.api_url + 'Transactions?access_token=' + access_token);
      },

      getTransaction : function (data){
        var url = AppConstants.api_url;
            url += 'Transactions/' + data.id;
            url += '?filter[include]=event';
            url += '&access_token=' + data.access_token;
            url += '&include=events';
        return $resource(url);
      },

      getEventDetailsByTransactionId : function (transaction_id){
        return $http.get(AppConstants.api_url + 'Transactions/'+ transaction_id +'/event?access_token=');
      },
      isTransactionExists : function (transaction_id){
        return $http.get(AppConstants.api_url + 'Transactions/'+ transaction_id +'/exists?access_token=' + access_token);
      },

      getUserDetailsBtTransactionId : function (transaction_id){
        return $http.get(AppConstants.api_url + 'Transactions/'+ transaction_id +'/user?access_token=' + access_token);
      },

      getTotalTransactionCount : function (){
        return $http.get(AppConstants.api_url + 'Transactions/count?access_token=' + access_token);
      },

      savePayment : function(access_token){
        return $resource(AppConstants.api_url + 'Transactions/savepaymentid?filter[access_token]=' + access_token );
      },

      /**** PUT API CALLS ****/
      editTransaction : function (transactionDto){
        return $http.put(AppConstants.api_url + 'Transactions/'+ transactionDto.transaction_id+'?access_token=' + access_token, transactionDto)
      },


      /**** POST API CALLS ****/

      createTransaction : function (transactionDto){
        return $http.post(AppConstants.api_url + 'Transactions?access_token=' + access_token, transactionDto);
      },

      applypromocode : function() {
        return $resource(AppConstants.api_url + 'coupons/applypromotioncode');
      },


      /**** DELETE API CALLS ***/

      deleteTransaction : function (transaction_id){
        return $http.delete(AppConstants.api_url + 'Transactions/'+ transaction_id +'?access_token=' + access_token);
      }


    };
  };
