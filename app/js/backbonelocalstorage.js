// Customized localstorage based persistent store for backbone. 
// Ref: https://github.com/jeromegn/Backbone.localStorage/blob/master/backbone.localStorage.js
define([
  'jquery',
  'backbone',
  'underscore',
  'serializer'
], function (
  $,
  Backbone,
  _,
  serializer
) {

  'use strict';

  Backbone.LocalStorage = function (name) {
    this.name = name;
    var store = this.localStorage().getItem(this.name);
    this.records = (store && store.split(',')) || [];
  };

  _.extend(Backbone.LocalStorage.prototype, {

    // Save the data to localstorage.
    save: function () {
      this.localStorage().setItem(this.name, this.records.join(','));
    },

    // Serialize the newly created model and persist it.
    // Invoked by 'collection.create'.
    create: function (model) {
      var d = $.Deferred();

      if (!model.id && model.id !== 0) {
        model.id = _.guid();
        model.set(model.idAttribute, model.id);
      }

      serializer.serialize(model)
        .done(_.bind(function (data) {
          this.localStorage().setItem(this.itemName(model.id), data);
          this.records.push(model.id.toString());
          this.save();
          d.resolve(this.find(model));
        }, this))
        .fail(d.reject);

      return d.promise();
    },

    // Update the persisted model.
    update: function (model) {
      var d = $.Deferred();

      serializer.serialize(model)
        .done(_.bind(function (data) {
          this.localStorage().setItem(this.itemName(model.id), data);
          var modelId = model.id.toString();
          if (!_.contains(this.records, modelId)) {
            this.records.push(modelId);
            this.save();
          }
          d.resolve(this.find(model));
        }, this))
        .fail(d.reject);

      return d.promise();
    },

    find: function (model) {
      return serializer.deserialize(this.localStorage().getItem(this.itemName(model.id)));
    },

    // http://stackoverflow.com/questions/27100664/exit-from-for-loop-when-any-jquery-deferred-fails/27118636#27118636
    findAll: function () {
      var d = $.Deferred();

      var promises = this.records.map(_.bind(function (record) {
        return serializer.deserialize(this.localStorage().getItem(this.itemName(record)));
      }, this));

      $.when.apply($, promises).done(function () {
        d.resolve(Array.prototype.slice.apply(arguments));
      }).fail(d.reject);

      return d.promise();
    },

    destroy: function (model) {
      var d = $.Deferred();
      this.localStorage().removeItem(this.itemName(model.id));
      var modelId = model.id.toString();

      for (var i = 0; i < this.records.length; i++) {
        if (this.records[i] === modelId) {
          this.records.splice(i, 1);
        }
      }

      this.save();
      d.resolve(model);

      return d.promise();
    },

    clear: function () {
      var local = this.localStorage(),
        itemRe = new RegExp('^' + this.name + '-');

      local.removeItem(this.name);

      for (var k in local) {
        if (itemRe.test(k)) {
          local.removeItem(k);
        }
      }

      this.records.length = 0;
    },

    storageSize: function () {
      return this.localStorage().length;
    },

    itemName: function (id) {
      return this.name + '-' + id;
    },

    localStorage: function () {
      return window.localStorage;
    }
  });

  // TODO: need to eliminate this.
  function result(object, property) {
    if (object === null) {
      return void 0;
    }
    var value = object[property];
    return (typeof value === 'function') ? object[property]() : value;
  }

  // Localstorage sync.
  Backbone.LocalStorage.sync = function (method, model, options) {
    var d = $.Deferred(),
      resp,
      store = result(model, 'localStorage') || result(model.collection, 'localStorage');

    switch (method) {
    case 'read':
      resp = (model.id !== undefined ? store.find(model) : store.findAll());
      break;
    case 'create':
      resp = store.create(model);
      break;
    case 'update':
      resp = store.update(model);
      break;
    case 'delete':
      resp = store.destroy(model);
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
  };

  // Override the backbone sync with localstorage sync. 
  Backbone.sync = function (method, model, options) {
    return Backbone.LocalStorage.sync.apply(this, [method, model, options]);
  };

  return Backbone.LocalStorage;
});