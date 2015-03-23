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

  // Forgot password view.
  // Renders the view for forgot password and handles the UI actions.
  var ForgotPasswordView = Backbone.View.extend({

    // Set the template.
    template: templates.forgotpassword,

    // Wire handlers for DOM events.
    events: {
      'submit #forgotpassword-form': 'verifyAnswer'
    },

    // Set the bindings.
    bindings: {
      '#security-answer': 'securityAnswer'
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

      // Set the passed credential to a property.
      this.credential = options.credential;

      // Hook the handler to enable/disable submit button when security answer changes.
      this.listenTo(this.model, 'change:securityAnswer', this.enableSubmit);
    },

    // Get the security question and render the view.
    render: function () {
      this.$el.html(this.template(this.model.toJSON()));
      this.stickit();

      this.$verify = this.$('#verify');

      return this;
    },

    // Clear the answer textbox and enable it if the selected question is valid.
    enableSubmit: function () {
      if (this.model.isValid('securityAnswer')) {
        this.$verify.removeAttr('disabled');
      } else {
        this.$verify.attr('disabled', 'disabled');
      }
    },

    // Verify button event handler.
    verifyAnswer: function (e) {
      e.preventDefault();

      // Alert the user if the form is submitted with empty answer.
      if (!this.model.isValid('securityAnswer')) {
        notification.alert('Enter the answer.', 'Error', 'Ok');
        return;
      }

      // Disable the button to prevent multiple clicks.
      this.$verify.attr('disabled', 'disabled');

      // Verify the answer and on success set the state variable to 'VERIFIED' and navigate to change password page.
      if (this.model.get('securityAnswer') === this.credential.get('securityAnswer')) {
        session.store('state', 'VERIFIED');
        this.navigateTo('#changepassword');
      } else {
        notification.alert('Invalid answer.', 'Error', 'Ok')
          .done(_.bind(function () {
            this.$verify.removeAttr('disabled');
          }, this));
      }
    }
  });

  return ForgotPasswordView;
});