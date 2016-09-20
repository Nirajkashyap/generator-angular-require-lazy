var tests = [];
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    // Removed "Spec" naming from files
    if (/Spec\.js$/.test(file)) {
      tests.push(file);
    }
  }
}

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base/app/scripts',

    paths: {

    },

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

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});
