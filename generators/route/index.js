'use strict';

var path = require('path');
var chalk = require('chalk');
var util = require('util');
var ScriptBase = require('../script-base.js');
var angularUtils = require('../util.js');

var RouteGenerator = ScriptBase.extend({
  constructor: function() {
    ScriptBase.apply(this, arguments);

    this.option('uri', {
      desc: 'Allow a custom uri for routing',
      type: String,
      required: false
    });

    var appPath = this.config.get('appPath')

    if (typeof appPath === "undefined") {
      appPath = this.env.options.appPath;
    }

    var bower = require(path.join(process.cwd(), 'bower.json'));


    this.angularcode = this.config.get('angularcode');
    if (this.angularcode.routeModule.ngroute) {

      if(this.angularcode.routeModule.lazyload){

      }else{

        var match = require('fs').readFileSync(
          path.join(appPath, 'scripts/app.js'), 'utf-8'
        ).match(/\.when/);

        if (match !== null) {
          this.foundWhenForRoute = true;
        }

      }
    }

    if (this.angularcode.routeModule.uirouter) {

      if(this.angularcode.routeModule.lazyload){

      }else{

        var match = require('fs').readFileSync(
          path.join(appPath, 'scripts/app.js'), 'utf-8'
        ).match(/\.state/);
        console.log(match);
        if (match !== null) {
          this.foundStateForRoute = true;
        }

      }
    }



  },

  writing: {
    rewriteAppJs: function() {
      if (this.foundWhenForRoute) {

        this.uri = this.name;
        if (this.options.uri) {
          this.uri = this.options.uri;
        }

        var config = {
          file: path.join(
            this.config.get('appPath'),
            'scripts/app.js'),
          needle: '.otherwise',
          splicable: [

            "  controller: '" + this.classedName + "Ctrl',",
            "  templateUrl: 'views/" + this.name.toLowerCase() + ".html',"

          ]
        };

        config.splicable.unshift(".when('/" + this.uri + "', {");
        config.splicable.push("})");

        angularUtils.rewriteFile(config);

        this.composeWith('controller', { arguments: [this.name] }, {
            local: require.resolve('../controller/index.js')
        });

        // this.composeWith('view', { arguments: [this.name.toLowerCase()] }, {
        //     local: require.resolve('../view/index.js')
        // });

      }else if (this.foundStateForRoute) {

        this.state = this.name;
        if (this.options.state) {
          this.uri = this.options.state;
        }

        var config = {
          file: path.join(
            this.config.get('appPath'),
            'scripts/app.js'),
          needle: '});',
          splicable: [
            "   url:       '/" + this.state ,
            "  controller: '" + this.classedName + "Ctrl',",
            "  templateUrl: 'views/" + this.name.toLowerCase() + ".html',"

          ]
        };

        config.splicable.unshift(".state('" + this.state + "', {");
        //config.splicable.push("})");

        console.log("rewriteing app.js for url");
        console.log(config);
        angularUtils.rewriteFile(config);

        this.composeWith('controller', { arguments: [this.name] }, {
            local: require.resolve('../controller/index.js')
        });

        // this.composeWith('view', { arguments: [this.name.toLowerCase()] }, {
        //     local: require.resolve('../view/index.js')
        // });

      }else if(this.angularcode.routeModule.lazyload){

      }else{

        this.on('end', function () {
          this.log(chalk.yellow(
            '\nangular-route is not installed. Skipping adding the route to scripts/app.js'
          ));
        });

        return;

      }




    }
  }
});

module.exports = RouteGenerator;
