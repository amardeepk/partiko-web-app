(function(){
  'use strict';

  /**
   * @ngdoc overview
   * @name yapp
   * @description
   * # yapp
   *
   * Main module of the application.
   */
  angular
    .module('yapp', [
      'ui.router',
      'ui.bootstrap',
      'ngDialog',
      'ngResource',
      'pascalprecht.translate',
      'ngMessages',
      'facebook',
      'analytics.mixpanel',
      'uiGmapgoogle-maps',
      'angularSpinner',
      'ngFileUpload',
      'googleplus'
    ])
    .config(config)
    .run(run)
    .factory(httpRequestInterceptor)
    .filter(encodeURIComponent);

    function config($httpProvider,$stateProvider, GooglePlusProvider,$locationProvider,$mixpanelProvider, 
                    uiGmapGoogleMapApiProvider, $urlRouterProvider, $translateProvider, 
                    $urlMatcherFactoryProvider, $logProvider, FacebookProvider) {

      $logProvider.debugEnabled(true);

      toastr.options = {
        "positionClass": "toast-top-center",
        "preventDuplicates" : true
      }

      $mixpanelProvider.apiKey('aba84f1731da7d6c92e0358da0b092c3');
      $locationProvider.html5Mode(true);
      
      // Allow CORS
      $httpProvider.defaults.useXDomain = true;
      delete $httpProvider.defaults.headers.common['X-Requested-With'];


      // to intercept 401 errors
      $httpProvider.interceptors.push(httpRequestInterceptor)


      // Key Integrations Begin

      uiGmapGoogleMapApiProvider.configure({
        key      : 'AIzaSyBvEshSEx826RSLkpLBgieG2Hvaif5ryAs',
        v        : '3',
        libraries: 'weather,geometry,visualization'
      });
      
      Smooch.init({ 
        appToken: 'aznfkybu17f3g3txc8iik7fuj',
        givenName: 'Anonymous',
        surname: '',
        email: ''
      });

      FacebookProvider.init('156301524810221');

      GooglePlusProvider.init({
        clientId: '567260938662-mauck8qqecjfv0n6lrnfv8eek4orflri.apps.googleusercontent.com'
      });

      GooglePlusProvider.setScopes('https://www.googleapis.com/auth/userinfo.email');

      // Key Integrations End

      $translateProvider.useUrlLoader("/i18n/en.json");
      $translateProvider.useSanitizeValueStrategy('escaped');
      $translateProvider.preferredLanguage('en');

      $urlRouterProvider.otherwise('/');
      $urlMatcherFactoryProvider.strictMode(false);
      

      $stateProvider
        .state('base', {
          abstract: true,
          url: '/',
          templateUrl: 'views/base.html',
          controller: 'BaseCtrl as vm'
        })
        
        .state('dashboard', {
          url: '',
          parent: 'base',
          templateUrl: 'views/dashboard.html',
          controller : 'DashboardController as vm'
        })

        .state('events', {
          url: 'events/{category:[a-zA-Z&]*}',
          parent: 'base',
          controller: 'EventListController as vm',
          templateUrl: 'views/events/events.html'
        })

        .state('event_detail', {
          url: '{category:[a-zA-Z]+}/{event_id:[a-zA-Z0-9-_+&$#*()!@%]+}',
          parent: 'base',
          controller: 'EventDetailController as vm',
          templateUrl: 'views/events/eventView.html'
        })

        .state('event_redirect', {
          url: 'event/details/{event_id:[0-9]+}',
          parent: 'base',
          controller: 'EventRedirectController as vm'
        })
       
        .state('signup', {
          url: 'signup',
          parent: 'base',
          controller: 'SignUpController as vm',
          templateUrl: 'views/signup.html'
        })

        .state('transaction_confirm', {
          url: 'confirm-transaction/',
          parent: 'base',
          data : {
            login : 'required'
          },
        	controller: 'TicketController as vm',
          templateUrl: 'views/ticket_confirm.html'
        })


        .state('checkout', {
          url: 'checkout{/?}',
          parent: 'base',
          data : {
            login : 'required'
          },
        //	controller: 'TicketController as vm',
          templateUrl: 'views/checkout.html'
        })

        .state('search', {
          url: 'search/',
          parent: 'base',
          controller: 'SearchController as vm',
          templateUrl: 'views/search.html'
        })

        .state('tickets', {
        	url:'tickets/:event_id',
        	parent:'base',
          data : {
            login : 'required'
          },
          controller: 'TicketController as vm',
        	templateUrl: 'views/ticket_pop_up.html'

        })

        .state('ticket_pop', {
        	url:'ticket_pop/',
        	parent:'base',
          data : {
            login : 'required'
          },
        	templateUrl: 'views/ticket_confirm.html'

        })
        .state('pricing', {
          url:'pricing/',
          parent:'base',
          controller : 'MerchantController as vm',
          resolve: {
            page_name : function(){
              return 'pricing';
            }
          },
          templateUrl: 'views/pricing.html'

        })

        .state('mytickets', {
          url: 'mytickets/',
          parent:'base',
          data : {
            login : 'required'
          },
          controller: 'MyTicketsController as vm',
          templateUrl: 'views/ticket.html'
        })
        
        .state('faq', {
          url:'faq/',
          parent:'base',
          controller : 'ExtraTagsController as vm',
          resolve: {
            page_name : function(){
              return 'faq';
            }
          },
          templateUrl: 'views/faq.html'

        })

        .state('terms', {
          url:'terms/',
          parent:'base',
          controller : 'ExtraTagsController as vm',
          resolve: {
            page_name : function(){
              return 'terms';
            }
          },
          templateUrl: 'views/terms.html'

        })  

        .state('privacy', {
          url:'privacy/',
          parent:'base',
          controller : 'ExtraTagsController as vm',
          resolve: {
            page_name : function(){
              return 'privacy';
            }
          },
          templateUrl: 'views/privacy.html'

        })
          
        .state('team-members', {
          url:'team-members/',
          parent:'base',
          controller : 'ExtraTagsController as vm',
          resolve: {
            page_name : function(){
              return 'team';
            }
          },
          templateUrl: 'views/team-members.html'

        })
        .state('media', {
          url:'media/',
          parent:'base',
          controller : 'ExtraTagsController as vm',
          resolve: {
            page_name : function(){
              return 'media';
            }
          },
          templateUrl: 'views/media.html'

        })
        
        .state('event-partners', {
          url:'event-partners/',
          parent:'base',
          controller : 'ExtraTagsController as vm',
          resolve: {
            page_name : function(){
              return 'event_partners';
            }
          },
          templateUrl: 'views/event-partners.html'

        })
        
        .state('profile', {
          url:'profile/',
          parent:'base',
          controller: 'ProfileController as vm',
          templateUrl: 'views/profile.html'
        })

        .state('campus', {
          url:'campus/',
          parent:'base',
          controller: 'AmbassadorViewController as vm',
          resolve: {
            TYPE : function(){
              return 'campus';
            }
          },
          templateUrl: 'views/campus.html'

        })
        
        .state('brand', {
          url:'brand/',
          parent:'base',
          controller: 'AmbassadorViewController as vm',
          resolve: {
            TYPE : function(){
              return 'brand';
            }
          },
          templateUrl: 'views/brand.html'

        })
        
        .state('ambassador-form', {
          url:'ambassador-form/',
          parent:'base',
          controller: 'CreateAmbassadorController as vm',
          resolve: {
            TYPE : function(){
              return 'campus';
            }
          },
          templateUrl: 'views/ambassador-form.html'
        })

        .state('form', {
          url:'careers/',
          parent:'base',
          controller: 'SubmitCVController as vm',
          templateUrl: 'views/form.html'
        })

        .state('manager-form', {
          url:'manager-form/',
          parent:'base',
          controller: 'CreateAmbassadorController as vm',
          resolve: {
            TYPE : function(){
              return 'brand';
            }
          },
          templateUrl: 'views/ambassador-form.html'
        })

        .state('create-event',{
          url: 'merchant-form/',
          parent: 'base',
          controller: 'MerchantController as vm',
          resolve : {
            page_name : function(){
              return  'merchant-form';
            }
          },
          templateUrl: 'views/merchant-form.html'
        })
  }

  function run($rootScope, AuthService,AUTH_EVENTS, $state, $timeout,$log, $window){

    var stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function (){
      $rootScope.loadingProgress = true;
    });

    $rootScope.$on('$stateChangeStart', function (event, next, nextParams, fromState,fromParams) {
      $window.scroll(0,0);
      if ('data' in next && 'login' in next.data) {
        var status = next.data.login;
        if (status == 'required' && !AuthService.isAuthenticated()) {
          event.preventDefault();
          if($state.current.name.length == 0) {
              toastr.error('Please Login to access the page')
              if($rootScope.openDialogBox)
                $rootScope.openDialogBox(next);
              else
                $state.go('dashboard')
          } else {
              $state.go($state.current,{}, {});
              toastr.error('Please Login to access the page');
              $rootScope.$broadcast(AUTH_EVENTS.notAuthorized); 
              if($rootScope.openDialogBox)
                $rootScope.openDialogBox(next);
              else
                $state.go('dashboard')  
          }
        }
      }
    })

    var stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', function (){
      $timeout(function (){
          $rootScope.loadingProgress = false;
      });

    });

    $rootScope.$on('$destroy', function (){
      stateChangeStartEvent();
      stateChangeSuccessEvent();
    });

  }

  function httpRequestInterceptor($q, $rootScope, $location) {
    return {
        responseError: function(rejection) {
          if(rejection.data.error.code == 'LOGIN_FAILED_EMAIL_NOT_VERIFIED'){
            toastr.error("Please verify your account before logging in")
          }
          else if(rejection.data.error.code == 'LOGIN_FAILED'){
            toastr.error('Wrong Credentials')
          }
          else if (rejection.status === 401) {
            $rootScope.logout(1);
            toastr.error("Session Expired. Please login again");
          }
          return $q.reject(rejection);
        }
      }
  }

  function encodeURIComponent(){
	  return window.encodeURIComponent;
  }

})();
