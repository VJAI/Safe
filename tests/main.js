(function () {

  'use strict';

  var allTestFiles = [];
  var TEST_REGEXP = /(spec|test)\.js$/i;

  var pathToModule = function (path) {
    return '../../' + path.replace(/^\/base\//, '').replace(/\.js$/, '');
  };

  Object.keys(window.__karma__.files).forEach(function (file) {
    if (TEST_REGEXP.test(file)) {
      // Normalize paths to RequireJS module names.
      allTestFiles.push(pathToModule(file));
    }
  });

  require.config({
    baseUrl: '/base/src/js',

    paths: {
      jquery: '../../bower_components/jquery/dist/jquery',
      underscore: '../../bower_components/underscore/underscore',
      backbone: '../../bower_components/backbone/backbone',
      validation: '../../bower_components/backbone.validation/dist/backbone-validation-amd',
      stickit: '../../bower_components/backbone.stickit/backbone.stickit',
      touch: '../../bower_components/backbone.touch/backbone.touch',
      handlebars: '../../bower_components/handlebars/handlebars.runtime',
      almond: '../../bower_components/almond/almond'
    },

    shim: {
      jquery: {
        exports: '$'
      },

      underscore: {
        deps: ['jquery'],
        exports: '_'
      },

      backbone: {
        deps: ['underscore', 'jquery'],
        exports: 'Backbone'
      },

      handlebars: {
        exports: 'Handlebars'
      }
    },

    // dynamically load all test files
    deps: allTestFiles,

    // we have to kickoff jasmine, as it is asynchronous
    callback: window.__karma__.start
  });
})();
