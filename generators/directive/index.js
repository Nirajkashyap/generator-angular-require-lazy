'use strict';

var path = require('path');
var util = require('util');
var ScriptBase = require('../script-base.js');
var angularUtils = require('../util.js');

var DirectiveGenerator = ScriptBase.extend({
  constructor: function(name) {
    ScriptBase.apply(this, arguments);
  },

  createDirectiveFiles: function() {
    this.generateSourceAndTest(
      'directive',
      'spec/directive',
      'directives',
      true	// Skip adding the script to the index.html file of the application
    );
  },

  // Re-write the main app module to account for our new dependency
  injectDependenciesToApp: function() {
    var appPath = this.config.get('appPath');

    if (typeof appPath === "undefined") {
      appPath = this.env.options.appPath;
    }

    angularUtils.injectIntoFile(
      appPath,
      'directives/' + this.name.toLowerCase(),
      this.classedName + 'Directive',
      this.scriptAppName + '.directives.' + this.classedName
    );
  }
});

module.exports = DirectiveGenerator;
