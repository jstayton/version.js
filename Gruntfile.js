module.exports = function (grunt) {
  'use strict';

  var banner = grunt.file.read('src/version.js').match(/\/\*[\s\S]*?\*\/\n/)[0];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        banner: banner,
        stripBanners: {
          block: true
        }
      },
      build: {
        src: 'src/version.js',
        dest: 'build/version.js'
      }
    },
    connect: {
      server: {}
    },
    jasmine: {
      withoutqs: {
        options: {
          specs: 'test/spec/**/*.js',
          template: 'test/runner.tmpl'
        },
        src: 'src/**/*.js'
      },
      withqs: {
        options: {
          specs: 'test/spec/**/*.js',
          template: 'test/runner.tmpl',
          templateOptions: {
            qs: '1.7.1'
          }
        },
        src: 'src/**/*.js'
      }
    },
    jshint: {
      Gruntfile: {
        options: {
          jshintrc: '.jshintrc'
        },
        files: {
          src: 'Gruntfile.js'
        }
      },
      src: {
        options: {
          jshintrc: 'src/.jshintrc'
        },
        files: {
          src: 'src/**/*.js'
        }
      },
      test: {
        options: {
          jshintrc: 'test/spec/.jshintrc'
        },
        files: {
          src: 'test/spec/**/*.js'
        }
      }
    },
    'saucelabs-jasmine': {
      all: {
        testname: 'version.js',
        tags: ['master'],
        urls: [
          'http://localhost:8000/_SpecRunner.html',
          'http://localhost:8000/_SpecRunner.html?versionjs=1.6.2'
        ],
        concurrency: 3,
        browsers: (function () {
          var compact = {
                'chrome': {
                  '*': ['Windows 2008', 'Mac 10.8', 'Linux']
                },
                'firefox': {
                  '3.6': ['Windows 2012', 'Linux'],
                  '*': ['Windows 2012', 'Mac 10.6', 'Linux']
                },
                'internet explorer': {
                  '6': 'Windows 2003',
                  '7': 'Windows 2003',
                  '8': 'Windows 2003',
                  '9': 'Windows 2008',
                  '10': 'Windows 2012'
                },
                'ipad': {
                  '4.3': 'Mac 10.6',
                  '5.1': 'Mac 10.8',
                  '6': 'Mac 10.8'
                },
                'iphone': {
                  '4.3': 'Mac 10.6',
                  '5.1': 'Mac 10.8',
                  '6': 'Mac 10.8'
                },
                'opera': {
                  '11': 'Windows 2008',
                  '12': ['Windows 2008', 'Linux']
                },
                'safari': {
                  '5': ['Windows 2008', 'Mac 10.6'],
                  '6': 'Mac 10.8'
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
    },
    uglify: {
      options: {
        banner: banner
      },
      build: {
        'build/version.min.js': 'src/version.js'
      }
    },
    watch: {
      files: '<%= jshint.all %>',
      tasks: 'test'
    }
  });

  grunt.registerTask('jasmine-remove-reporter', 'Removes reporter.js script from the spec runner HTML.', function () {
    var specRunner = grunt.file.read('_SpecRunner.html');

    specRunner = specRunner.replace(/<script src=\".*?reporter\.js\"><\/script>/, '');

    grunt.file.write('_SpecRunner.html', specRunner);
  });

  grunt.registerTask('jasmine-delete-runner', 'Deletes the spec runner HTML file.', function () {
    grunt.file.delete('_SpecRunner.html');
  });

  var testTasks = ['jshint', 'jasmine'];

  if (process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY) {
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-saucelabs');

    testTasks.push('jasmine:withoutqs:build', 'jasmine-remove-reporter', 'connect', 'saucelabs-jasmine',
                   'jasmine-delete-runner');
  }

  grunt.registerTask('test', testTasks);
  grunt.registerTask('default', ['test', 'concat', 'uglify']);

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
};
