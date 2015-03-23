// Credential model.
define(['jquery', 'underscore', 'backbone', 'keychain'], function ($, _, Backbone, keychain) {

  'use strict';

  // Model that represents credential.
  var Credential = Backbone.Model.extend({

    defaults: {
      password: null,
      key: null, // encryption-decryption key for photos
      securityQuestion: null,
      securityAnswer: null
    },

    // Validations. All properties are required!
    validation: {
      password: {
        required: true
      },
      key: {
        required: true
      },
      securityQuestion: {
        required: true
      },
      securityAnswer: {
        required: true
      }
    },

    // Override the sync method to persist the credential in keychain.
    sync: function (method, model, options) {
      var d = $.Deferred(),
        resp;

      switch (method) {
      case 'read':
        resp = this.findModel();
        break;
      case 'update':
        resp = this.createOrUpdate();
        break;
      case 'delete':
        throw new Error('Not implemented');
      }

      resp.done(function (result) {
        if (options && options.success) {
          options.success(result);
        }
        d.resolve(result);
      }).fail(function (error) {
        if (options && options.error) {
          options.error(error);
        }
        d.reject(error);
      });

      if (options && options.complete) {
        options.complete(resp);
      }

      return d.promise();
    },

    // Returns the persisted model as JSON.
    findModel: function () {
      var d = $.Deferred();

      keychain.getForKey(this.id)
        .done(_.bind(function (persistedData) {
          d.resolve(JSON.parse(persistedData));
        }, this))
        .fail(d.reject);

      return d.promise();
    },

    // Save or update the persisted model.
    createOrUpdate: function () {
      return keychain.setForKey(this.id, JSON.stringify(this.toJSON()));
    }
  });

  return Credential;
});