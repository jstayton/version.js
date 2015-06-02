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
            versionjs: '1.7.1',
            loadtest: '3.0.0'
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
          tags: ['master'],
          urls: [
            'http://localhost:8000/_SpecRunner.html',
            'http://localhost:8000/_SpecRunner.html?versionjs=1.6.2'
          ],
          browsers: (function () {
            var compact = {
                  'chrome': {
                    '*': 'Windows 8.1'
                  },
                  'firefox': {
                    '4': 'Windows 8.1',
                    '*': 'Windows 8.1'
                  },
                  'internet explorer': {
                    '9': 'Windows 7',
                    '10': 'Windows 8',
                    '11': 'Windows 8.1'
                  },
                  'iphone': {
                    '6.1': 'OS X 10.8',
                    '7.1': 'OS X 10.9'
                  },
                  'opera': {
                    '11': 'Windows 7',
                    '12': 'Windows 7'
                  },
                  'safari': {
                    '6': 'OS X 10.8',
                    '7': 'OS X 10.9'
                  }
                },
                expanded = [];

            Object.keys(compact).forEach(function (browserName) {
              Object.keys(compact[browserName]).forEach(function (version) {
                var platforms = compact[browserName][version];

                if (!Array.isArray(platforms)) {
                  platforms = [platforms];
                }

                platforms.forEach(function (platform) {
                  var options = {
                        browserName: browserName
                      };

                  if (version !== '*') {
                    options.version = version;
                  }

                  if (platform) {
                    options.platform = platform;
                  }

                  expanded.push(options);
                });
              });
            });

            return expanded;
          })()
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
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-saucelabs');

    testTasks.push('jasmine:without-qs:build', 'connect', 'saucelabs-jasmine');
  }

  grunt.registerTask('test', testTasks);
  grunt.registerTask('default', ['test', 'concat', 'uglify']);
};
