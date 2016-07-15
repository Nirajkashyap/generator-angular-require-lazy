define(['angular'], function (angular) {
  'use strict';

  /**
   * @ngdoc filter
   * @name <%= scriptAppName %>.filter:<%= cameledName %>
   * @function
   * @description
   * # <%= cameledName %>
   * Filter in the <%= scriptAppName %>.
   */
  angular.module('<%= scriptAppName %>.filters.<%= classedName %>', [])
  	.filter('<%= cameledName %>', function () {
      return function (input) {
      	return '<%= cameledName %> filter: ' + input;
      };
  	});
});
