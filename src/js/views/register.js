define([
  'underscore',
  'backbone',
  'adapters/notification',
  'session',
  'templates'
], function (
  _,
  Backbone,
  notification,
  session,
  templates
) {

  'use strict';

  // Registration view.
  // Renders the registration view and handles the UI logic.
  var RegisterView = Backbone.View.extend({

    // Set the template.
    template: templates.register,

    // Wire-up handlers for DOM events.
    events: {
      'submit #register-form': 'register'
    },

    // Set the bindings for input elements with model properties.
    bindings: {
      '#password': 'password',
      '#security-question': 'securityQuestion',
      '#security-answer': 'securityAnswer'
    },

    initialize: function (options) {

      // If model is not passed through error.
      if (!this.model) {
        throw new Error('model is required');
      }

      // If security questions not passed or collection empty throw error.
      if (!(options && options.securityQuestions && options.securityQuestions.length)) {
        throw new Error('security questions required');
      }

      // Store the passed security questions in some property.
      this.securityQuestions = options.securityQuestions;

      // Create a new guid and set it as the encryption/decryption key for the model.
      this.model.set('key', _.guid());

      // Hook the handler to enable/disable security question whenever the password changes.
      this.listenTo(this.model, 'change:password', this.enableQuestion);

      // Hook the handler to enable/disable answer textbox when the selected security question changes.
      this.listenTo(this.model, 'change:securityQuestion', this.enableAnswer);

      // Hook the handler to enable/disable the register button whenever the model changes.
      this.listenTo(this.model, 'change', this.enableRegister);
    },

    // Render the view, bind the controls and cache the elements.
    render: function () {
      this.$el.html(this.template({
        questions: this.securityQuestions
      }));

      this.stickit();

      this.$securityQuestion = this.$('#security-question');
      this.$securityAnswer = this.$('#security-answer');
      this.$register = this.$('#register');

      return this;
    },

    // Enable the security question dropdown when the password is valid.
    enableQuestion: function () {
      if (this.model.isValid('password')) {
        this.$securityQuestion.removeAttr('disabled');
      } else {
        this.$securityQuestion.attr('disabled', 'disabled');
      }
    },

    // Clear the answer textbox, enable it if the selected question is valid.
    enableAnswer: function () {
      this.model.set('securityAnswer', null);

      if (this.model.isValid('securityQuestion') && this.model.get('securityQuestion') !== 'Select a question') {
        this.$securityAnswer.removeAttr('disabled');
      } else {
        this.$securityAnswer.attr('disabled', 'disabled');
      }
    },

    // Enable the register button when the model is valid.
    enableRegister: function () {
      if (this.model.isValid(true)) {
        this.$register.removeAttr('disabled');
      } else {
        this.$register.attr('disabled', 'disabled');
      }
    },

    // Register button event handler.
    register: function (e) {
      e.preventDefault();

      // Alert the user if all the fields are not filled.
      if (!this.model.isValid(true)) {
        notification.alert('Fill all the fields.', 'Error', 'Ok');
        return;
      }

      // Disable the register button to prevent multiple submits.
      this.$register.attr('disabled', 'disabled');

      // Save the credential, security info and redirect him to '#login'.
      this.model.save()
        .done(_.bind(function () {
          // Update the state session variable and navigate to login page.
          session.store('state', 'LOGGED_OUT');
          this.navigateTo('#login');
        }, this))
        .fail(_.bind(function () {
          notification.alert('Registration failed. Please try again.', 'Error', 'Ok')
            .done(_.bind(function () {
              this.$register.removeAttr('disabled');
            }, this));
        }, this));
    }
  });

  return RegisterView;
});
