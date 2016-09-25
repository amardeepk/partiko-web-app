'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of yapp
 */
angular.module('yapp')
  .controller('BaseCtrl', BaseCtrl)


  function BaseCtrl ($scope, AuthService, SettingService, $location,$anchorScroll, UserService, $rootScope,CategoryService, ngDialog, $log, $timeout) {
    var vm = this;

    $rootScope.openDialogBox = openDialogBox;
    $rootScope.scrollTo = scrollTo;
    
    $rootScope.meta = {
      main : {
        title : 'Partiko - Discover Your City',
        description: 'Discover Events in Your City ,We uncover the best events every day'
      },

      itemprop : {
        name : 'Partiko - Discover Your City',
        image : 'https://partiko.com/images/homeBg2.jpg'
      },

      og : {
        title : 'Partiko - Discover Your City',
        image : 'https://partiko.com/images/homeBg2.jpg',
        url : 'https://partiko.com/',
        description: 'Discover Events in Your City ,We uncover the best events every day'
      },
      
      twitter : {
        title : 'Partiko - Discover Your City',
        image : 'https://partiko.com/images/homeBg2.jpg',
        url : 'https://partiko.com/',
        description: 'Discover Events in Your City ,We uncover the best events every day'
      }
    }

    $rootScope.mixpanel_user = {
      type : 'anonymous'
    }

    $rootScope.slugify = function(data,str){
      if(!data || data == undefined) return;

      if(str) data += ' ' + str;
      
      return data.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
    }

    vm.getCategories = getCategories;
    vm.logout = AuthService.logout;
    vm.categories = '';
    vm.user = '';
    $rootScope.updateLogin = updateLogin;
    $scope.submitEmail = submitEmail;
    $rootScope.openDialogBox4 = openDialogBox4;
    $rootScope.authenticated = 0;
    vm.size=20;

    function updateLogin(){
      if(AuthService.isAuthenticated() == true){
        var obj = AuthService.getUser();
        Smooch.login(obj.email);
        Smooch.updateUser({
          givenName: obj.firstname,
          surname  : obj.lastname,
          email : obj.email
        })

        $rootScope.mixpanel_user.type="authenticated";
        $rootScope.mixpanel_user.user_id = AuthService.getUser().userId;
        $rootScope.mixpanel_user.email = AuthService.getUser().email;
        $rootScope.authenticated = 1;
        vm.user = AuthService.getUser();
        UserService.getProfilePhoto(vm.user.userId,vm.user.id).get().$promise.then(function(response){
          vm.user.profile_img_url = response.profile_img_url;
        })
      }
    }

    updateLogin();

    function scrollTo(id) {
      $location.hash(id)
      $anchorScroll();
    }

    function submitEmail(mail){
      console.log("mail is ",mail)
      SettingService.notifyAppleApp
                    .save({mail : mail})
                    .$promise
                    .then(function(response){
                      toastr.success("We will notify you, once the app is available on apple store")
                    },function(err){
                      console.log(err);
                      toastr.error(err.data.error.message)
                    })
    }

    function openDialogBox4(){
      $timeout(function(){
          ngDialog.open({
            template: 'views/apple.html',
            scope : $scope
          }); 
        },400);
    }

    function getCategories(){
      CategoryService.getCategories()
                     .query()
                     .$promise
                     .then(function(response){
                        vm.categories = response;
                        vm.categories = vm.categories.sort(function(a,b){
                          return a.event_count < b.event_count
                        });
                        vm.main_categories = vm.categories.slice(0,vm.size)
                        vm.left_categories = vm.categories.slice(vm.size-1)
                     });
    }

    getCategories();

    function openDialogBox(next){
      if(next){
        $scope.next = next;
      }
      $timeout(function(){
        ngDialog.open(
          {
            template: 'views/login-options.html',
            controller:'LoginController as vm',
            scope : $scope
          }
        ); 
      },400);
    }

    $(window).resize(function(){
      var x = parseInt(window.innerWidth);
      x = x-857;
      vm.size = x/89;
      if (vm.size<0){
        vm.size=1;
      }
      $scope.$$phase || $scope.$apply(function(){
        vm.main_categories = vm.categories.slice(0,vm.size)
        vm.left_categories = vm.categories.slice(vm.size-1)
      })
    })

    $scope.$watch('window.innerWidth', function() {
      var x = parseInt(window.innerWidth);
      x = x-857;
      vm.size = x/89;
      if (vm.size<0){
        vm.size=1;
      }

      $scope.$$phase || $scope.$apply(function(){
        vm.main_categories = vm.categories.slice(0,vm.size)
        vm.left_categories = vm.categories.slice(vm.size-1)
      })
    });
  };
