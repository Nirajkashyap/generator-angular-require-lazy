'use strict';

var path = require('path');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');
var generateFullProject = require('./utils').generateFullProject;

describe('angular-require:route', function () {
  beforeEach(function (done) {
    generateFullProject()
      .withPrompts({
        modules: ['routeModule']
      })
      .on('end', function () {
        this.angularRequireRoute = helpers.run(require.resolve('../route'))
          .withGenerators([
            require.resolve('../controller'),
            require.resolve('../view')
          ])
          .withOptions({
            appPath: 'app'
          })
          .withArguments(['simpleroute']);

        // Hack to not clear the directory
        this.angularRequireRoute.inDirSet = true;

        done();
      }.bind(this));
  });

  it('generates default route items', function (done) {
    this.angularRequireRoute.on('end', function () {
      assert.file([
        'app/scripts/controllers/simpleroute.js',
        'test/spec/controllers/simplerouteSpec.js',
        'app/views/simpleroute.html'
      ]);
      assert.fileContent(
        'app/scripts/app.js',
        /when\('\/simpleroute'/
      );
      done();
    });
  });

  it('generates route items with the route uri given', function (done) {
    this.angularRequireRoute
      .withOptions({
        uri: 'segment1/segment2/:parameter'
      })
      .on('end', function () {
        assert.file([
          'app/scripts/controllers/simpleroute.js',
          'test/spec/controllers/simplerouteSpec.js',
          'app/views/simpleroute.html'
        ]);
        assert.fileContent(
          'app/scripts/app.js',
          /when\('\/segment1\/segment2\/\:parameter'/
        );
        done();
      });
  });
});
