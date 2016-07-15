define(['angular'], function (angular) {
  'use strict';

  /**
   * @ngdoc service
   * @name <%= scriptAppName %>.<%= cameledName %>
   * @description
   * # <%= cameledName %>
   * Constant in the <%= scriptAppName %>.
   */
  angular.module('<%= scriptAppName %>.services.<%= classedName %>', [])
	.constant('<%= cameledName %>', 42);
});
