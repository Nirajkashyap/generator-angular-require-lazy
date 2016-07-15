'use strict';

var path = require('path');
var util = require('util');
var ScriptBase = require('../script-base.js');
var angularUtils = require('../util.js');

var ValueGenerator = ScriptBase.extend({
  constructor: function() {
    ScriptBase.apply(this, arguments);
  },

  createServiceFiles: function() {
    this.generateSourceAndTest(
      'service/value',
      'spec/service',
      'services',
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
      'services/' + this.name.toLowerCase(),
      this.classedName + 'Value',
      this.scriptAppName + '.services.' + this.classedName
    );
  }
});

module.exports = ValueGenerator;
