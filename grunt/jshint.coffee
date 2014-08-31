module.exports = ( grunt ) ->
    options = grunt.file.readJSON '.jslintrc'
    options.reporter = require 'jshint-stylish'

    options: options
    compile: ['src/**/*.js']

