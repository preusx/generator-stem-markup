'use strict';
let path = require('path');
let assert = require('yeoman-assert');
let helpers = require('yeoman-test');

describe('generator-stem-markup:app', function() {
  let generator;

  before((done) => {
    helpers.run(path.join(__dirname, '../generators/app'))
      .inTmpDir()
      .withOptions({
        'skip-welcome-message': true,
        'skip-install': true
      })
      .withPrompts({
        githubUser: '',
        applicationName: 't',
      })
      .on('ready', (instance) => {
        generator = instance;
      })
      .on('end', done);
  });

  describe('#createFiles', function() {
    // it('should generate dot files');
  });

});
