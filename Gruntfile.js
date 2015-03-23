(function () {

  'use strict';

  var cordova = require('cordova');

  module.exports = function (grunt) {

    // Load all the grunt tasks.
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times.
    require('time-grunt')(grunt);

    // Config object.
    var config = {
      app: 'app', // working directory
      dist: 'www', // distribution folder
      tests: 'tests', // tests folder
      platform: grunt.option('platform') || 'ios' // target platform
    };

    grunt.initConfig({

      config: config,

      // Watch files for changes and runs tasks based on the changed files.
      watch: {

        // Watch grunt file.
        gruntfile: {
          files: ['Gruntfile.js']
        },

        // Watch javascript files.
        js: {
          files: [
            '<%= config.app %>/js/**/*.js'
          ],
          tasks: ['jshint:src'],
          options: {
            livereload: true
          }
        },

        // Watch handlebar templates.
        handlebars: {
          files: [
            '<%= config.app %>/html/{,*/}*.handlebars'
          ],
          tasks: ['handlebars'],
          options: {
            livereload: true
          }
        },

        // Watch html and css files.
        livereload: {
          options: {
            livereload: '<%= connect.options.livereload %>'
          },
          files: [
            '<%= config.app %>/index.<%= config.platform %>.html',
            '<%= config.app %>/css/safe.css',
            '<%= config.app %>/css/safe.<%= config.platform %>.css'
          ]
        }
      },

      // Grunt server settings
      connect: {
        options: {
          hostname: 'localhost',
          open: true,
          livereload: true
        },
        app: {
          options: {
            middleware: function (connect) {
              return [
                connect.static(config.app),
                connect().use('/bower_components', connect.static('./bower_components'))
              ];
            },
            port: 9000,
            open: {
              target: 'http://localhost:9000/index.<%= config.platform %>.html'
            }
          }
        },
        dist: {
          options: {
            port: 9001,
            base: '<%= config.dist %>',
            keepalive: true
          }
        }
      },

      // Make sure code styles are up to par and there are no obvious mistakes
      jshint: {
        options: {
          jshintrc: '.jshintrc',
          reporter: require('jshint-stylish')
        },
        src: [
          'Gruntfile.js',
          '<%= config.app %>/js/**/*.js',
          '!<%= config.app %>/js/templates.js'
        ],
        tests: [
          '<%= config.tests %>/**/*.js'
        ]
      },

      // Run jasmine tests.
      karma: {
        unit: {
          basePath: '',
          singleRun: true,
          frameworks: ['jasmine-jquery', 'jasmine', 'requirejs'],
          files: [
            {
              src: 'bower_components/**/*.js',
              included: false
            },
            {
              src: '<%= config.app %>/**/*.js',
              included: false
            },
            {
              src: '<%= config.tests %>/*spec.js',
              included: false
            },
            {
              src: '<%= config.tests %>/main.js'
            }
          ],
          exclude: ['<%= config.app %>/main.js'],
          port: 9002,
          reporters: ['mocha', 'coverage'],
          preprocessors: {
            '<%= config.app %>/js/**/*.js': 'coverage'
          },
          coverageReporter: {
            type: 'text'
          },
          plugins: [
            'karma-phantomjs-launcher',
            'karma-jasmine-jquery',
            'karma-jasmine',
            'karma-requirejs',
            'karma-coverage',
            'karma-mocha-reporter'
          ],
          browsers: ['PhantomJS']
        }
      },

      // Empty the distribution folder.
      clean: {
        options: {
          force: true
        },
        dist: ['<%= config.dist %>']
      },

      // Precompile the handlebar templates.
      handlebars: {
        compile: {
          options: {
            amd: true,
            processName: function (filepath) {
              var pieces = filepath.split('/');
              return pieces[pieces.length - 1].split('.')[0];
            }
          },
          src: ['<%= config.app %>/html/{,*/}*.handlebars'],
          dest: '<%= config.app %>/js/templates.js'
        }
      },

      // Optimize the javascript files using r.js tool.
      requirejs: {
        compile: {
          options: {
            baseUrl: '<%= config.app %>/js',
            mainConfigFile: '<%= config.app %>/js/main.js',
            almond: true,
            include: ['main'],
            out: '<%= config.dist %>/js/index.min.js',
            optimize: 'uglify'
          }
        }
      },

      // Optimize the CSS files.
      cssmin: {
        compile: {
          files: {
            '<%= config.dist %>/css/index.min.css': [
              'bower_components/ratchet/dist/css/ratchet.css',
              'bower_components/ratchet/dist/css/ratchet-theme-<%= config.platform %>.css',
              '<%= config.app %>/css/safe.css',
              '<%= config.app %>/css/safe.<%= config.platform %>.css'
            ]
          }
        }
      },

      // Change the script and css references to optimized ones.
      processhtml: {
        dist: {
          files: {
            '<%= config.dist %>/index.html': ['<%= config.app %>/index.<%= config.platform %>.html']
          }
        }
      },

      // Copy the static resources like fonts, images to the platform specific folder.
      copy: {
        fonts: {
          expand: true,
          dot: true,
          cwd: 'bower_components/ratchet/fonts',
          dest: '<%= config.dist %>/fonts',
          src: ['{,*/}*.*']
        },
        images: {
          expand: true,
          dot: true,
          cwd: '<%= config.app %>/images',
          dest: '<%= config.dist %>/images',
          src: ['{,*/}*.*']
        }
      }
    });

    // Build the web resources.
    grunt.registerTask('buildweb', [
      'jshint',
      'karma',
      'clean',
      'handlebars',
      'requirejs',
      'cssmin',
      'processhtml',
      'copy'
    ]);

    // Start the server and watch for changes.
    grunt.registerTask('serve', [
      'jshint:src',
      'handlebars',
      'connect:app',
      'watch'
    ]);

    // Start the server with distribution code.
    grunt.registerTask('dist', [
      'buildweb',
      'connect:dist'
    ]);

    // Cordova: build the application.
    grunt.registerTask('cordova-build', 'Build the application for single platform', function () {
      var done = this.async();
      cordova.build(config.platform, done);
    });

    // Cordova: emulate the application.
    grunt.registerTask('cordova-emulate', 'Emulate the application for single platform', function () {
      var done = this.async();
      cordova.emulate(config.platform, done);
    });

    // Cordova: run the application.
    grunt.registerTask('cordova-run', 'Run the application for single platform', function () {
      var done = this.async();
      cordova.run(config.platform, done);
    });

    // Default task
    grunt.registerTask('default', [
      'jshint:src',
      'buildweb'
    ]);

    // Run karma tests.
    grunt.registerTask('tests', [
      'jshint:tests',
      'karma'
    ]);

    // Build the application.
    grunt.registerTask('build', [
      'buildweb',
      'cordova-build'
    ]);

    // Emulate the application.
    grunt.registerTask('emulate', [
      'buildweb',
      'cordova-emulate'
    ]);

    // Run the application.
    grunt.registerTask('run', [
      'buildweb',
      'cordova-run'
    ]);
  };
})();
