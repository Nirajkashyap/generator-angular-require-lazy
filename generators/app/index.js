'use strict';

var fs = require('fs');
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var camelize = require('underscore.string/camelize');
var slugify = require('underscore.string/slugify');
var humanize = require('underscore.string/humanize');
var angularUtils = require('../util.js');

module.exports = yeoman.Base.extend({

  constructor: function() {
    yeoman.Base.apply(this, arguments);

    // Backwards compatability
    // TODO: remove engine in future and use yeoman html-wiring instead;
    this.log("from constructor");
    this.engine = require('ejs').render;

    this.option('app-suffix', {
      desc: 'Allow a custom suffix to be added to the module name',
      type: 'String',
      defaults: 'App'
    });

    this.option('appPath', {
      desc: 'path/to/app is now accepted to choose where to write the files',
      banner: 'path/to/app is now accepted to choose where to write the files',
      type: 'String',
      defaults: 'app',
      required: 'false'
    });

    this.argument('appname', { type: String, required: false });

    this.appname = this.appname || path.basename(process.cwd());
    this.appname = camelize(slugify(humanize(this.appname)));

    this.appSlugName = slugify(humanize(this.appname))
    this.scriptAppName = this.appname + angularUtils.appName(this);



    this.env.options['app-suffix'] = this.options['app-suffix'] || 'App';

    this.env.options.appPath = this.options.appPath || 'app';
    this.config.set('appPath', this.env.options.appPath);
    this.appPath = this.env.options.appPath;


    this.pkg = require('../../package.json');
    this.sourceRoot(path.join(__dirname, 'roottemplate'));
    //this.log(this);
  },

  prompting: function () {
    // Have Yeoman greet the user.


    var cb = this.async();
    //var compass;



    if (!this.options['skip-welcome-message']) {
      this.log(yosay(
        'Welcome to the  ' + chalk.red('generator-angular-require-lazy') + ' generator!'
      ));
      this.log('Out of the box I include Bootstrap and some AngularJS recommended modules.\n');
    }

    if (this.options.minsafe) {
      this.log.error(
        'The --minsafe flag has been removed. ngAnnotate is used to handle this during the build.\n'
      );
    }

    console.log("prompting");
    return this.prompt([{
      type: 'confirm',
      name: 'compass',
      message: 'Would you like to use Sass (with Compass)?',
      default: true
    }, {
      type: 'confirm',
      name: 'bootstrap',
      message: 'Would you like to include Bootstrap?',
      default: true
    }, {
      type: 'confirm',
      name: 'compassBootstrap',
      message: 'Would you like to use the Sass version of Bootstrap?',
      default: true,
      when: function (props) {
        return props.bootstrap && props.compass;
      }
    },{
      type: 'list',
      name: 'router',
      default: true,
      message: 'What Angular router would you like to use?',
      choices: ['ngRoute', 'uiRouter'],
      filter: function( val ) { return val.toLowerCase(); }
    },{
      type: 'confirm',
      name: 'lazyload',
      message: 'Would you like to use load controller lazy ?',
      default: true
    },{
      type: 'checkbox',
      name: 'modules',
      message: 'Which modules would you like to include?',
      choices: [{
        value: 'resourceModule',
        name: 'angular-resource.js',
        checked: true
      }, {
        value: 'cookiesModule',
        name: 'angular-cookies.js',
        checked: true
      }, {
      value: 'sanitizeModule',
      name: 'angular-sanitize.js',
      checked: true
      }, {
        value: 'animateModule',
        name: 'angular-animate.js',
        checked: true
      }, {
        value: 'touchModule',
        name: 'angular-touch.js',
        checked: false
      }, {
        value: 'ariaModule',
        name: 'angular-aria.js',
        checked: false
      }, {
        value: 'messagesModule',
        name: 'angular-messages.js',
        checked: false
      }]

    }]).then(function (props) {
      //console.log("all anwser from prompt is below");
      //this.log("props");

      console.log("prmopting done");
      console.log(props);

      this.csscode = {};
      this.csscode.compass = props.compass;
      this.csscode.bootstrap = props.bootstrap;
      this.csscode.compassBootstrap = props.compassBootstrap;

      var hasMod = function (mod) { return props.modules.indexOf(mod) !== -1; };

      this.angularcode = {};
      this.angularcode.cookiesModule = hasMod('cookiesModule');
      this.angularcode.resourceModule = hasMod('resourceModule');
      this.angularcode.sanitizeModule = hasMod('sanitizeModule');

      this.angularcode.animateModule = hasMod('animateModule');
      this.angularcode.touchModule = hasMod('touchModule');

      this.angularcode.routeModule = {};

      if(props.router === 'uirouter'){
        this.angularcode.routeModule.ngroute = false;

        this.angularcode.routeModule.uirouter = true;
      } else {
        this.angularcode.routeModule.uirouter = false;

        this.angularcode.routeModule.ngroute = true;
      }

      if(props.lazyload === true){
          this.angularcode.routeModule.lazyload = true;
      }else{
        this.angularcode.routeModule.lazyload = false;
      }


      this.angularcode.ariaModule = hasMod('ariaModule');
      this.angularcode.messagesModule = hasMod('messagesModule');

      var angMods = [];

      if (this.angularcode.cookiesModule) {
        angMods.push('ngCookies');
      }

      if (this.angularcode.resourceModule) {
        angMods.push('ngResource');
      }

      if (this.angularcode.sanitizeModule) {
        angMods.push('ngSanitize');
      }

      if (this.angularcode.animateModule) {
        angMods.push('ngAnimate');
        //this.env.options.ngAnimate = true;
      }

      if (this.angularcode.touchModule) {
        angMods.push('ngTouch');
        //this.env.options.ngTouch = true;
      }

      if (this.angularcode.routeModule.ngroute) {
        angMods.push('ngRoute');
        //console.log(this.env.options);
        //this.env.options.router.ngRoute = true;
      }

      if (this.angularcode.routeModule.uirouter) {
        angMods.push('ui.router');
        //this.env.options.router.uirouter = true;
      }

      if (this.angularcode.ariaModule) {
        angMods.push('ngAria');
      }

      if (this.angularcode.messagesModule) {
        angMods.push('ngMessages');
      }

      this.angularcode.angularDeps = angMods;

      this.config.set('angularcode', this.angularcode);

      cb();
    }.bind(this));
  },


  configuring: {

    saveConfig: function() {
      this.config.save();
    },

    bowerConfig: function() {
      console.log("configuring bowerConfig");
      this.fs.copyTpl(
        this.templatePath('_bowerrc'),
        this.destinationPath('.bowerrc')
      );


      this.fs.copyTpl(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json'),
        {
          appSlugName: this.appSlugName,
          appPath: this.appPath,
          scriptAppName: this.scriptAppName,

          bootstrap: this.csscode.bootstrap,
          compassBootstrap: this.csscode.compassBootstrap,

          animateModule: this.angularcode.animateModule,
          ariaModule: this.angularcode.ariaModule,
          cookiesModule: this.angularcode.cookiesModule,
          messagesModule: this.angularcode.messagesModule,
          resourceModule: this.angularcode.resourceModule,
          routeModule: this.angularcode.routeModule,
          sanitizeModule: this.angularcode.sanitizeModule,
          touchModule: this.angularcode.touchModule


        }
      );
    },

    packageJson: function() {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        {
          appSlugName: this.appSlugName,
          csscode : {
                      compass: this.csscode.compass
                    }
        }
      );
    },

    gruntfile: function() {
      this.template('_Gruntfile.js', 'Gruntfile.js');
    },

    editorConfig: function() {
      this.copy('.editorconfig', '.editorconfig');
    },

    jscsrc: function() {
      this.copy('.jscsrc', '.jscsrc');
    },

    git: function() {
      this.copy('.gitattributes', '.gitattributes');
      this.copy('gitignore', '.gitignore');
    },

    jshint: function() {
      this.copy('.jshintrc', '.jshintrc');
    },

    readme: function() {
      this.fs.copyTpl(
        this.templatePath('README.md'),
        this.destinationPath('README.md'),
        {
          appSlugName: this.appSlugName,
          pkg: this.pkg
        }
      );
    },

    testDirectory: function() {
      this.directory('test');
    },
  },

  writing:  {

    bootstrapFiles: function() {
      var cssFile = 'app.' + (this.compass ? 's' : '') + 'css';
      this.copy(
        path.join('app/styles', cssFile),
        path.join(this.appPath + '/styles', cssFile)
      );
    },

    indexHtml: function() {
      this.indexFile = this.engine(this.read('app/index.html'), this);
      this.indexFile = this.indexFile.replace(/&apos;/g, "'");
      this.write(path.join(this.appPath, 'index.html'), this.indexFile);
    },

    webFiles: function() {


      this.copy(path.join('app', '404.html'), path.join(this.appPath, '404.html'));
      this.copy(path.join('app', 'favicon.ico'), path.join(this.appPath, 'favicon.ico'));
      this.copy(path.join('app', 'robots.txt'), path.join(this.appPath, 'robots.txt'));


      this.directory(path.join('app', 'images'), path.join(this.appPath, 'images'));
    },

    requireJsAppConfig: function() {
      this.template('app/scripts/main.js', path.join(this.appPath + '/scripts' , 'main.js'));
    },


    requireJsTestConfig: function() {
      this.template('app/scripts/main.spec.js', path.join(this.appPath + '/scripts', 'main.spec.js'));
    },



    appFile: function() {


      this.template('../app.js', path.join(this.appPath + '/scripts' , 'app.js'));
    }


  },

  install: function () {
    //this.installDependencies({ skipInstall: this.options['skip-install'] });

    var enabledComponents = [];

    if (this.angularcode.routeModule.ngroute) {
      enabledComponents.push('angular-route/angular-route.js');
      if(this.angularcode.routeModule.lazyload){
            // implementing still pending
      }else{
            // create controller because route is aleray defined;

      }
    }

    if (this.angularcode.routeModule.uirouter) {
      enabledComponents.push('angular-ui-router/angular-ui-router.js');
      if(this.angularcode.routeModule.lazyload){

          // create route.json and make entry of controller and create controller
          this.fs.copyTpl(
            this.templatePath('app/scripts/route.json'),
            this.destinationPath('app/scripts/route.json')
          );

          console.log("handling via controller");
          this.composeWith('controller', { arguments: ['main'] }, {
              local: require.resolve('../controller/index.js')
          });

      }else{
          //
      }
    }

    if (this.angularcode.animateModule) { enabledComponents.push('angular-animate/angular-animate.js'); }
    if (this.angularcode.ariaModule) { enabledComponents.push('angular-aria/angular-aria.js'); }
    if (this.angularcode.cookiesModule) { enabledComponents.push('angular-cookies/angular-cookies.js'); }
    if (this.angularcode.messagesModule) { enabledComponents.push('angular-messages/angular-messages.js'); }
    if (this.angularcode.resourceModule) { enabledComponents.push('angular-resource/angular-resource.js'); }
    if (this.angularcode.sanitizeModule) { enabledComponents.push('angular-sanitize/angular-sanitize.js'); }
    if (this.angularcode.touchModule) { enabledComponents.push('angular-touch/angular-touch.js'); }



  },

  end: {
    showGuidance: function() {
      if (!this.options['skip-message']) {
        console.log(
          '\nNow that everything is set up, you\'ll need to execute a build. ' +
          '\nThis is done by running' +
          '\n  grunt build' +
          '\n' +
          '\nWork with your files by using' +
          '\n  grunt serve' +
          '\n' +
          '\nThis sets a watch on your files and also opens your project in ' +
          '\na web browser using live-reload, so that any changes you make are ' +
          '\ninstantly visible.'
        );
      }
    },

    saveConfig: function() {
      this.config.save();
    }
  }

});
