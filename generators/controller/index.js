'use strict';

var path = require('path');
var util = require('util');
var ScriptBase = require('../script-base.js');
var angularUtils = require('../util.js');

var ControllerGenerator = ScriptBase.extend({
  constructor: function(name) {
    ScriptBase.apply(this, arguments);

    //console.log(arguments);
    //console.log(this);
    // if the controller name is suffixed with ctrl, remove the suffix
    // if the controller name is just "ctrl," don't append/remove "ctrl"
    if (this.name && this.name.toLowerCase() !== 'ctrl' && this.name.substr(-4).toLowerCase() === 'ctrl') {
      this.name = this.name.slice(0, -4);
    }

    this.sourceRoot(path.join(__dirname, ''));
  },

  createModule : function(){


    this.appPath = this.config.get('appPath')

    if (typeof this.appPath === "undefined") {
      this.appPath = this.env.options.appPath;
    }
    this.scriptAppName = this.appname + angularUtils.appName(this);

    this.angularcode = this.config.get('angularcode')

    if (typeof this.angularcode === "undefined") {
      console.warn("this.angularcode is not defined. something went wrong in .yo-rc.json");
      return;
    }else {


      this.template('../controller/controller.js', path.join(this.appPath + '/scripts/' + this.name + '/'  , this.name + '.controller.js'));
      this.template('../controller/controller.spec.js', path.join(this.appPath + '/scripts/' + this.name + '/'  , this.name + '.controller.spec.js'));


    }

  },
  /*
  createControllerFiles: function() {
    this.generateSourceAndTest(
      'controller',
      'spec/controller',
      'controllers',
      true  // Skip adding the script to the index.html file of the application
    );
  },
  */

  // Re-write the main app module to account for our new dependency
  injectDependenciesToApp: function () {
    this.appPath = this.config.get('appPath')

    if (typeof this.appPath === "undefined") {
      this.appPath = this.env.options.appPath;
    }
    this.scriptAppName = this.appname + angularUtils.appName(this);

    this.angularcode = this.config.get('angularcode')

    if (typeof this.angularcode === "undefined") {
      console.warn("this.angularcode is not defined. something went wrong in .yo-rc.json");
      return;
    }else {

      if(!this.angularcode.routeModule.lazyload){

        angularUtils.injectIntoFile(
          this.appPath,
          this.name +   '/' + this.name.toLowerCase(),
          this.classedName + 'Ctrl',
          this.scriptAppName + '.controllers.' + this.classedName + 'Ctrl'
        );

      }


    }

  }

});

module.exports = ControllerGenerator;
