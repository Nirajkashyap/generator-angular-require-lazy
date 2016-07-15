'use strict';

var fs = require('fs');
var path = require('path');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');
var generateFullProject = require('./utils').generateFullProject;

describe('angular-require:controller', function () {
  beforeEach(function (done) {
    generateFullProject()
      .on('end', function () {
        this.angularRequireController = helpers.run(require.resolve('../controller'))
        .withOptions({
          appPath: 'app'
        })
        .withArguments(['foo']);

        // Hack to not clear the directory
        this.angularRequireController.inDirSet = true;

        done();
      }.bind(this));
  });

  it('generates a new controller', function (done) {
    this.angularRequireController.on('end', function () {
      assert.file('test/spec/controllers/fooSpec.js');
      assert.fileContent(
        path.join(process.cwd() + '/app/scripts/controllers/foo.js'),
        /controller\('FooCtrl'/
      );

      done();
    });
  });
});
