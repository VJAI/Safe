define([
  'jquery',
  'underscore',
  'backbone',
  'adapters/persistentfilestorage',
  'session',
  'serializer'
], function (
  $,
  _,
  Backbone,
  persistentfilestorage,
  session,
  serializer
) {

  'use strict';

  // Model used to represent the actual image file.
  var File = Backbone.Model.extend({

    defaults: {
      data: null // file content
    },

    // Validation rules.
    validation: {
      data: {
        required: true
      }
    },

    // Override the sync method to persist the photo in filesystem.
    sync: function (method, model, options) {
      var d = $.Deferred(),
        resp;

      switch (method) {
      case 'read':
        resp = this.findFile();
        break;
      case 'update':
        resp = this.writeFile(model);
        break;
      case 'delete':
        resp = this.deleteFile();
        break;
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

    findFile: function () {
      var d = $.Deferred();

      persistentfilestorage.readFromFile(this.getPhotoPath(), true)
        .then(_.bind(function (persistedImage) {
          return serializer.deserialize(persistedImage);
        }, this), d.reject)
        .then(_.bind(function (image) {
          d.resolve(image);
        }, this), d.reject);

      return d.promise();
    },

    writeFile: function (model) {
      var d = $.Deferred();

      serializer.serialize(model)
         .done(_.bind(function (encImage) {
          persistentfilestorage.writeToFile(this.getPhotoPath(), encImage);
          d.resolve();
        }, this))
        .fail(d.reject);

      return d.promise();
    },

    deleteFile: function () {
      return persistentfilestorage.deleteFile(this.getPhotoPath());
    },

    getPhotoPath: function () {
      return 'Photos/' + this.id + '.dat';
    }
  });

  return File;
});
