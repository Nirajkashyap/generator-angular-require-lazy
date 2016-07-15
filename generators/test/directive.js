'use strict';

var fs = require('fs');
var path = require('path');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');
var generateFullProject = require('./utils').generateFullProject;

describe('angular-require:directive', function () {
  beforeEach(function (done) {
    generateFullProject()
      .on('end', function () {
        this.angularRequireDirective = helpers.run(require.resolve('../directive'))
        .withOptions({
          appPath: 'app'
        })
        .withArguments(['foo']);

        // Hack to not clear the directory
        this.angularRequireDirective.inDirSet = true;

        done();
      }.bind(this));
  });

  it('generates a new directive', function (done) {
    this.angularRequireDirective.on('end', function () {
      assert.file('test/spec/directives/fooSpec.js');
      assert.fileContent(
        path.join(process.cwd() + '/app/scripts/directives/foo.js'),
        /directive\('foo'/
      );

      done();
    });
  });
});
