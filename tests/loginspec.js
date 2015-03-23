define([
  'jquery',
  'underscore',
  'extensions',
  'session',
  'adapters/notification',
  'models/credential',
  'views/login',
  'templates'
], function (
  $,
  _,
  extensions,
  session,
  notification,
  Credential,
  LoginView,
  templates
) {

  'use strict';

  describe('login view', function () {

    var view,
      model,
      persistedModel;

    beforeEach(function () {

      spyOn(notification, 'alert').and.callFake(function () {
        return _.resolve();
      });

      model = new Credential();

      persistedModel = new Credential({
        id: 'Safe-Credential'
      });

      view = new LoginView({
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
            new LoginView();
          }).toThrow(new Error('model is required'));
        });
      });

      describe('without credential', function () {
        it('should throw error', function () {
          expect(function () {
            new LoginView({
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
          expect(view.template).toBe(templates.login);
        });
      });
    });

    describe('when rendered', function () {

      beforeEach(function () {
        view.render();
      });

      it('should contain password textbox empty, maxlength 15 and autocomplete off', function () {
        var $password = view.$el.find('#password');

        expect($password).toHaveValue('');
        expect($password).toHaveAttr('maxlength', '15');
        expect($password).toHaveAttr('autocomplete', 'off');
      });

      it('should contain submit button as disabled', function () {
        expect(view.$el.find('#login')).toBeDisabled();
      });

      it('should contain the forgot password link', function () {
        expect(view.$el.find('.forgot-password')).toHaveAttr('href', '#forgotpassword');
      });
    });

    describe('when changes', function () {

      beforeEach(function () {
        view.render();
      });

      describe('with the password textbox empty', function () {

        beforeEach(function () {
          view.$el.find('#password').val('').trigger('change');
        });

        it('then password property of the model should be empty', function () {
          expect(view.model.get('password')).toBe('');
        });

        it('then the submit button should be disabled', function () {
          expect(view.$el.find('#login')).toBeDisabled();
        });
      });

      describe('with the password textbox not empty', function () {

        beforeEach(function () {
          view.$el.find('#password').val('S@f3').trigger('change');
        });

        it('then the password property of the model should not be empty', function () {
          expect(view.model.get('password')).toBe('S@f3');
        });

        it('then the submit button should be enabled', function () {
          expect(view.$el.find('#login')).not.toBeDisabled();
        });
      });

      describe('when form is submitted', function () {

        describe('without any password', function () {

          beforeEach(function () {
            view.$el.find('#password').val('').trigger('change');
            view.$el.find('#login-form').trigger('submit');
          });

          it('should alert an error', function () {
            expect(notification.alert).toHaveBeenCalledWith('Enter the password.', 'Error', 'Ok');
          });
        });

        describe('with invalid password', function () {

          describe('and fetch failed', function () {

            beforeEach(function () {
              spyOn(persistedModel, 'fetch').and.callFake(function () {
                return _.reject();
              });

              view.$el.find('#password').val('pass123').trigger('change');
              view.$el.find('#login-form').trigger('submit');
            });

            it('should alert an error', function () {
              expect(notification.alert).toHaveBeenCalledWith('Failed to retrieve credential. Please try again.', 'Error', 'Ok');
            });

            it('the submit button should be enabled', function () {
              expect(view.$el.find('#login')).not.toBeDisabled();
            });
          });

          describe('and fetch succeeded', function () {

            beforeEach(function () {
              spyOn(persistedModel, 'fetch').and.callFake(function () {
                var d = $.Deferred();
                persistedModel.set({
                  password: 'S@f3',
                  key: '007',
                  securityQuestion: 'CODE WELCOME',
                  securityAnswer: 'CODE GET LOST'
                });
                d.resolve();
                return d.promise();
              });

              view.$el.find('#password').val('pass123').trigger('change');
              view.$el.find('#login-form').trigger('submit');
            });

            it('should alert an error', function () {
              expect(notification.alert).toHaveBeenCalledWith('Invalid password.', 'Error', 'Ok');
            });

            it('the submit button should be enabled', function () {
              expect(view.$el.find('#login')).not.toBeDisabled();
            });
          });
        });

        describe('with valid password and fetch suceeded', function () {

          beforeEach(function () {
            spyOn(persistedModel, 'fetch').and.callFake(function () {
              var d = $.Deferred();
              persistedModel.set({
                password: 'S@f3',
                key: '007',
                securityQuestion: 'CODE WELCOME',
                securityAnswer: 'CODE GET LOST'
              });
              d.resolve();
              return d.promise();
            });
            
            spyOn(session, 'store');
            spyOn(view, 'navigateTo');
            
            view.$el.find('#password').val('S@f3').trigger('change');
            view.$el.find('#login-form').trigger('submit');
          });

          it('the submit button should be disabled', function () {
            expect(view.$el.find('#login')).toBeDisabled();
          });

          it('should update the state session variable as LOGGED_IN', function () {
            expect(session.store).toHaveBeenCalledWith('state', 'LOGGED_IN');
          });

          it('should store the encryption/decryption key in session', function () {
            expect(session.store).toHaveBeenCalledWith('key', '007');
          });

          it('should return back to photos page', function () {
            expect(view.navigateTo).toHaveBeenCalledWith('#photos');
          });
        });
      });

    });

  });
});