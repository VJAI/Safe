define([
  'jquery',
  'underscore',
  'extensions',
  'session',
  'adapters/notification',
  'models/credential',
  'views/changepassword',
  'templates'
], function (
  $,
  _,
  extensions,
  session,
  notification,
  Credential,
  ChangePasswordView,
  templates
) {

  'use strict';

  describe('changepassword view', function () {

    var view, model, credential;

    beforeEach(function () {
      spyOn(notification, 'alert').and.callFake(function () {
        return _.resolve();
      });

      model = new Credential();

      credential = new Credential({
        id: 'Safe-Credential'
      });

      view = new ChangePasswordView({
        model: model,
        credential: credential
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
            new ChangePasswordView();
          }).toThrow(new Error('model is required'));
        });
      });

      describe('without credential', function () {
        it('should throw error', function () {
          expect(function () {
            new ChangePasswordView({
              model: new Credential()
            });
          }).toThrow(new Error('credential is required'));
        });
      });

      describe('with required arguments', function () {
        it('should exist with properties initialized', function () {
          expect(view).toBeDefined();
          expect(view.model).toBe(model);
          expect(view.credential).toBe(credential);
          expect(view.template).toBe(templates.changepassword);
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
        expect(view.$el.find('#change')).toBeDisabled();
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
          expect(view.$el.find('#change')).toBeDisabled();
        });
      });

      describe('with the password textbox not empty', function () {

        beforeEach(function () {
          view.$el.find('#password').val('Ch@ng3d').trigger('change');
        });

        it('then the password property of the model should not be empty', function () {
          expect(view.model.get('password')).toBe('Ch@ng3d');
        });

        it('then the submit button should be enabled', function () {
          expect(view.$el.find('#change')).not.toBeDisabled();
        });
      });

      describe('when form is submitted', function () {

        describe('without any password', function () {

          beforeEach(function () {
            view.$el.find('#password').val('').trigger('change');
            view.$el.find('#changepassword-form').trigger('submit');
          });

          it('should alert an error', function () {
            expect(notification.alert).toHaveBeenCalledWith('Enter the password.', 'Error', 'Ok');
          });
        });

        describe('with password', function () {

          beforeEach(function () {
            view.$el.find('#password').val('Ch@ng3d').trigger('change');
          });

          describe('and failed to fetch', function () {

            beforeEach(function () {
              spyOn(view.credential, 'fetch').and.callFake(function () {
                return _.reject();
              });

              view.$el.find('#changepassword-form').trigger('submit');
            });

            it('should display notification', function () {
              expect(notification.alert).toHaveBeenCalledWith('Failed to change password. Please try again.', 'Error', 'Ok');
            });

            it('should enable back the change button', function () {
              expect(view.$el.find('#change')).not.toBeDisabled();
            });
          });

          describe('and fetch succeeded', function () {

            beforeEach(function () {
              spyOn(view.credential, 'fetch').and.callFake(function () {
                view.credential.set({
                  password: 'S@f3',
                  key: '007',
                  securityQuestion: 'CODE WELCOME',
                  securityAnswer: 'CODE GET LOST'
                });

                return _.resolve();
              });
            });

            describe('and failed to save', function () {

              beforeEach(function () {
                spyOn(view.credential, 'save').and.callFake(function () {
                  return _.reject();
                });

                view.$el.find('#changepassword-form').trigger('submit');
              });

              it('should display notification', function () {
                expect(notification.alert).toHaveBeenCalledWith('Failed to change password. Please try again.', 'Error', 'Ok');
              });

              it('should enable back the change button', function () {
                expect(view.$el.find('#change')).not.toBeDisabled();
              });
            });

            describe('and save succeeded', function () {

              beforeEach(function () {
                spyOn(view.credential, 'save').and.callFake(function () {
                  return _.resolve();
                });

                spyOn(session, 'store');
                spyOn(session, 'remove');
                spyOn(view, 'navigateTo');

                view.$el.find('#changepassword-form').trigger('submit');
              });

              it('should update the state session variable to LOGGED_OUT', function () {
                expect(session.store).toHaveBeenCalledWith('state', 'LOGGED_OUT');
              });

              it('should removed the key from session', function () {
                expect(session.remove).toHaveBeenCalled();
              });

              it('should navigate to login page', function () {
                expect(view.navigateTo).toHaveBeenCalledWith('#login');
              });
            });

          });

        });
      });
    });
  });
});