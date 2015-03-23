define(['jquery', 'underscore'], function ($, _) {

  'use strict';

  return {
    encrypt: function (key, data) {
      return _.resolve(data);
    },

    decrypt: function (key, data) {
      return _.resolve(data);
    }
  };
});
