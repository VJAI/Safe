define([
  'backbone',
  'underscore',
  'adapters/notification',
  'session',
  'templates'
], function (
  Backbone,
  _,
  notification,
  session,
  templates
) {

  'use strict';

  // Change password view.
  // Renders the view to change password. Handles all the UI logic associated with it.
  var ChangePasswordView = Backbone.View.extend({

    // Set the template.
    template: templates.changepassword,

    // Wire-up the handlers for DOM events.
    events: {
      'submit #changepassword-form': 'changePassword'
    },

    // Set the bindings.
    bindings: {
      '#password': 'password'
    },

    initialize: function (options) {

      // If model is not passed throw error.
      if (!this.model) {
        throw new Error('model is required');
      }
      
      // If credential is not passed throw error.
      if(!options.credential) {
        throw new Error('credential is required');
      }
      
      // Store the passed credential in a property.
      this.credential = options.credential;

      // Enable/disable the change button whenever password changes.
      this.listenTo(this.model, 'change:password', this.enableChange);
    },

    render: function () {
      var state = session.retrieve('state');

      this.$el.html(this.template({
        isAuthenticated: state === 'LOGGED_IN',
        backToUrl: state === 'LOGGED_IN' ? '#settings' : '#login'
      }));

      this.stickit();

      this.$change = this.$('#change');

      return this;
    },

    // Enable the change button when password text is valid.
    enableChange: function () {
      if (this.model.isValid('password')) {
        this.$change.removeAttr('disabled');
      } else {
        this.$change.attr('disabled', 'disabled');
      }
    },

    // Change button event handler.
    changePassword: function (e) {
      e.preventDefault();

      // Alert the user if the form is submitted with empty password.
      if (!this.model.isValid('password')) {
        notification.alert('Enter the password.', 'Error', 'Ok');
        return;
      }

      // Disable the change button.
      this.$change.attr('disabled', 'disabled');

      var error = function () {
        notification.alert('Failed to change password. Please try again.', 'Error', 'Ok')
          .done(_.bind(function () {
            this.$change.removeAttr('disabled');
          }, this));
      };

      // Fetch the credential, set the new password, save and navigate to login page.
      this.credential.fetch()
        .then(_.bind(function () {
          this.credential.set('password', this.model.get('password'));
          return this.credential.save();
        }, this), _.bind(error, this))
        .then(_.bind(function () {
          session.store('state', 'LOGGED_OUT');
          session.remove('key');
          this.navigateTo('#login');
        }, this), _.bind(error, this));
    }
  });

  return ChangePasswordView;
});