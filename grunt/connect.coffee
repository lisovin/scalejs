module.exports = (grunt) ->
    path = require 'path'
    test:
        options:
            port: 8888
            keepalive: true
            debug: true
            base: [ 'test', '.']
