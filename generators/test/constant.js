'use strict';

var fs = require('fs');
var path = require('path');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');
var generateFullProject = require('./utils').generateFullProject;

describe('angular-require:constant', function () {
  beforeEach(function (done) {
    generateFullProject()
      .on('end', function () {
        this.angularRequireConstant = helpers.run(require.resolve('../constant'))
        .withOptions({
          appPath: 'app'
        })
        .withArguments(['foo']);

        // Hack to not clear the directory
        this.angularRequireConstant.inDirSet = true;

        done();
      }.bind(this));
  });

  it('generates a new constant', function (done) {
    this.angularRequireConstant.on('end', function () {
      assert.file('test/spec/services/fooSpec.js');
      assert.fileContent(
        path.join(process.cwd() + '/app/scripts/services/foo.js'),
        /constant\('foo'/
      );

      done();
    });
  });
});
