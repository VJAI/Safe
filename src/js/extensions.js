define([
  'jquery',
  'underscore',
  'backbone',
  'router',
  'validation',
  'stickit',
  'touch',
  'backbonelocalstorage'
], function (
  $,
  _,
  Backbone,
  router
) {

  'use strict';

  function S4() {
    /*jslint bitwise: true */
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }

  // Add custom methods to underscore.
  _.mixin({
    // extension method to create GUID.
    guid: function () {
      return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4());
    },

    // return a promise object with resolve.
    resolve: function () {
      var d = $.Deferred();
      d.resolve.apply(null, arguments);
      return d.promise();
    },

    // return a promise object with reject.
    reject: function () {
      var d = $.Deferred();
      d.reject.apply(null, arguments);
      return d.promise();
    }
  });

  // Extend backbone model to perform custom validation.
  _.extend(Backbone.Model.prototype, Backbone.Validation.mixin);

  // Extend backbone views with custom methods.
  _.extend(Backbone.View.prototype, {

    // Stop listening to events and remove the children.
    ghost: function () {
      this.unstickit();
      this.stopListening();
      this.undelegateEvents();
      this.$el.html('');
      return this;
    },

    // A delegate to router's navigate method.
    navigateTo: function (page, trigger) {
      router.navigate(page, trigger || true);
    }
  });
});
