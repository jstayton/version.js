'use strict';

module.exports = function (grunt) {
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  var testTasks = [];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: grunt.file.read('src/version.js').match(/\/\*[\s\S]*?\*\/\n/)[0],
    concat: {
      build: {
        options: {
          banner: '<%= banner %>',
          stripBanners: {
            block: true
          }
        },
        src: 'src/version.js',
        dest: 'build/version.js'
      }
    },
    connect: {
      server: {}
    },
    jasmine: {
      'without-qs': {
        options: {
          helpers: 'test/helpers/**/*.js',
          specs: 'test/spec/**/*.js',
          template: 'test/runner.tmpl',
          vendor: 'test/vendor/**/*.js'
        },
        src: 'src/**/*.js'
      },
      'with-qs': {
        options: {
          helpers: 'test/helpers/**/*.js',
          specs: 'test/spec/**/*.js',
          template: 'test/runner.tmpl',
          templateOptions: {
            qs: true,
            versionjs: '1.7.1',
            testload: '3.0.0'
          },
          vendor: 'test/vendor/**/*.js'
        },
        src: 'src/**/*.js'
      }
    },
    jshint: {
      options: {
        jshintrc: true
      },
      gruntfile: 'Gruntfile.js',
      src: 'src/**/*.js',
      test: 'test/spec/**/*.js'
    },
    'saucelabs-jasmine': {
      all: {
        options: {
          testname: 'Version.js',
          build: process.env.TRAVIS_BUILD_NUMBER,
          tags: [process.env.TRAVIS_BRANCH],
          urls: [
            'http://localhost:8000/_SpecRunner.html',
            'http://localhost:8000/_SpecRunner.html?versionjs=1.6.2&testload=3.0.0'
          ],
          browsers: [
            ['Windows 8.1', 'chrome', 44],
            ['Windows 8.1', 'firefox', 40],
            ['Windows 8.1', 'firefox', 4],
            ['Windows 8.1', 'internet explorer', 11],
            ['Windows 7', 'internet explorer', 9],
            ['OS X 10.10', 'safari', 8],
            ['OS X 10.8', 'safari', 6]
          ]
        }
      }
    },
    uglify: {
      build: {
        options: {
          banner: '<%= banner %>',
          report: 'gzip'
        },
        files: {
          'build/version.min.js': 'src/version.js'
        }
      }
    },
    watch: {
      jasmine: {
        files: 'src/**/*.js',
        tasks: 'jasmine'
      },
      jshintGruntfile: {
        files: '<%= jshint.gruntfile.files.src %>',
        tasks: 'jshint:gruntfile'
      },
      jshintSrc: {
        files: '<%= jshint.src.files.src %>',
        tasks: 'jshint:src'
      },
      jshintTest: {
        files: '<%= jshint.test.files.src %>',
        tasks: 'jshint:test'
      },
      concat: {
        files: '<%= concat.build.src %>',
        tasks: 'concat'
      }
    }
  });

  testTasks.push('jshint', 'jasmine');

  if (process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY) {
    testTasks.push('jasmine:without-qs:build', 'connect', 'saucelabs-jasmine');
  }

  grunt.registerTask('test', testTasks);
  grunt.registerTask('default', ['test', 'concat', 'uglify']);
};
