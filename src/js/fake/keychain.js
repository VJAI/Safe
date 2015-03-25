define(['jquery', 'adapters/crypto'], function ($, crypto) {

  'use strict';

  var encDecKey = 'TEST';

  /* jslint unused: false */
  return {

    containsKey: function (key, serviceName) {
      var d = $.Deferred();

      if (window.localStorage.getItem(key)) {
        d.resolve(true);
      } else {
        d.resolve(false);
      }

      return d.promise();
    },

    getForKey: function (key, serviceName) {
      var result = window.localStorage.getItem(key);
      return crypto.decrypt(encDecKey, result);
    },

    setForKey: function (key, serviceName, value) {
      var d = $.Deferred();

      crypto.encrypt(encDecKey, value)
        .done(function (encValue) {
          window.localStorage.setItem(key, encValue);
          d.resolve();
        }).fail(d.reject);

      return d.promise();
    },

    removeForKey: function (key, serviceName) {
      var d = $.Deferred();
      window.localStorage.removeItem(key);
      d.resolve();
      return d.promise();
    }
  };
});