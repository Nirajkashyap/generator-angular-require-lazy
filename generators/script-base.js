'use strict';

var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var angularUtils = require('./util.js');
var chalk = require('chalk');
var slugify = require("underscore.string/slugify");
var humanize = require("underscore.string/humanize");
var camelize = require("underscore.string/camelize");
var classify = require("underscore.string/classify");
var dasherize = require("underscore.string/dasherize");

var ScriptBase = yeoman.Base.extend({
  constructor: function(name) {
    yeoman.Base.apply(this, arguments);

    this.argument('name', { type: String, required: true });

    var bowerJson = {};

    try {
      bowerJson = require(path.join(process.cwd(), 'bower.json'));
    } catch (e) {}

    if (bowerJson.name) {
      this.appname = bowerJson.name;
    } else {
      this.appname = path.basename(process.cwd());
    }
    this.appname = slugify(humanize(this.appname));

    try {
      this.scriptAppName = require(path.join(process.cwd(), 'bower.json')).moduleName;
    } catch (e) {}

    this.scriptAppName = bowerJson.moduleName || camelize(this.appname) + angularUtils.appName(this);

    this.cameledName = camelize(this.name);
    this.classedName = classify(this.name);
    this.dasherizedName = dasherize(this.name);

    if (typeof this.env.options.appPath === 'undefined') {
      this.env.options.appPath = this.options.appPath || bowerJson.appPath || 'app';
      this.options.appPath = this.env.options.appPath;
    }

    this.env.options.testPath = this.env.options.testPath || bowerJson.testPath || 'test/spec';

    var sourceRoot = '/templates/javascript';
    this.scriptSuffix = '.js';

    this.sourceRoot(path.join(__dirname, sourceRoot));
  },

  appTemplate: function(src, dest) {
    var appPath = this.config.get('appPath')

    if (typeof appPath === "undefined") {
      appPath = this.env.options.appPath;
    }

    yeoman.Base.prototype.template.apply(this, [
      src + this.scriptSuffix,
      path.join(appPath, dest.toLowerCase()) + this.scriptSuffix
    ]);
  },

  testTemplate: function(src, dest) {
    this.fs.copyTpl(
      this.templatePath(src + this.scriptSuffix),
      path.join(this.env.options.testPath, dest.toLowerCase()) + 'Spec' + this.scriptSuffix,
      {
        cameledName: this.cameledName,
        classedName: this.classedName,
        dasherizedName: this.dasherizedName,
        scriptAppName: this.scriptAppName
      }
    );
  },

  htmlTemplate: function(src, dest) {
    var appPath = this.config.get('appPath')

    if (typeof appPath === "undefined") {
      appPath = this.env.options.appPath;
    }

    yeoman.Base.prototype.template.apply(this, [
      src,
      path.join(appPath, dest.toLowerCase())
    ]);
  },

  addScriptToIndex: function(script) {
    try {
      var appPath = this.env.options.appPath;
      var fullPath = path.join(appPath, 'index.html');
      angularUtils.rewriteFile({
        file: fullPath,
        needle: '<!-- endbuild -->',
        splicable: [
          '<script src="scripts/' + script.replace(/\\/g, '/') + '.js"></script>'
        ]
      });
    } catch (e) {
      this.log.error(chalk.yellow(
        '\nUnable to find ' + fullPath + '. Reference to ' + script + '.js ' + 'not added.\n'
       ));
    }
  },

  generateSourceAndTest: function(appTemplate, testTemplate, targetDirectory, skipAdd) {
    // Services use classified names
    if (this.options.namespace === 'angular-require:service') {
      this.cameledName = this.classedName;
    }

    this.appTemplate(appTemplate, path.join('scripts', targetDirectory, this.name));
    this.testTemplate(testTemplate, path.join(targetDirectory, this.name));
    if (!skipAdd) {
      this.addScriptToIndex(path.join(targetDirectory, this.name));
    }
  }
});

module.exports = ScriptBase;
