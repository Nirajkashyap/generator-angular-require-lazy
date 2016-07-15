'use strict';

var fs = require('fs');
var path = require('path');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');
var generateFullProject = require('./utils').generateFullProject;

describe('angular-require:service', function () {
  beforeEach(function (done) {
    generateFullProject()
      .on('end', function () {
        this.angularRequireService = helpers.run(require.resolve('../service'))
        .withOptions({
          appPath: 'app'
        })
        .withArguments(['foo']);

        // Hack to not clear the directory
        this.angularRequireService.inDirSet = true;

        done();
      }.bind(this));
  });

  it('generates a new service', function (done) {
    this.angularRequireService.on('end', function () {
      assert.file('test/spec/services/fooSpec.js');
      assert.fileContent(
        path.join(process.cwd() + '/app/scripts/services/foo.js'),
        /service\('Foo'/
      );

      done();
    });
  });
});
