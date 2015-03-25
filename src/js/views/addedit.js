define([
  'underscore',
  'backbone',
  'adapters/camera',
  'adapters/imageresizer',
  'adapters/crypto',
  'adapters/persistentfilestorage',
  'adapters/notification',
  'templates'
], function (
  _,
  Backbone,
  camera,
  imageresizer,
  crypto,
  persistentfilestorage,
  notification,
  templates
) {

  'use strict';

  // Add/edit view.
  // Renders the view to add/edit photo. Handles all the UI logic associated with it.
  var AddEdit = Backbone.View.extend({

    // Set the template.
    template: templates.addedit,

    // Hook handlers to events.
    events: {
      'click #addphoto': 'addPhoto',
      'click #save': 'submit',
      'submit #addedit-form': 'save',
      'click #delete': 'delete'
    },

    // Input elements-model bindings.
    bindings: {
      '#description': 'description'
    },

    initialize: function (options) {

      // If model is not passed throw error.
      if (!this.model) {
        throw new Error('model is required');
      }

      // If file model is not passed throw error.
      if (!(options && options.file)) {
        throw new Error('file is required');
      }

      this.file = options.file;

      // A flag to store whether the view is rendered to add or edit photo.
      this.isEdit = this.model.id ? true : false;
      
      // If collection is not passed for add throw error.
      if(!this.isEdit && !this.collection) {
        throw new Error('collection is required');
      }

      // Call the enable 'done' button handler when user selects a photo.
      this.listenTo(this.file, 'change:data', this.updateImage);

      // On change of the model, validate the model and enable the 'done' button.
      this.listenTo(this.model, 'change', this.enableDone);
    },

    render: function () {
      // Render the view.
      this.$el.html(this.template(this.model.toJSON()));

      // Set the bindings.
      this.stickit();

      // Cache the DOM elements for easy access/manipulation.
      this.$save = this.$('#save');
      this.$photo = this.$('#photo');
      this.$delete = this.$('#delete');
      this.$form = this.$('#addedit-form');

      // If edit, load the image!
      if (this.isEdit) {
        this.file.fetch()
          .fail(function () {
            notification.alert('Failed to load image. Please try again.', 'Error', 'Ok');
          });
      }

      return this;
    },

    // add photo event handler.
    addPhoto: function (e) {
      e.preventDefault();

      camera.getPictureFromLibrary()
        .done(_.bind(function (base64image) {
          this.file.set('data', base64image);
          this.createThumbnail();
        }, this));
    },

    submit: function () {
      this.$form.submit();
    },

    // Save the photo model.
    save: function (e) {
      e.preventDefault();

      // If the models are not valid display error.
      if (!(this.model.isValid(true) && this.file.isValid(true))) {
        notification.alert('Some of the required fields are missing.', 'Error', 'Ok');
        return;
      }

      // Disable the button to avoid saving multiple times.
      this.$save.attr('disabled', 'disabled');

      // Update the last saved date.
      this.model.set('lastSaved', Date(), {
        silent: true
      });

      // Function to save the file in file-system.
      var saveFile = function () {

        // If it's in edit model set the 'id' parameter.
        if (!this.isEdit) {
          this.file.set('id', this.model.id, {
            silent: true
          });
        }

        // Write the base64 content into the file system. 
        this.file.save()
          .done(_.bind(function () {
            this.navigateTo(this.isEdit ? '#photos/' + this.model.id : '#photos');
          }, this))
          .fail(_.bind(error, this));
      };

      // Common error function.
      var error = function () {
        notification.alert('Failed to save photo. Please try again.', 'Error', 'Ok')
          .done(_.bind(function () {
            this.saving = false;
            this.$save.removeAttr('disabled');
          }, this));
      };

      this.saving = true;

      // If it's edit save else create.
      if (this.model.id) {
        this.model.save()
          .done(_.bind(saveFile, this))
          .fail(_.bind(error, this));
      } else {
        this.model.localStorage = this.collection.localStorage;
        this.collection.create(this.model, {
          wait: true,
          success: _.bind(saveFile, this),
          error: _.bind(error, this)
        });
      }
    },

    // Delete the model and the file.
    delete: function () {
      this.$delete.attr('disabled', 'disabled');

      notification.confirm('Are you sure want to delete this photo?')
        .done(_.bind(function (r) {

          if (r === 1) {
            var deleteError = function () {
              notification.alert('Failed to delete. Please try again.', 'Error', 'Ok')
                .done(_.bind(function () {
                  this.$delete.removeAttr('disabled');
                }, this));
            };

            this.file.destroy()
              .then(_.bind(function () {
                return this.model.destroy();
              }, this), _.bind(deleteError, this))
              .then(_.bind(function () {
                this.navigateTo('#photos');
              }, this), _.bind(deleteError, this));
          } else {
            this.$delete.removeAttr('disabled');
          }
        }, this));
    },

    // Update the image tag.
    updateImage: function () {
      this.$photo.attr('src', 'data:image/png;base64,' + this.file.get('data'));
    },

    // Resize the image and create thumbnail. 
    createThumbnail: function () {
      var imageData = this.file.get('data'),
        resizeWidth = 42;

      imageresizer.resize(imageData, resizeWidth, 0)
        .done(_.bind(function (resizedImage) {
          this.model.set('thumbnail', resizedImage.imageData);
        }, this))
        .fail(function () {
          notification.alert('Failed to create thumbnail.', 'Error', 'Ok');
        });
    },
    
    // Enable the 'done' button if the models are valid.
    enableDone: function () {
      if (!this.saving && this.model.isValid(true) && this.file.isValid(true)) {
        this.$save.removeAttr('disabled');
      } else {
        this.$save.attr('disabled', 'disabled');
      }
    }
  });

  return AddEdit;
});