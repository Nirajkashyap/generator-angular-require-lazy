define(['angular'], function (angular) {
  'use strict';

  /**
   * @ngdoc function
   * @name <%= scriptAppName %>.controller:<%= classedName %>Ctrl
   * @description
   * # <%= classedName %>Ctrl
   * Controller of the <%= scriptAppName %>
   */
  <% if (angularcode.routeModule.lazyload) { %> return   <% } %> angular.module('<%= scriptAppName %>.controllers.<%= classedName %>Ctrl', [])
    .controller('<%= classedName %>Ctrl', function () {
      this.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];
    });
});
