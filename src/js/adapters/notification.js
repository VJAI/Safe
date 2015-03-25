// Notification module.
// A wrapper to the cordova notification plugin.
// Contains methods to alert, vibrate, beep etc.
define(['jquery'], function ($) {

  'use strict';

  return {
    
    alert: function (message, title, buttonName) {
      var d = $.Deferred();      
      navigator.notification.alert(message, d.resolve, title, buttonName);      
      return d.promise();
    },

    confirm: function (message, title, buttonLabels) {
      var d = $.Deferred();     
      navigator.notification.confirm(message, d.resolve, title, buttonLabels);      
      return d.promise();
    },

    prompt: function (message, title, buttonLabels, defaultText) {
      var d = $.Deferred();      
      navigator.notification.prompt(message, d.resolve, title, buttonLabels, defaultText);      
      return d.promise();
    },

    beep: function (times) {
      navigator.notification.beep(times);
    },

    vibrate: function (milliseconds) {
      navigator.notification.vibrate(milliseconds);
    }
  };
});