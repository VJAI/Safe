define([
  'jquery',
  'underscore',
  'extensions',
  'session',
  'adapters/notification',
  'models/credential',
  'views/register',
  'templates'
], function (
  $,
  _,
  extensions,
  session,
  notification,
  Credential,
  RegisterView,
  templates
) {

  'use strict';

  describe('register view', function () {

    var view,
      model,
      securityQuestions = ['Where is eiffel tower?', 'Who directed Titanic?'];

    beforeEach(function () {
      spyOn(notification, 'alert').and.callFake(function () {
        return _.resolve();
      });

      model = new Credential();

      view = new RegisterView({
        model: model,
        securityQuestions: securityQuestions
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
            new RegisterView();
          }).toThrow(new Error('model is required'));
        });
      });

      describe('without security questions', function () {
        it('should throw error', function () {
          expect(function () {
            new RegisterView({
              model: model
            });
          }).toThrow(new Error('security questions required'));
        });
      });

      describe('with required arguments', function () {
        it('should exist with properties initialized', function () {
          expect(view).toBeDefined();
          expect(view.model).toBe(model);
          expect(view.securityQuestions).toBe(securityQuestions);
          expect(view.template).toBe(templates.register);
        });
      });

    });

    describe('when rendered', function () {

      beforeEach(function () {
        view.render();
      });

      it('should contain password textbox empty with maxlength 15', function () {
        var $password = view.$el.find('#password');

        expect($password).toHaveValue('');
        expect($password).toHaveAttr('maxlength', '15');
        expect($password).toHaveAttr('autocomplete', 'off');
      });

      it('should contain security questions dropdown with options of all passed questions', function () {
        expect(view.$el.find('#security-question option').length).toBe(securityQuestions.length + 1);
        expect(view.$el.find('#security-question option:eq(0)')).toBeSelected();
        expect(view.$el.find('#security-question option:eq(0)')).toHaveText('Select a question');

        for (var i = 0; i < securityQuestions.length; i++) {
          var $option = view.$el.find('#security-question option:eq(' + (i + 1) + ')');
          expect($option).toHaveText(securityQuestions[i]);
        }
      });

      it('should contain the answer textbox empty, disabled, maxlength 15 and autocomplete off', function () {
        var $securityanswer = view.$el.find('#security-answer');

        expect($securityanswer).toHaveValue('');
        expect($securityanswer).toHaveAttr('maxlength', '15');
        expect($securityanswer).toHaveAttr('autocomplete', 'off');
        expect($securityanswer).toBeDisabled();
      });

      it('should contain submit button as disabled', function () {
        expect(view.$el.find('#register')).toBeDisabled();
      });
    });

    describe('when changes', function () {

      beforeEach(function () {
        view.render();
      });

      describe('with no security question is selected', function () {

        beforeEach(function () {
          view.$el.find('#security-question').val('Select a question').trigger('change');
        });

        it('then the answer textbox should be empty and disabled', function () {
          var $securityanswer = view.$el.find('#security-answer');

          expect($securityanswer).toHaveValue('');
          expect($securityanswer).toBeDisabled();
        });
      });

      describe('with security question is selected', function () {

        beforeEach(function () {
          view.$el.find('#security-question').val('Where is eiffel tower?').trigger('change');
        });

        it('then the answer textbox should be enabled', function () {
          expect(view.$el.find('#security-answer')).not.toBeDisabled();
        });
      });

      describe('with all fields not filled', function () {
        beforeEach(function () {
          view.$el.find('#password').val('S@f5').trigger('change');
          view.$el.find('#security-question').val('Where is eiffel tower?').trigger('change');
        });

        it('then the register button should be disabled', function () {
          expect(view.$el.find('#register')).toBeDisabled();
        });
      });

      describe('with all fields filled', function () {

        beforeEach(function () {
          view.$el.find('#password').val('S@f5').trigger('change');
          view.$el.find('#security-question').val('Where is eiffel tower?').trigger('change');
          view.$el.find('#security-answer').val('France').trigger('change');
        });

        it('then the register button should be enabled', function () {
          expect(view.$el.find('#register')).not.toBeDisabled();
        });
      });


      describe('when form is submitted', function () {

        describe('without all fields filled', function () {

          beforeEach(function () {
            view.$el.find('#password').val('S@f5').trigger('change');
            view.$el.find('#security-question').val('Where is eiffel tower?').trigger('change');
            view.$el.find('#register-form').trigger('submit');
            
            spyOn(view.model, 'save');
          });

          it('should alert an error', function () {
            expect(notification.alert).toHaveBeenCalledWith('Fill all the fields.', 'Error', 'Ok');
          });

          it('should not call model.save', function () {
            expect(view.model.save).not.toHaveBeenCalled();
          });
        });

        describe('with all the fields filled', function () {

          beforeEach(function () {
            view.$el.find('#password').val('S@f5').trigger('change');
            view.$el.find('#security-question').val('Where is eiffel tower?').trigger('change');
            view.$el.find('#security-answer').val('France').trigger('change');
          });

          describe('and failed to save', function () {

            beforeEach(function () {
              spyOn(view.model, 'save').and.callFake(function () {
                return _.reject();
              });

              view.$el.find('#register-form').trigger('submit');
            });

            it('should display notification', function () {
              expect(notification.alert).toHaveBeenCalledWith('Registration failed. Please try again.', 'Error', 'Ok');
            });

            it('should enable back the register button', function () {
              expect(view.$el.find('#register')).not.toBeDisabled();
            });
          });

          describe('and save succeeded', function () {

            beforeEach(function () {
              spyOn(view, 'navigateTo');

              spyOn(view.model, 'save').and.callFake(function () {
                return _.resolve();
              });
              
              spyOn(session, 'store');

              view.$el.find('#register-form').trigger('submit');
            });

            it('should update the state session variable to LOGGED_OUT', function () {
              expect(session.store).toHaveBeenCalledWith('state', 'LOGGED_OUT');
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