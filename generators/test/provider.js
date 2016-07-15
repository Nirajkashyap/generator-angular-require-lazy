'use strict';

var fs = require('fs');
var path = require('path');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');
var generateFullProject = require('./utils').generateFullProject;

describe('angular-require:provider', function () {
  beforeEach(function (done) {
    generateFullProject()
      .on('end', function () {
        this.angularRequireProvider = helpers.run(require.resolve('../provider'))
        .withOptions({
          appPath: 'app'
        })
        .withArguments(['foo']);

        // Hack to not clear the directory
        this.angularRequireProvider.inDirSet = true;

        done();
      }.bind(this));
  });

  it('generates a new provider', function (done) {
    this.angularRequireProvider.on('end', function () {
      assert.file('test/spec/services/fooSpec.js');
      assert.fileContent(
        path.join(process.cwd() + '/app/scripts/services/foo.js'),
        /provider\('foo'/
      );

      done();
    });
  });
});
