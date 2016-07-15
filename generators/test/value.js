'use strict';

var fs = require('fs');
var path = require('path');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');
var generateFullProject = require('./utils').generateFullProject;

describe('angular-require:value', function () {
  beforeEach(function (done) {
    generateFullProject()
      .on('end', function () {
        this.angularRequireValue = helpers.run(require.resolve('../value'))
        .withOptions({
          appPath: 'app'
        })
        .withArguments(['foo']);

        // Hack to not clear the directory
        this.angularRequireValue.inDirSet = true;

        done();
      }.bind(this));
  });

  it('generates a new value', function (done) {
    this.angularRequireValue.on('end', function () {
      assert.file('test/spec/services/fooSpec.js');
      assert.fileContent(
        path.join(process.cwd() + '/app/scripts/services/foo.js'),
        /value\('foo'/
      );

      done();
    });
  });
});
