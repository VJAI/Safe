define([
  'underscore',
  'backbone',
  'templates',
  'adapters/crypto',
  'adapters/persistentfilestorage',
  'adapters/notification'
], function (
  _,
  Backbone,
  templates,
  crypto,
  persistentfilestorage,
  notification
) {

  'use strict';

  // Photo view.
  // Renders the photo view and handles the UI logic.
  var PhotoView = Backbone.View.extend({

    template: templates.photo,
    
    initialize: function(options) {
      
      // If model is not passed throw error.
      if(!this.model) {
        throw new Error('model is required');
      }
      
      // If file model is not passed throw error.
      if(!(options && options.file)) {
        throw new Error('file is required');
      }
      
      // Set the passed file model to a property.
      this.file = options.file;
    },

    render: function () {
      this.$el.html(this.template(this.model.toJSON()));
      this.$photo = this.$('#photo');
      this.loadImage();

      return this;
    },

    loadImage: function () {
      this.file.fetch()
        .done(_.bind(function () {
          this.$photo.attr('src', 'data:image/png;base64,' + this.file.get('data'));
        }, this))
        .fail(function () {
          notification.alert('Failed to load image. Please try again.', 'Error', 'Ok');
        });
    }
  });

  return PhotoView;
});