'use strict';

var path = require('path');
var util = require('util');
var ScriptBase = require('../script-base.js');
var angularUtils = require('../util.js');

var FilterGenerator = ScriptBase.extend({
  constructor: function() {
    ScriptBase.apply(this, arguments);
  },

  createFilterFiles: function() {
    this.generateSourceAndTest(
      'filter',
      'spec/filter',
      'filters',
      true	// Skip adding the script to the index.html file of the application
    );
  },

  // Re-write the main app module to account for our new dependency
  injectDependenciesToApp: function () {
      var appPath = this.config.get('appPath');

      if (typeof appPath === "undefined") {
        appPath = this.env.options.appPath;
      }

      angularUtils.injectIntoFile(
        appPath,
      'filters/' + this.name.toLowerCase(),
      this.classedName + 'Filter',
      this.scriptAppName + '.filters.' + this.classedName
    );
  }
});

module.exports = FilterGenerator;
