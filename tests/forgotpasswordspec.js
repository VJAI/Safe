define([
  'underscore',
  'extensions',
  'session',
  'adapters/notification',
  'models/credential',
  'views/forgotpassword',
  'templates'
], function (
  _,
  extensions,
  session,
  notification,
  Credential,
  ForgotPasswordView,
  templates
) {

  'use strict';

  describe('forgotpassword view', function () {

    var view,
      model,
      persistedModel = new Credential({
        id: 'Safe-Credential',
        password: 'S@f3',
        key: '007',
        securityQuestion: 'CODE WELCOME',
        securityAnswer: 'CODE GET LOST'
      });

    beforeEach(function () {
      session.clear();

      spyOn(notification, 'alert').and.callFake(function () {
        return _.resolve();
      });

      model = new Credential({
        securityQuestion: persistedModel.get('securityQuestion')
      });

      view = new ForgotPasswordView({
        model: model,
        credential: persistedModel
      });
    });

    afterEach(function () {
      if (view) {
        view.remove();
      }
    });

    describe('when constructed', function () {

      describe('without model', function () {
        it('should throw error', function () {
          expect(function () {
            new ForgotPasswordView();
          }).toThrow(new Error('model is required'));
        });
      });

      describe('without credential', function () {
        it('should throw error', function () {
          expect(function () {
            new ForgotPasswordView({
              model: model
            });
          }).toThrow(new Error('credential is required'));
        });
      });

      describe('with required arguments', function () {
        it('should exist with properties initialized', function () {
          expect(view).toBeDefined();
          expect(view.model).toBe(model);
          expect(view.credential).toBe(persistedModel);
          expect(view.template).toBe(templates.forgotpassword);
        });
      });
    });

    describe('when rendered', function () {

      beforeEach(function () {
        view.render();
      });

      it('should display the security question', function () {
        expect(view.$el.find('#security-question')).toHaveText(persistedModel.get('securityQuestion') + '?');
      });

      it('should contain security answer textbox empty, maxlength 15 and autocomplete off', function () {
        var $securityanswer = view.$el.find('#security-answer');

        expect($securityanswer).toHaveValue('');
        expect($securityanswer).toHaveAttr('maxlength', '15');
        expect($securityanswer).toHaveAttr('autocomplete', 'off');
      });

      it('should contain submit button as disabled', function () {
        expect(view.$el.find('#verify')).toBeDisabled();
      });
    });

    describe('when changes', function () {

      beforeEach(function () {
        view.render();
      });

      describe('with the security answer textbox empty', function () {

        beforeEach(function () {
          view.$el.find('#security-answer').val('').trigger('change');
        });

        it('then security answer property of the model should be empty', function () {
          expect(view.model.get('securityAnswer')).toBe('');
        });

        it('then the submit button should be disabled', function () {
          expect(view.$el.find('#verify')).toBeDisabled();
        });
      });

      describe('with the security answer textbox not empty', function () {

        beforeEach(function () {
          view.$el.find('#security-answer').val('S@f3').trigger('change');
        });

        it('then the security security answer property of the model should be empty', function () {
          expect(view.model.get('securityAnswer')).toBe('S@f3');
        });

        it('then the submit button should be disabled', function () {
          expect(view.$el.find('#verify')).not.toBeDisabled();
        });
      });

      describe('when form is submitted', function () {

        describe('without any security answer', function () {

          beforeEach(function () {
            view.$el.find('#security-answer').val('').trigger('change');
            view.$el.find('#forgotpassword-form').trigger('submit');
          });

          it('should alert an error', function () {
            expect(notification.alert).toHaveBeenCalledWith('Enter the answer.', 'Error', 'Ok');
          });
        });

        describe('with invalid security answer', function () {

          beforeEach(function () {
            view.$el.find('#security-answer').val('CODE WELCOME YOU').trigger('change');
            view.$el.find('#forgotpassword-form').trigger('submit');
          });

          it('should alert an error', function () {
            expect(notification.alert).toHaveBeenCalledWith('Invalid answer.', 'Error', 'Ok');
          });

          it('the verify button should be enabled', function () {
            expect(view.$el.find('#verify')).not.toBeDisabled();
          });
        });

        describe('with valid security answer', function () {

          beforeEach(function () {
            spyOn(session, 'store');
            spyOn(view, 'navigateTo').and.callThrough();

            view.$el.find('#security-answer').val(persistedModel.get('securityAnswer')).trigger('change');
            view.$el.find('#forgotpassword-form').trigger('submit');
          });

          it('the submit button should be disabled', function () {
            expect(view.$el.find('#verify')).toBeDisabled();
          });

          it('should update the state session variable as VERIFIED', function () {
            expect(session.store).toHaveBeenCalledWith('state', 'VERIFIED');
          });

          it('should navigate to chnagepassword page', function () {
            expect(view.navigateTo).toHaveBeenCalledWith('#changepassword');
          });
        });
      });

    });

  });
});