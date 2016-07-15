'use strict';

var fs = require('fs');
var path = require('path');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');
var generateFullProject = require('./utils').generateFullProject;

describe('angular-require:factory', function () {
  beforeEach(function (done) {
    generateFullProject()
      .on('end', function () {
        this.angularRequireFactory = helpers.run(require.resolve('../factory'))
        .withOptions({
          appPath: 'app'
        })
        .withArguments(['foo']);

        // Hack to not clear the directory
        this.angularRequireFactory.inDirSet = true;

        done();
      }.bind(this));
  });

  it('generates a new factory', function (done) {
    this.angularRequireFactory.on('end', function () {
      assert.file('test/spec/services/fooSpec.js');
      assert.fileContent(
        path.join(process.cwd() + '/app/scripts/services/foo.js'),
        /factory\('foo'/
      );

      done();
    });
  });
});
