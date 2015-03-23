define(['jquery', 'underscore'], function ($, _) {

  'use strict';

  return {

    alert: function (message) {
      var d = $.Deferred();
      window.alert(message);
      d.resolve();
      return d.promise();
    },

    confirm: function (message) {
      var d = $.Deferred();
      var result = window.confirm(message);

      if(result) {
        d.resolve(1);
      } else {
        d.reject();
      }

      return d.promise();
    },

    prompt: function (message) {
      var d = $.Deferred();
      window.prompt(message);
      d.resolve();
      return d.promise();
    },

    beep: _.noop,

    vibrate: _.noop
  };
});
