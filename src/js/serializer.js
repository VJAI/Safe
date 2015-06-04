// Serializes javascript object to string and vice-versa.
define([
  'jquery',
  'underscore',
  'settings',
  'session',
  'adapters/crypto'
], function (
  $,
  _,
  settings,
  session,
  crypto
) {

  'use strict';

  return {
    serialize: function (item) {
      var result = JSON.stringify(item);

      if (settings.encrypt) {
        return crypto.encrypt(session.retrieve('key'), result);
      }

      return _.resolve(result);
    },

    deserialize: function (data) {
      var d = $.Deferred();

      if (settings.encrypt) {
        crypto.decrypt(session.retrieve('key'), data)
          .done(function (result) {
            d.resolve(JSON.parse(result));
          })
          .fail(d.reject);
      } else {
        d.resolve(JSON.parse(data));
      }

      return d.promise();
    }
  };
});
