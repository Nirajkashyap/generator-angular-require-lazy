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
    // TODO: remove engine in future and use yeoman html-wiring instead
    this.engine = require('ejs').render

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

    this.env.options['app-suffix'] = this.options['app-suffix'] || 'App';
    this.scriptAppName = this.appname + angularUtils.appName(this);

    this.env.options.appPath = this.options.appPath || 'app';
    this.config.set('appPath', this.env.options.appPath);
    this.appPath = this.env.options.appPath;

    this.pkg = require('../../package.json');
    this.sourceRoot(path.join(__dirname, '../templates/common'));
  },

  prompting: function () {
    // Have Yeoman greet the user.


    var cb = this.async();
    var compass;

    this.log(yosay(
      'Welcome to the astonishing ' + chalk.red('generator-angular-require-lazy') + ' generator!'
    ));

    if (!this.options['skip-welcome-message']) {
      this.log(yosay());
      this.log('Out of the box I include Bootstrap and some AngularJS recommended modules.\n');
    }

    if (this.options.minsafe) {
      this.log.error(
        'The --minsafe flag has been removed. ngAnnotate is used to handle this during the build.\n'
      );
    }

    this.prompt([{
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
        return props.bootstrap && compass;
      }
    },{
      type: 'list',
      name: 'router',
      default: true,
      message: 'What Angular router would you like to use?',
      choices: ['ngRoute', 'uiRouter'],
      ffilter: function( val ) { return val.toLowerCase(); }
    }, {
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
        checked: true
      }, {
        value: 'ariaModule',
        name: 'angular-aria.js',
        checked: false
      }, {
        value: 'messagesModule',
        name: 'angular-messages.js',
        checked: false
      }]
    }], function (props) {
      this.compass = props.compass;
      this.bootstrap = props.bootstrap;
      this.compassBootstrap = props.compassBootstrap;

      var hasMod = function (mod) { return props.modules.indexOf(mod) !== -1; };

      this.cookiesModule = hasMod('cookiesModule');
      this.resourceModule = hasMod('resourceModule');
      this.sanitizeModule = hasMod('sanitizeModule');

      this.animateModule = hasMod('animateModule');
      this.touchModule = hasMod('touchModule');

      this.routeModule = {};
      if(props.router === 'uiRouter'){
        this.routeModule.ngroute = false;

        this.routeModule.uirouter = true;
      } else {
        this.routeModule.uirouter = false;

        this.routeModule.ngroute = true;
      }


      this.ariaModule = hasMod('ariaModule');
      this.messagesModule = hasMod('messagesModule');

      var angMods = [];

      if (this.cookiesModule) {
        angMods.push('ngCookies');
      }

      if (this.resourceModule) {
        angMods.push('ngResource');
      }

      if (this.sanitizeModule) {
        angMods.push('ngSanitize');
      }

      if (this.animateModule) {
        angMods.push('ngAnimate');
        this.env.options.ngAnimate = true;
      }

      if (this.touchModule) {
        angMods.push('ngTouch');
        this.env.options.ngTouch = true;
      }

      if (this.routeModule.ngroute) {
        angMods.push('ngRoute');
        this.env.options.routeModule.ngRoute = true;
      }

      if (this.routeModule.uirouter) {
        angMods.push('ui.router');
        this.env.options.routeModule.uirouter = true;
      }

      if (this.ariaModule) {
        angMods.push('ngAria');
      }

      if (this.messagesModule) {
        angMods.push('ngMessages');
      }

      this.env.options.angularDeps = angMods;

      cb();
    }.bind(this));
  },

  configuring: {
    bowerConfig: function() {
      this.fs.copyTpl(
        this.templatePath('root/_bowerrc'),
        this.destinationPath('.bowerrc')
      );

      this.fs.copyTpl(
        this.templatePath('root/_bower.json'),
        this.destinationPath('bower.json'),
        {
          appSlugName: this.appSlugName,
          animateModule: this.animateModule,
          ariaModule: this.ariaModule,
          cookiesModule: this.cookiesModule,
          messagesModule: this.messagesModule,
          resourceModule: this.resourceModule,
          routeModule: this.routeModule,
          sanitizeModule: this.sanitizeModule,
          touchModule: this.touchModule,
          bootstrap: this.bootstrap,
          compassBootstrap: this.compassBootstrap,
          appPath: this.appPath,
          scriptAppName: this.scriptAppName
        }
      );
    },

    packageJson: function() {
      this.fs.copyTpl(
        this.templatePath('root/_package.json'),
        this.destinationPath('package.json'),
        {
          appSlugName: this.appSlugName,
          compass: this.compass
        }
      );
    },

    gruntfile: function() {
      this.template('root/_Gruntfile.js', 'Gruntfile.js');
    },

    editorConfig: function() {
      this.copy('../../templates/common/root/.editorconfig', '.editorconfig');
    },

    jscsrc: function() {
      this.copy('../../templates/common/root/.jscsrc', '.jscsrc');
    },

    git: function() {
      this.copy('../../templates/common/root/.gitattributes', '.gitattributes');
      this.copy('../../templates/common/root/gitignore', '.gitignore');
    },

    jshint: function() {
      this.copy('../../templates/common/root/.jshintrc', '.jshintrc');
    },

    readme: function() {
      this.fs.copyTpl(
        this.templatePath('root/README.md'),
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
      var cssFile = 'styles/main.' + (this.compass ? 's' : '') + 'css';
      this.copy(
        path.join('app', cssFile),
        path.join(this.appPath, cssFile)
      );
    },

    indexHtml: function() {

      this.routeModule = this.env.options.routeModule;
      
      this.indexFile = this.engine(this.read('app/index.html'), this);
      this.indexFile = this.indexFile.replace(/&apos;/g, "'");
      this.write(path.join(this.appPath, 'index.html'), this.indexFile);
    },

    requireJsAppConfig: function() {
      this.template('../../templates/common/scripts/main.js', path.join(this.appPath, 'scripts/main.js'));
    },

    requireJsTestConfig: function() {
      this.template('../../templates/common/scripts/test-main.js', 'test/test-main.js');
    },

    webFiles: function() {
      this.sourceRoot(path.join(__dirname, '../templates/common'));
      var appPath = this.options.appPath;
      var copy = function (dest) {
        this.copy(path.join('app', dest), path.join(this.appPath, dest));
      }.bind(this);

      copy('404.html');
      copy('favicon.ico');
      copy('robots.txt');
      copy('views/main.html');
      this.directory(path.join('app', 'images'), path.join(this.appPath, 'images'));
    },

    appFile: function() {
      this.angularModules = this.env.options.angularDeps;
      this.routeModule = this.env.options.routeModule;

      this.template('../../templates/javascript/app.js', path.join(this.appPath, 'scripts/app.js'));
    }


  },

  install: function () {
    this.installDependencies();
  }
});
