/*jshint unused: vars */
require.config({
  paths: {},
  shim: {
    'angular' : {'exports' : 'angular'}<% if (routeModule.ngroute) { %>,
    'angular-route': ['angular']<% } %><% if (routeModule.uirouter) { %>,
    'angular-ui-router': ['angular']<% } %><% if (cookiesModule) { %>,
    'angular-cookies': ['angular']<% } %><% if (sanitizeModule) { %>,
    'angular-sanitize': ['angular']<% } %><% if (resourceModule) { %>,
    'angular-resource': ['angular']<% } %><% if (animateModule) { %>,
    'angular-animate': ['angular']<% } %><% if (touchModule) { %>,
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
