// Session module based on HTML5 sessionStorage.
define(function() {

  'use strict';

  return {
    retrieve: function(key) {
      return window.sessionStorage.getItem(key);
    },

    store: function(key, value) {
      window.sessionStorage.setItem(key, value);
    },

    remove: function(key) {
      window.sessionStorage.removeItem(key);
    },

    clear: function() {
      window.sessionStorage.clear();
    }
  };
});
