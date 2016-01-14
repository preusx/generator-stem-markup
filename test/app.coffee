path = require 'path'
assert = require 'yeoman-assert'
helpers = require 'yeoman-test'

describe 'generator-stem-markup:app', ->
  generator = {}

  beforeEach (done) ->
    helpers.run path.join(__dirname, '../generators/app')
      .inTmpDir()
      .withOptions({
        'skip-welcome-message': true,
        'skip-install': true
      })
      .withPrompts({
        githubUser: 'preusx',
        applicationName: 't',
      })
      .on('ready', (instance) ->
        generator = instance
      )
      .on('end', done)

  describe '#createFiles', ->
    it 'should generate dot files'
