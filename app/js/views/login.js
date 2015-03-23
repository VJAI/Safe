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

  // Login view.
  // Renders the login view and handles the UI logic.
  var LoginView = Backbone.View.extend({

    // Set the template to render the markup.
    template: templates.login,

    // Wire-up handlers for DOM events.
    events: {
      'submit #login-form': 'login'
    },

    // Set the bindings for input elements with model properties.
    bindings: {
      '#password': 'password'
    },

    initialize: function (options) {

      // if model is not passed throw error.
      if (!this.model) {
        throw new Error('model is required');
      }

      // if the persisted credential is not passed throw error.
      if (!(options && options.credential)) {
        throw new Error('credential is required');
      }

      // Store the actual credential in some property for easy access later.
      this.credential = options.credential;

      // Enable/disable the login button whenever the password changes.
      this.listenTo(this.model, 'change:password', this.enableLogin);
    },

    render: function () {
      // Render the view.
      this.$el.html(this.template());

      // Bind input elements with model properties.
      this.stickit();

      // Cache DOM elements for easy access.
      this.$login = this.$('#login');

      return this;
    },

    // Enable the login button only if the 'password' property has some text.
    enableLogin: function () {
      if (this.model.isValid('password')) {
        this.$login.removeAttr('disabled');
      } else {
        this.$login.attr('disabled', 'disabled');
      }
    },

    // Login form submit handler.
    login: function (e) {

      // Prevent the form's default action.
      e.preventDefault();

      // Alert the user and return if the form is submitted with empty password.
      if (!this.model.isValid('password')) {
        notification.alert('Enter the password.', 'Error', 'Ok');
        return;
      }

      // Disable the login button to prevent multiple submits. 
      // We'll enable it back after authentication is over.
      this.$login.attr('disabled', 'disabled');

      // Fetch the persisted credential and authenticate.
      this.credential.fetch()
        .done(_.bind(function () {

          // Authenticate the user. 
          // On success, update the session vars and redirect him to '#photos', else show respective error message.
          if (this.model.get('password') === this.credential.get('password')) {

            // Update the 'state' to 'LOGGED_IN' and store the encryption-decryption key in session.
            session.store('state', 'LOGGED_IN');
            session.store('key', this.credential.get('key'));

            this.navigateTo('#photos');
          } else {
            // Show error and re-enable the login button.
            notification.alert('Invalid password.', 'Error', 'Ok')
              .done(_.bind(function () {
                this.$login.removeAttr('disabled');
              }, this));
          }
        }, this))
        .fail(_.bind(function () {
          notification.alert('Failed to retrieve credential. Please try again.', 'Error', 'Ok')
            .done(_.bind(function () {
              this.$login.removeAttr('disabled');
            }, this));
        }, this));
    }
  });

  return LoginView;
});