// A simple 'localstorage' based keychain.
define(['jquery', 'adapters/crypto', 'settings'], function ($, crypto, settings) {

  'use strict';

  return {

    containsKey: function (key) {
      return window.localStorage.getItem(key) ? true : false;
    },
    
    getForKey: function (key) {
      var result = window.localStorage.getItem(key);
      return crypto.decrypt(settings.encDecKey, result);
    },

    setForKey: function (key, value) {
      var d = $.Deferred();

      crypto.encrypt(settings.encDecKey, value)
        .done(function (encValue) {
          window.localStorage.setItem(key, encValue);
          d.resolve();
        }).fail(d.reject);

      return d.promise();
    },

    removeForKey: function (key) {
      window.localStorage.removeItem(key);
    }
  };
});