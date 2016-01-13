'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var github = require('github');
var fs = require('fs');

var proxy = process.env.http_proxy || process.env.HTTP_PROXY ||
  process.env.https_proxy || process.env.HTTPS_PROXY || null;
var githubOptions = {
  version: '3.0.0'
};

if (proxy) {
  var proxyUrl = url.parse(proxy);
  githubOptions.proxy = {
    host: proxyUrl.hostname,
    port: proxyUrl.port
  };
}

var GitHubApi = require('github');
var github = new GitHubApi(githubOptions);

if (process.env.GITHUB_TOKEN) {
  github.authenticate({
    type: 'oauth',
    token: process.env.GITHUB_TOKEN
  });
}

var githubUser = function(name, cb, log) {
  github.user.getFrom({
    user: name
  }, function (err, res) {
    if (err) {
      log.error('Cannot fetch your github profile. Make sure you\'ve typed it correctly.');
      res = {
        name: '',
        email: '',
        html_url: ''
      };
    }

    cb(JSON.parse(JSON.stringify(res)));
  });
}

module.exports = yeoman.generators.Base.extend({
  constructor: function() {
    yeoman.generators.Base.apply(this, arguments);
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('generator-stem-markup') + ' generator!'
    ));

    var prompts = [
      {
        type: 'input',
        name: 'githubUser',
        message: 'Would you mind telling me your username on GitHub?',
        default: 'someuser'
      },
      {
        type: 'input',
        name: 'applicationName',
        message: 'What\'s the base name of your app?',
        default: this.appname
      }
    ];

    this.prompt(prompts, function (props) {
      this.props = props;

      done();
    }.bind(this));
  },

  configuring: {
    userInfo: function () {
      var done = this.async();

      githubUser(this.props.githubUser, function (res) {
        this.props.realname = res.name;
        this.props.email = res.email !== null ? res.email : '';
        this.props.githubUrl = res.html_url;

        done();
      }.bind(this), this.log);
    },

    package: function() {
      // Generate our package.json. Make sure to also include the required dependencies for styles
      var defaultSettings = this.fs.readJSON(this.templatePath('package.json'));
      var packageSettings = {
        name: this.props.applicationName,
        version: '0.0.1',
        description: '',
        main: '',
        scripts: defaultSettings.scripts,
        repository: {
          type: 'git',
          url: 'git://github.com/' + this.props.githubUser + '/' + this.props.applicationName + '.git',
        },
        keywords: [],
        author: {
          name: this.props.realname,
          email: this.props.email,
          url: this.props.githubUrl,
        },
        devDependencies: defaultSettings.devDependencies,
        dependencies: defaultSettings.dependencies
      };

      this.fs.writeJSON(this.destinationPath('package.json'), packageSettings);
    },
  },

  writing: function () {
    var excludeList = [
      'LICENSE',
      'README.md',
      'CHANGELOG.md',
      'node_modules',
      'package.json',
      '.travis.yml'
    ];

    // Get all files in our repo and copy the ones we should
    fs.readdir(this.sourceRoot(), (err, items) => {
      var baseRootPath = path.resolve(this.sourceRoot());

      for(var item of items) {
        // Skip the item if it is in our exclude list
        if(excludeList.indexOf(item) !== -1) {
          continue;
        }

        // Copy all items to our root
        var fullPath = path.join(baseRootPath, item);
        if(fs.lstatSync(fullPath).isDirectory()) {
          this.bulkDirectory(item, item);
        } else {
          if (item === '.npmignore') {
            this.copy(item, '.gitignore');
          } else {
            this.copy(item, item);
          }
        }
      }
    });
  },

  install: function () {
    this.installDependencies();
    this.runInstall('bower', null, {cwd: './dev/vendor'});
  }
});
