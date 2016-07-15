'use strict';

var fs = require('fs');
var path = require('path');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');
var generateFullProject = require('./utils').generateFullProject;

describe('angular-require:filter', function () {
  beforeEach(function (done) {
    generateFullProject()
      .on('end', function () {
        this.angularRequireFilter = helpers.run(require.resolve('../filter'))
        .withOptions({
          appPath: 'app'
        })
        .withArguments(['foo']);

        // Hack to not clear the directory
        this.angularRequireFilter.inDirSet = true;

        done();
      }.bind(this));
  });

  it('generates a new filter', function (done) {
    this.angularRequireFilter.on('end', function () {
      assert.file('test/spec/filters/fooSpec.js');
      assert.fileContent(
        path.join(process.cwd() + '/app/scripts/filters/foo.js'),
        /filter\('foo'/
      );

      done();
    });
  });
});
