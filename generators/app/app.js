/*jshint unused: vars */
define(['angular']/*deps*/, function (angular)/*invoke*/ {
  'use strict';

  /**
   * @ngdoc overview
   * @name <%= scriptAppName %>
   * @description
   * # <%= scriptAppName %>
   *
   * Main module of the application.
   */
  var app = angular
    .module('<%= scriptAppName %>', [/*angJSDeps*/<%- angularcode.angularModules %>])<% if (angularcode.routeModule.ngroute) { %>
    .config(['$controllerProvider','$compileProvider', '$filterProvider', '$provide', '$httpProvider','$routeProvider', '$locationProvider',
    function ($controllerProvider, $compileProvider, $filterProvider, $provide, $httpProvider,$routeProvider, $locationProvider ) {

      app.globalutil = {

        controller: $controllerProvider.register,
        directive: $compileProvider.directive,
        filter: $filterProvider.register,
        factory: $provide.factory,
        service: $provide.service,
        routeProvider  : $routeProvider,
        locationProvider : $locationProvider

      };


      $routeProvider
        .when('/', {
          controller: 'MainCtrl',
          templateUrl: 'views/main.html'

        })
        .otherwise({
          redirectTo: '/'
        });
    }])<% } %><% if (angularcode.routeModule.uirouter) { %>
      .config(['$controllerProvider','$compileProvider', '$filterProvider', '$provide', '$httpProvider','$stateProvider', '$urlRouterProvider',
      function ($controllerProvider, $compileProvider, $filterProvider, $provide, $httpProvider, $stateProvider, $urlRouterProvider ) {

        app.globalutil = {

          controller: $controllerProvider.register,
          directive: $compileProvider.directive,
          filter: $filterProvider.register,
          factory: $provide.factory,
          service: $provide.service,
          $stateProvider  : $stateProvider,
          $urlRouterProvider : $urlRouterProvider

        };

        $urlRouterProvider.deferIntercept();


        $stateProvider
          .state('main', {
            url: '/',
            controller: 'MainCtrl',
            templateUrl: 'app/settings/settings.html'
          });
        $urlRouterProvider.otherwise({
            redirectTo: '/'
          });

      }])<% } %>;

    <% if (angularcode.routeModule.ngroute) { %>


    <% } %>

    <% if (angularcode.routeModule.uirouter) { %>

      app.run(['$http','$urlRouter',function($http,$urlRouter){
          // Call route.json for creating dynamic states
          console.log(' angular runtime loaded');


          $http.get("/scripts/route.json").success(function(data){
              console.log('angular http called');
              angular.forEach(data, function (value, key) {
                var state = {
                  "url": value.url,
                  "templateUrl": value.templateUrl,
                  "controller": value.controller
                };

                state.resolve =  {
                      load:['$q',function($q){
                          var defered = $q.defer();
                          require([value.controllerurl],function(controllerconstructor){
                              console.log(controllerconstructor);
                              app.globalutil.controller(value.controller,controllerconstructor);
                              defered.resolve();
                          });
                          return defered.promise;
                      }]
                  };
                console.log('new entry ' + value.name + ' is registred in angular stateProviderRef ');
                app.globalutil.$stateProvider.state(value.name, state);
              });
              console.log('now checking all routes from  stateProviderRef');

              console.log($urlRouter);



              // Configures $urlRouter's listener *after* your custom listener
              $urlRouter.sync();
              $urlRouter.listen();


            });

      }]);

    <% } %>


    return app;
});
