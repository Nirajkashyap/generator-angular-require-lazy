'use strict';

var path = require('path');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');

var getDefaultFilesForAppPath = function (appPath) {
  return [
    appPath + '/404.html',
    appPath + '/favicon.ico',
    appPath + '/robots.txt',
    appPath + '/styles/main.scss',
    appPath + '/views/main.html',
    appPath + '/index.html',
    '.bowerrc',
    '.editorconfig',
    '.gitignore',
    '.jshintrc',
    'Gruntfile.js',
    'package.json',
    'bower.json'
  ];
};

describe('angular-require:app', function () {
  var appPath = 'customAppPath';

  beforeEach(function () {
    this.angularRequire = helpers
      .run(require.resolve('../app'))
      .withGenerators([
        require.resolve('../controller'),
        [helpers.createDummyGenerator(), 'karma-require:app']
      ])
      .withOptions({
        'skip-welcome-message': true,
        'skip-message': true
      })
      .withArguments(['upperCaseBug'])
      .withPrompts({
        compass: true,
        bootstrap: true,
        compassBootstrap: true,
        modules: []
      });
  });

  describe('default settings', function () {
    beforeEach(function (done) {
      this.angularRequire.on('end', done);
    });

    it('generates base files', function () {
      assert.file(getDefaultFilesForAppPath('app'));
      assert.file([
        '.jscsrc',
        'app/index.html',
        'app/scripts/app.js',
        'app/scripts/controllers/main.js',
        'test/spec/controllers/mainSpec.js'
      ]);
    });
  });

  describe('--appPath', function () {
    beforeEach(function (done) {
      this.angularRequire.withOptions({
        appPath: 'alternative'
      }).on('end', done);
    });

    it('generates base files inside the appPath', function () {
      assert.file(getDefaultFilesForAppPath('alternative'));
      assert.file([
        '.jscsrc',
        'alternative/scripts/app.js',
        'alternative/scripts/controllers/main.js',
        'test/spec/controllers/mainSpec.js'
      ]);
    });
  });

  describe('--appName', function () {
    beforeEach(function (done) {
      this.angularRequire
        .withArguments(['upperCaseBug'])
        .on('end', done);
    });

    it('generates the same appName in every file', function () {
      assert.fileContent(
        'app/scripts/app.js',
        /module\('upperCaseBugApp'/
      );
      assert.fileContent(
        'app/scripts/controllers/main.js',
        /module\('upperCaseBugApp\.controllers/
      );
      assert.fileContent(
        'test/spec/controllers/mainSpec.js',
        /module\('upperCaseBugApp\.controllers/
      );

      assert.fileContent(
        'app/index.html',
        /ng-app="upperCaseBugApp"/
      );
    });
  });
});
