// Crypto module.
// A wrapper for the cordova crypto plugin.
// Contains method to encrypt and decrypt data.
define(['jquery'], function ($) {

  'use strict';

  var getSimpleCrypto = function() {
    return cordova.require('com.disusered.simplecrypto.SimpleCrypto');
  };
  
  return {
    encrypt: function (key, data) {
      var d = $.Deferred();      
      getSimpleCrypto().encrypt(key, data, d.resolve, d.reject);      
      return d.promise();
    },

    decrypt: function (key, data) {
      var d = $.Deferred();      
      getSimpleCrypto().decrypt(key, data, d.resolve, d.reject);      
      return d.promise();
    }
  };
});