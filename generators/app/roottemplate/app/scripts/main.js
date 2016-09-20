/*jshint unused: vars */
require.config({
  paths: {},
  shim: {
    'angular' : {'exports' : 'angular'}<% if (angularcode.routeModule.ngroute) { %>,
    'angular-route': ['angular']<% } %><% if (angularcode.routeModule.uirouter) { %>,
    'angular-ui-router': ['angular']<% } %><% if (angularcode.cookiesModule) { %>,
    'angular-cookies': ['angular']<% } %><% if (angularcode.sanitizeModule) { %>,
    'angular-sanitize': ['angular']<% } %><% if (angularcode.resourceModule) { %>,
    'angular-resource': ['angular']<% } %><% if (angularcode.animateModule) { %>,
    'angular-animate': ['angular']<% } %><% if (angularcode.touchModule) { %>,
    'angular-touch': ['angular']<% } %>,
    'angular-mocks': {
      deps:['angular'],
      'exports':'angular.mock'
    }
  },
  priority: [
    'angular'
  ]
});

//http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
window.name = 'NG_DEFER_BOOTSTRAP!';

require([
  'angular',
  'app'
], function(angular, app) {
  'use strict';
  /* jshint ignore:start */
  var $html = angular.element(document.getElementsByTagName('html')[0]);
  /* jshint ignore:end */
  angular.element().ready(function() {
    angular.resumeBootstrap([app.name]);
  });
});
