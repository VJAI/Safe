define(['backbone', 'underscore', 'adapters/notification', 'templates'], function (Backbone, _, notification, templates) {

  'use strict';

  // Change security info view.
  // Renders the view to change the security question and answer.
  // Handles all the UI logic.
  var ChangeSecurityInfoView = Backbone.View.extend({

    // Set the template.
    template: templates.changesecurityinfo,

    // Wire-up the handlers for DOM events.
    events: {
      'submit #changesecurityinfo-form': 'changeSecurityInfo'
    },

    // Set the bindings.
    bindings: {
      '#security-question': 'securityQuestion',
      '#security-answer': 'securityAnswer'
    },

    initialize: function (options) {

      // If model is not passes throw error.
      if (!this.model) {
        throw new Error('model is required');
      }

      // If credential is not passed throw error.
      if (!options.credential) {
        throw new Error('credential is required');
      }      
      
      // If not security questions passed throw error.
      if (!(options && options.securityQuestions && options.securityQuestions.length)) {
        throw new Error('security questions required');
      }

      // Store the passed credential in a property.
      this.credential = options.credential;
      
      // Store the passed questions in a property.
      this.securityQuestions = options.securityQuestions;

      // Listen to model change events to enable/disable controls.
      this.listenTo(this.model, 'change:securityQuestion', this.enableAnswer);
      this.listenTo(this.model, 'change:securityAnswer', this.enableSave);
    },

    render: function () {
      // We need to pass the security questions also to the view, so let's create a viewmodel.
      var viewModel = this.model.toJSON();
      viewModel.questions = this.securityQuestions;

      this.$el.html(this.template(viewModel));
      this.stickit();

      this.$securityAnswer = this.$('#security-answer');
      this.$save = this.$('#save');

      return this;
    },

    enableAnswer: function () {
      this.model.set('securityAnswer', null);

      if (this.model.get('securityQuestion') && this.model.get('securityQuestion') !== 'Select a question') {
        this.$securityAnswer.removeAttr('disabled');
      } else {
        this.$securityAnswer.attr('disabled', 'disabled');
      }
    },

    enableSave: function () {
      if (this.model.isValid('securityQuestion') && this.model.isValid('securityAnswer')) {
        this.$save.removeAttr('disabled');
      } else {
        this.$save.attr('disabled', 'disabled');
      }
    },

    // Save button event handler.
    changeSecurityInfo: function (e) {

      e.preventDefault();

      // Alert the user if the form is submitted with empty question or answer.
      if (!(this.model.isValid('securityQuestion') && this.model.isValid('securityAnswer'))) {
        notification.alert('Submit security question with answer.', 'Error', 'Ok');
        return;
      }

      // Disable the save button to avoid multiple submits.
      this.$save.attr('disabled', 'disabled');

      var error = function () {
        notification.alert('Failed to change security info. Please try again.', 'Error', 'Ok')
          .done(_.bind(function () {
            this.$save.removeAttr('disabled');
          }, this));
      };

      // Fetch the credential, set the security question/answer, save and navigate to settings page.
      this.credential.fetch()
        .then(_.bind(function () {
          this.credential.set({
            securityQuestion: this.model.get('securityQuestion'),
            securityAnswer: this.model.get('securityAnswer')
          });
          return this.credential.save();
        }, this), _.bind(error, this))
        .then(_.bind(function () {
          this.navigateTo('#settings');
        }, this), _.bind(error, this));
    }
  });

  return ChangeSecurityInfoView;
});