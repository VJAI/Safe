(function () {

  'use strict';

  module.exports = function (grunt) {

    // Load all the grunt tasks.
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times.
    require('time-grunt')(grunt);

    // Config object.
    var config = {
      src: 'src',                                 // working directory
      tests: 'tests',                             // unit tests folder
      dist: 'cordova',                            // distribution folder
      supported: ['ios', 'android'],              // supported platforms
      platform: grunt.option('platform') || 'ios' // current target platform
    };

    grunt.initConfig({

      config: config,

      // Make sure code styles are up to par and there are no obvious mistakes.
      jshint: {
        options: {
          jshintrc: '.jshintrc',
          reporter: require('jshint-stylish')
        },
        src: [
          'Gruntfile.js',
          '<%= config.src %>/js/**/*.js',
          '!<%= config.src %>/js/templates.js'
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
              src: '<%= config.src %>/**/*.js',
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
          exclude: ['<%= config.src %>/main.js'],
          port: 9002,
          reporters: ['mocha', 'coverage'],
          preprocessors: {
            '<%= config.src %>/js/views/*.js': 'coverage'
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

      // Empty the 'www' folder.
      clean: {
        options: {
          force: true
        },
        dist: ['<%= config.dist %>/www']
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
          src: ['<%= config.src %>/html/{,*/}*.handlebars'],
          dest: '<%= config.src %>/js/templates.js'
        }
      },

      // Optimize the javascript files using r.js tool.
      requirejs: {
        compile: {
          options: {
            baseUrl: '<%= config.src %>/js',
            mainConfigFile: '<%= config.src %>/js/main.js',
            almond: true,
            include: ['main'],
            out: '<%= config.dist %>/www/js/index.min.js',
            optimize: 'uglify'
          }
        }
      },

      // Optimize the CSS files.
      cssmin: {
        compile: {
          files: {
            '<%= config.dist %>/www/css/index.min.css': [
              'bower_components/ratchet/dist/css/ratchet.css',
              'bower_components/ratchet/dist/css/ratchet-theme-<%= config.platform %>.css',
              '<%= config.src %>/css/safe.css',
              '<%= config.src %>/css/safe.<%= config.platform %>.css'
            ]
          }
        }
      },

      // Change the script and css references to optimized ones.
      processhtml: {
        dist: {
          files: {
            '<%= config.dist %>/www/index.html': ['<%= config.src %>/index.<%= config.platform %>.html']
          }
        }
      },

      // Copy the static resources like fonts, images to the platform specific folder.
      copy: {
        config: {
          expand: true,
          dot: true,
          src: 'config.xml',
          dest: 'cordova'
        },
        fonts: {
          expand: true,
          dot: true,
          cwd: 'bower_components/ratchet/fonts',
          dest: '<%= config.dist %>/www/fonts',
          src: ['{,*/}*.*']
        },
        images: {
          expand: true,
          dot: true,
          cwd: '<%= config.src %>/images',
          dest: '<%= config.dist %>/www/images',
          src: ['{,*/}*.*']
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
                connect.static(config.src),
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
            base: '<%= config.dist %>/www',
            keepalive: true
          }
        }
      },

      // Watch files for changes and runs tasks based on the changed files.
      watch: {

        // Watch grunt file.
        gruntfile: {
          files: ['Gruntfile.js']
        },

        // Watch javascript files.
        js: {
          files: [
            '<%= config.src %>/js/**/*.js'
          ],
          tasks: ['jshint:src'],
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
            '<%= config.src %>/index.<%= config.platform %>.html',
            '<%= config.src %>/css/safe.css',
            '<%= config.src %>/css/safe.<%= config.platform %>.css'
          ]
        }
      },

      // Install node packages and bower components.
      /*jshint camelcase:false*/
      auto_install: {
        local: {}
      },

      // Task to install platforms and plugins and to build, emulate and deploy the app.
      cordovacli: {
        options: {
            path: './<%= config.dist %>'
        },
        install: {
          options: {
            command: ['create', 'platform', 'plugin'],
            platforms: '<%= config.supported %>',
            plugins: [
              'camera',
              'file',
              'dialogs',
              'https://github.com/VJAI/simple-crypto.git',
              'https://github.com/wymsee/cordova-imageResizer.git'
            ],
            id: 'com.prideparrot.safe',
            name: 'Safe'
          }
        },
        build: {
          options: {
            command: 'build',
            platforms: ['<%= config.platform %>']
          }
        },
        emulate: {
          options: {
            command: 'emulate',
            platforms: ['<%= config.platform %>']
          }
        },
        deploy: {
          options: {
            command: 'run',
            platforms: ['<%= config.platform %>']
          }
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

    grunt.registerTask('cordova-build', [
      'cordovacli:build'
    ]);

    grunt.registerTask('cordova-emulate', [
      'cordovacli:emulate'
    ]);

    grunt.registerTask('cordova-deploy', [
      'cordovacli:deploy'
    ]);

    // Start the server and watch for changes.
    grunt.registerTask('default', [
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

    // Run karma tests.
    grunt.registerTask('tests', [
      'jshint:tests',
      'karma'
    ]);

    // Install node packages and bower components.
    // Create cordova project, add platforms and plugins.
    grunt.registerTask('create', [
      'auto_install',
      'cordovacli:install'
    ]);

    // Build the app.
    grunt.registerTask('build', [
      'buildweb',
      'cordovacli:build'
    ]);

    // Run the app in emulator.
    grunt.registerTask('emulate', [
      'buildweb',
      'cordovacli:emulate'
    ]);

    // Deploy the app in device.
    grunt.registerTask('deploy', [
      'buildweb',
      'cordovacli:deploy'
    ]);
  };
})();
